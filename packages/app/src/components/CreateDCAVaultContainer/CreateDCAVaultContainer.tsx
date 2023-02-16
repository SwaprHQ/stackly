import dayjs, { Dayjs } from 'dayjs';
import { BigNumber, constants } from 'ethers';
import { useEffect, useState } from 'react';
import {
  USDC,
  Token,
  ChainId,
  Amount,
  WXDAI,
  WETH,
  DCAFrequencyInterval,
  getOrderFactory,
  getOrderFactoryAddress,
  createDCAOrderWithNonce,
  getorderAddressFromTransactionReceipt,
  getERC20Contract,
} from 'dca-sdk';
import { FormGroup } from '../form/FormGroup';
import { FlexContainer, FormButtonGroup, InnerContainer } from './styled';
import { NumberInput } from '../form/NumberInput';
import { InputGroup } from '../form';

import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { Card, CardInnerWrapper } from '../Card';
import { Container, ContainerTitle } from '../Container';
import { ShadowButton } from '../form/FormButton';
import { Modal, useModal } from '../../context/Modal';
import styled from 'styled-components';
import { SelectBalanceButtonContainer } from '../SelectBalanceButtonContainer';
import {
  VaultCreateAndDepositStepsModalProps,
  CreateVaultAndDepositStep,
} from '../Modal/CreateVaultSteps';
import { FrequencyIntervalSelect, TokenSelect } from './TokenSelect';

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

export function getFrequencyIntervalInHours(interval: DCAFrequencyInterval) {
  switch (interval) {
    case DCAFrequencyInterval.HOUR:
      return 1;
    case DCAFrequencyInterval.DAY:
      return 24;
    case DCAFrequencyInterval.WEEK:
      return 24 * 7;
    case DCAFrequencyInterval.MONTH:
      return 24 * 30;
    default:
      return 1;
  }
}

