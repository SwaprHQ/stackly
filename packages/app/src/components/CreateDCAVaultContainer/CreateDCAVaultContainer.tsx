import dayjs, { Dayjs } from 'dayjs';
import { useState } from 'react';
import {
  USDC,
  Token,
  ChainId,
  Amount,
  WXDAI,
  WETH,
  DCAFrequencyInterval,
  getVaultFactory,
  getVaultFactoryAddress,
  getERC20Contract,
  createVaultWithNonce,
  DollarCostAveragingOrder,
  signOrder,
  getVaultAddressFromTransactionReceipt,
} from 'dca-sdk';
import { FormGroup } from '../form/FormGroup';
import { FlexContainer, FormButtonGroup, InnerContainer } from './styled';
import { NumberInput } from '../form/NumberInput';
import { InputGroup } from '../form';

import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { useAccount, useNetwork, useSigner } from 'wagmi';
import { Card, CardInnerWrapper } from '../Card';
import { Container, ContainerTitle } from '../Container';
import { ShadowButton } from '../form/FormButton';
import { Modal, useModal } from '../../context/Modal';
import styled from 'styled-components';
import { SelectBalanceButtonContainer } from '../SelectBalanceButtonContainer';
import { postOrder } from '../../api';
import {
  VaultCreateAndDepositStepsModalProps,
  CreateVaultAndDeposiStep,
} from '../Modal/CreateVaultSteps';

dayjs.extend(dayjsUTCPlugin);
export const OrderInfo = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const tokenOptions = [USDC[ChainId.GNOSIS], WXDAI, WETH[ChainId.GNOSIS]];

export function findTokenByAddress(address: string) {
  return tokenOptions.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
}

export function CreateDCAVaultContainer() {
  const account = useAccount();
  const { chain } = useNetwork();
  const { openModal, setModalData } =
    useModal<VaultCreateAndDepositStepsModalProps>();
  const { data: signer } = useSigner();
  const [startAt, setStartAt] = useState<Dayjs>(dayjs().add(1, 'h'));
  const [endAt, setEndAt] = useState<Dayjs>(dayjs().add(25, 'h'));
  const [frequency] = useState<number>(1); // This is hardcoded for now
  const [frequencyInterval, setFrequencyInterval] =
    useState<DCAFrequencyInterval>(DCAFrequencyInterval.DAY);
  const [sellTokenAmount, setSellTokenAmount] = useState<Amount<Token>>(
    new Amount(tokenOptions[0], '0')
  );
  const [buyToken, setBuyToken] = useState<Token>(WETH[ChainId.GNOSIS]);
  const [createVaultError, setCreateVaultError] = useState<Error | null>(null);
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);

  const onCreateOrderHandler = async () => {
    setCreateVaultError(null);

    // Start date must be in the future
    if (startAt.isBefore(dayjs())) {
      return setCreateVaultError(new Error('Start date must be in the future'));
    }

    // End date must be after start date
    if (endAt.isBefore(startAt)) {
      return setCreateVaultError(
        new Error('End date must be after start date')
      );
    }

    if (!signer) {
      return setCreateVaultError(new Error('No signer found'));
    }

    if (sellTokenAmount.eq('0')) {
      return setCreateVaultError(
        new Error(
          `${sellTokenAmount.currency.symbol} amount must be greater than zero`
        )
      );
    }

    const chainId = chain?.id as ChainId;

    // Open the modal with initial required data
    openModal(Modal.VaultCreateAndDepositSteps, {
      chainId,
      stepsCompleted: [],
      tokenSymbol: sellTokenAmount.currency.symbol,
      tokenDepositAmount: parseFloat(sellTokenAmount.toFixed(3)),
    });

    const vaultFactory = getVaultFactory(
      getVaultFactoryAddress(ChainId.GNOSIS),
      signer as any
    );

    const createVaultTransaction = await createVaultWithNonce({
      // chainId is inferred from the vaultFactory provider to find the singleton/mastercopy to use
      vaultFactory,
      nonce: dayjs().unix(),
      token: sellTokenAmount.currency.address,
      owner: account.address as string,
    });

    setModalData((prev) => ({
      ...prev,
      createVaultTransaction,
    }));

    const createVaultReceipt = await createVaultTransaction.wait();

    if (!createVaultReceipt.status) {
      setCreateVaultError(new Error('Could not create vault'));
      return;
    }

    const vault = getVaultAddressFromTransactionReceipt(createVaultReceipt);

    if (!vault) {
      setCreateVaultError(new Error('Could not create vault'));
      return;
    }

    setVaultAddress(vault);
    setModalData((prev) => ({
      ...prev,
      stepsCompleted: [CreateVaultAndDeposiStep.CREATE_VAULT],
      createVaultReceipt,
      vault,
      isDepositingToken: true,
    }));

    // Deposit the sell token amount into the vault
    const depositTx = await getERC20Contract(
      sellTokenAmount.currency.address,
      signer
    ).transfer(vault, sellTokenAmount.toRawAmount());

    setModalData((prev) => ({
      ...prev,
      depositTokenTransaction: depositTx,
    }));

    const depositTokenReceipt = await depositTx.wait();
    if (!depositTokenReceipt.status) {
      setCreateVaultError(new Error('Could not deposit sell token amount'));
      return;
    }

    setModalData((prev) => ({
      ...prev,
      stepsCompleted: [
        CreateVaultAndDeposiStep.CREATE_VAULT,
        CreateVaultAndDeposiStep.DEPOSIT_TOKEN,
      ],
      depositTokenReceipt,
      isCreatingOrder: true,
    }));

    // Create a DCA order for the vault and sign it
    // This will be sent to the server to be executed
    const order: DollarCostAveragingOrder = {
      sellToken: sellTokenAmount.currency.address,
      buyToken: buyToken.address,
      sellAmount: sellTokenAmount.toRawAmount().toString(),
      startAt: startAt.utc().unix(), // UTC time
      endAt: endAt.utc().unix(), // UTC time
      frequency,
      frequencyInterval,
      vault,
      recipient: account.address as string,
      chainId,
    };

    const signature = await signOrder(order, signer as any);
    const orderWithSignature = {
      ...order,
      signature,
    };
    // Send the order to the server to be executed
    await postOrder(orderWithSignature);

    setModalData((prev) => ({
      ...prev,
      stepsCompleted: [
        CreateVaultAndDeposiStep.CREATE_VAULT,
        CreateVaultAndDeposiStep.DEPOSIT_TOKEN,
        CreateVaultAndDeposiStep.CREATE_ORDER,
      ],
      isCreatingOrder: false,
      isOrderCreated: true,
    }));
  };

  // Calculate the number of buy orders
  const buyOrders = Math.ceil(
    endAt.diff(startAt, frequencyInterval) / frequency
  );

  const buyAmountPerOrder = sellTokenAmount.div(
    buyOrders === 0 ? 1 : buyOrders
  );

  return (
    <Container>
      <ContainerTitle>Create a Vault and Order</ContainerTitle>
      <FlexContainer>
        <InnerContainer>
          <Card>
            <CardInnerWrapper>
              <form>
                <FormGroup>
                  <label>From {sellTokenAmount.currency.symbol}</label>
                  <InputGroup>
                    <NumberInput
                      value={sellTokenAmount.toString()}
                      onChange={(nextSellAmount) => {
                        setSellTokenAmount(
                          new Amount(sellTokenAmount.currency, nextSellAmount)
                        );
                      }}
                    />
                    <select
                      value={sellTokenAmount.currency.address}
                      onChange={(nextTokenAddress) => {
                        const nextSellToken = findTokenByAddress(
                          nextTokenAddress.target.value
                        );
                        if (nextSellToken !== undefined) {
                          setSellTokenAmount(
                            new Amount(
                              nextSellToken,
                              sellTokenAmount.toString()
                            )
                          );
                        }
                      }}
                    >
                      {tokenOptions.map((option) => (
                        <option value={option.address} key={option.address}>
                          {option.symbol}
                        </option>
                      ))}
                    </select>
                  </InputGroup>
                  <SelectBalanceButtonContainer
                    tokenAddress={sellTokenAmount.currency.address}
                    tokenDecimals={sellTokenAmount.currency.decimals}
                    userAddress={account.address as string}
                    onBalanceSelect={(userBalance) => {
                      setSellTokenAmount(
                        Amount.fromRawAmount(
                          sellTokenAmount.currency,
                          userBalance
                        )
                      );
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>To {buyToken.symbol}</label>
                  <select
                    value={buyToken.address}
                    onChange={(nextTokenAddress) => {
                      const nextBuyToken = findTokenByAddress(
                        nextTokenAddress.target.value
                      );
                      if (nextBuyToken !== undefined) {
                        setBuyToken(nextBuyToken);
                      }
                    }}
                  >
                    {tokenOptions.map((option) => (
                      <option value={option.address} key={option.address}>
                        {option.symbol}
                      </option>
                    ))}
                  </select>
                </FormGroup>
                <FormGroup>
                  <label>Start At</label>
                  <input
                    type="datetime-local"
                    min={dayjs().format('YYYY-MM-DDTHH:mm')}
                    value={startAt.format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => {
                      // const nextStartAt = dayjs(e.target.value);
                      setStartAt(dayjs(e.target.value));
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>End At</label>
                  <input
                    type="datetime-local"
                    min={startAt.format('YYYY-MM-DDTHH:mm')}
                    value={endAt.format('YYYY-MM-DDTHH:mm')}
                    onChange={(e) => {
                      const nextEndAt = dayjs(e.target.value);
                      const isBeforeStartAt = nextEndAt.isBefore(startAt);
                      if (isBeforeStartAt) {
                        return;
                      }
                      setEndAt(nextEndAt);
                    }}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Buy {buyToken.symbol} every</label>
                  <select
                    value={frequencyInterval}
                    onChange={(e) => {
                      setFrequencyInterval(
                        e.target.value as DCAFrequencyInterval
                      );
                    }}
                  >
                    <option value={DCAFrequencyInterval.HOUR}>hour</option>
                    <option value={DCAFrequencyInterval.DAY}>day</option>
                    <option value={DCAFrequencyInterval.WEEK}>week</option>
                    <option value={DCAFrequencyInterval.MONTH}>month</option>
                  </select>
                </FormGroup>
                <FormButtonGroup>
                  {account.isConnected ? (
                    <ShadowButton
                      type="button"
                      onClick={onCreateOrderHandler}
                      title="Create Order"
                      disabled={!account.isConnected}
                    >
                      Create
                    </ShadowButton>
                  ) : (
                    <ShadowButton
                      type="button"
                      onClick={() => openModal(Modal.Wallet)}
                      title="Connect Wallet"
                    >
                      Connect Wallet
                    </ShadowButton>
                  )}
                </FormButtonGroup>
              </form>
              {buyAmountPerOrder.greaterThan(0) && (
                <OrderInfo>
                  <p>
                    Buying {buyAmountPerOrder.toFixed(2)}{' '}
                    {sellTokenAmount.currency.symbol} worth of {buyToken.symbol}{' '}
                    every {frequencyInterval}
                  </p>
                </OrderInfo>
              )}
              {createVaultError && (
                <div>
                  <p>{createVaultError.message}</p>
                </div>
              )}
              {vaultAddress && (
                <div>
                  <p>Vault Address: {vaultAddress}</p>
                </div>
              )}
            </CardInnerWrapper>
          </Card>
        </InnerContainer>
      </FlexContainer>
    </Container>
  );
}