function WalletConnectButton() {
  const account = useAccount();
  const { openModal } = useModal();
  const { chains, chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isNetworkSupported = chains.find((c) => c.id === chain?.id);

  if (account.isConnected && !isNetworkSupported) {
    return (
      <ShadowButton
        type="button"
        onClick={() => switchNetworkAsync?.(ChainId.GNOSIS)}
      >
        Switch Network
      </ShadowButton>
    );
  }

  return (
    <ShadowButton
      type="button"
      onClick={() => openModal(Modal.Wallet)}
      title="Connect Wallet"
    >
      Connect Wallet
    </ShadowButton>
  );
}

export function CreateDCAVaultContainer() {
  const account = useAccount();
  const { chain, chains } = useNetwork();
  const { openModal, setModalData } =
    useModal<VaultCreateAndDepositStepsModalProps>();
  const { data: signer } = useSigner();
  const [startAt, setStartAt] = useState<Dayjs>(dayjs().add(1, 'h'));
  const [endAt, setEndAt] = useState<Dayjs>(dayjs().add(25, 'h'));
  const [hourInterval, setHourInterval] = useState<number>(1);
  const [frequencyInterval, setFrequencyInterval] =
    useState<DCAFrequencyInterval>(DCAFrequencyInterval.HOUR);
  const [sellTokenAmount, setSellTokenAmount] = useState<Amount<Token>>(
    new Amount(tokenOptions[0], '0')
  );
  const [buyToken, setBuyToken] = useState<Token>(WETH[ChainId.GNOSIS]);
  const [createVaultError, setCreateVaultError] = useState<Error | null>(null);
  const [receiver] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<BigNumber | null>(null);

  useEffect(() => {
    if (!signer || !account.address || !sellTokenAmount.currency.address) {
      return;
    }

    let factoryAddress;
    try {
      factoryAddress = getOrderFactoryAddress(chain?.id as ChainId);
    } catch (e) {
      return;
    }

    getERC20Contract(sellTokenAmount.currency.address, signer)
      .allowance(account.address, factoryAddress)
      .then(setAllowance);
  }, [signer, account.address, sellTokenAmount.currency.address, chain?.id]);

  const isNetworkSupported = !!chains.find((c) => c.id === chain?.id);

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
    let orderProxy: undefined | string;
    // Open the modal with initial required data
    openModal(Modal.VaultCreateAndDepositSteps, {
      chainId,
      stepsCompleted: [],
      tokenSymbol: sellTokenAmount.currency.symbol,
      tokenDepositAmount: parseFloat(sellTokenAmount.toFixed(3)),
    });

    const sellTokenContract = getERC20Contract(
      sellTokenAmount.currency.address,
      signer
    );

    // Skip to next step if allowance is sufficient
    if (allowance && allowance.gt(sellTokenAmount.toRawAmount())) {
      setModalData((prev) => ({
        ...prev,
        stepsCompleted: [CreateVaultAndDepositStep.APPROVE_FACTORY],
        approveFactoryReceipt: {} as any,
      }));
    } else {
      // Approve factory to spend sell token
      const approveFactoryTransaction = await sellTokenContract.approve(
        getOrderFactoryAddress(chainId),
        constants.MaxUint256
      );

      setModalData((prev) => ({
        ...prev,
        approveFactoryTransaction,
      }));

      const approveFactoryReceipt = await approveFactoryTransaction.wait();

      setModalData((prev) => ({
        ...prev,
        stepsCompleted: [CreateVaultAndDepositStep.APPROVE_FACTORY],
        approveFactoryReceipt,
      }));
    }
    // Create a new vault if one doesn't exist
    const orderFactory = getOrderFactory(
      getOrderFactoryAddress(chainId),
      signer
    );

    const initParams: Parameters<typeof createDCAOrderWithNonce>['1'] = {
      nonce: dayjs().unix(),
      // dca order params
      owner: account.address as string,
      receiver: receiver ?? (account.address as string), // TODO: add receiver
      sellToken: sellTokenAmount.currency.address,
      buyToken: buyToken.address,
      principal: sellTokenAmount.toRawAmount().toString(),
      startTime: startAt.utc().unix(),
      endTime: endAt.utc().unix(),
      interval: hourInterval,
    };

    console.log(initParams);

    const createOrderTransaction = await createDCAOrderWithNonce(
      orderFactory,
      initParams
    );

    setModalData((prev) => ({
      ...prev,
      createOrderTransaction,
    }));

    const createOrderReceipt = await createOrderTransaction.wait();

    if (!createOrderReceipt.status) {
      setCreateVaultError(new Error('Could not create vault'));
      return;
    }

    orderProxy = getorderAddressFromTransactionReceipt(createOrderReceipt);

    if (!orderProxy) {
      setCreateVaultError(new Error('Could not create vault'));
      return;
    }

    setModalData((prev) => ({
      ...prev,
      stepsCompleted: [
        ...prev.stepsCompleted,
        CreateVaultAndDepositStep.CREATE_ORDER,
      ],
      createOrderReceipt,
      orderProxy,
      isOrderCreated: true,
    }));
  };

  // Calculate the number of buy orders
  const buyOrders = Math.ceil(endAt.diff(startAt, 'hours') / hourInterval);
  const buyAmountPerOrder = sellTokenAmount.div(
    buyOrders === 0 ? 1 : buyOrders
  );

  return (
    <Container>
      <ContainerTitle>Create Order</ContainerTitle>
      <FlexContainer>
        <InnerContainer>
          <Card>
            <CardInnerWrapper>
              <form>
                <FormGroup>
                  <label>From</label>
                  <InputGroup>
                    <NumberInput
                      value={sellTokenAmount.toString()}
                      onChange={(nextSellAmount) => {
                        setSellTokenAmount(
                          new Amount(sellTokenAmount.currency, nextSellAmount)
                        );
                        setCreateVaultError(null);
                      }}
                    />
                    <TokenSelect
                      value={sellTokenAmount.currency as Token}
                      onChange={(nextSellToken) => {
                        setSellTokenAmount(
                          new Amount(nextSellToken, sellTokenAmount.toString())
                        );
                      }}
                    />
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
                  <label>To</label>
                  <TokenSelect
                    value={buyToken}
                    onChange={(nextBuyToken) => {
                      // Prevent the user from selecting the same token for buy and sell
                      if (
                        nextBuyToken.address ===
                        sellTokenAmount.currency.address
                      ) {
                        return;
                      }
                      setBuyToken(nextBuyToken);
                    }}
                  />
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
                  <FrequencyIntervalSelect
                    value={frequencyInterval}
                    onChange={(nextFrequencyInterval) => {
                      const nextHourInterval = getFrequencyIntervalInHours(
                        nextFrequencyInterval
                      );
                      setFrequencyInterval(nextFrequencyInterval);
                      setHourInterval(nextHourInterval);
                    }}
                  />
                </FormGroup>
                <FormButtonGroup>
                  {account.isConnected && isNetworkSupported ? (
                    <ShadowButton
                      type="button"
                      onClick={onCreateOrderHandler}
                      title="Create Order"
                      disabled={!account.isConnected}
                    >
                      Create
                    </ShadowButton>
                  ) : (
                    <WalletConnectButton />
                  )}
                </FormButtonGroup>
              </form>
              {buyAmountPerOrder.greaterThan(0) && (
                <OrderInfo>
                  <p>
                    Buying {buyAmountPerOrder.toFixed(2)}{' '}
                    {sellTokenAmount.currency.symbol} worth of {buyToken.symbol}{' '}
                    every {frequencyInterval} for {buyOrders} times
                  </p>
                </OrderInfo>
              )}
              {createVaultError && (
                <div>
                  <p>{createVaultError.message}</p>
                </div>
              )}
            </CardInnerWrapper>
          </Card>
        </InnerContainer>
      </FlexContainer>
    </Container>
  );
}
