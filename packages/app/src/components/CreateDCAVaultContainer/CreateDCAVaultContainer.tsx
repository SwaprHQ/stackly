import dayjs, { Dayjs } from 'dayjs';
import { utils } from 'ethers';
import { useState } from 'react';
import {
  DXD,
  USDC,
  Token,
  ChainId,
  Amount,
  WXDAI,
  WETH,
  DCAFrequencyInterval,
  getVaultFactory,
  getVaultFactoryAddress,
  getVaultSingletonAddress,
  getVaultInterface,
  getVaultAddressFromTransactionReceipt,
  getERC20Contract,
  DollarCostAveragingOrder,
} from 'dca-sdk';
import { FormGroup } from '../form/FormGroup';
import { FlexContainer, FormButtonGroup, InnerContainer } from './styled';
import { NumberInput } from '../form/NumberInput';
import { InputGroup } from '../form';

import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { useAccount, useSigner, useSignTypedData } from 'wagmi';
import { Card, CardInnerWrapper } from '../Card';
import { Container, ContainerTitle } from '../Container';
import { ShadowButton } from '../form/FormButton';
import { Modal, useModal } from '../../context/Modal';
import styled from 'styled-components';
import { SelectBalanceButtonContainer } from '../SelectBalanceButtonContainer';

dayjs.extend(dayjsUTCPlugin);

const driver = '0xf17bbF8cE0e4b3FD216a659bb15199f877AaD6FD';

export const OrderInfo = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const tokenOptions = [
  USDC[ChainId.GNOSIS],
  DXD[ChainId.GNOSIS],
  WXDAI,
  WETH[ChainId.GNOSIS],
];

export function findTokenByAddress(address: string) {
  return tokenOptions.find(
    (token) => token.address.toLowerCase() === address.toLowerCase()
  );
}

type OrderWithSignature = Omit<
  DollarCostAveragingOrder,
  'startAt' | 'endAt'
> & {
  startAt: number;
  endAt: number;
  signature: string;
};

export function CreateDCAVaultContainer() {
  const account = useAccount();
  const { openModal } = useModal();
  const { data: signer } = useSigner();
  const { signTypedDataAsync } = useSignTypedData();
  const [startAt, setStartAt] = useState<Dayjs>(dayjs());
  const [endAt, setEndAt] = useState<Dayjs>(dayjs().add(1, 'day'));
  const [buyFrequency] = useState<number>(1); // This is hardcoded for now
  const [buyFrequencyInterval, setBuyFrequencyInterval] =
    useState<DCAFrequencyInterval>(DCAFrequencyInterval.DAY);
  const [sellTokenAmount, setSellTokenAmount] = useState<Amount<Token>>(
    new Amount(tokenOptions[0], '0')
  );

  const [buyToken, setBuyToken] = useState<Token>(WETH[ChainId.GNOSIS]);
  const [createVaultError, setCreateVaultError] = useState<Error | null>(null);
  const [vaultAddress, setVaultAddress] = useState<string | null>(null);

  const [orderWithSignature, setOrderWithSignature] =
    useState<OrderWithSignature | null>(null);

  const onCreateOrderHandler = async () => {
    setCreateVaultError(null);

    // Start date must be in the future
    if (startAt.isBefore(dayjs())) {
      setCreateVaultError(new Error('Start date must be in the future'));
      return;
    }

    // End date must be after start date
    if (endAt.isBefore(startAt)) {
      setCreateVaultError(new Error('End date must be after start date'));
      return;
    }

    if (!signer) {
      setCreateVaultError(new Error('No signer found'));
      return;
    }

    const vaultFactoryContract = getVaultFactory(
      getVaultFactoryAddress(ChainId.GNOSIS),
      signer as any
    );

    const initilizer = getVaultInterface().encodeFunctionData('initialize', [
      await signer.getAddress(),
      driver,
      sellTokenAmount.currency.address,
    ]);

    const createVaultWithNonceTx =
      await vaultFactoryContract.createVaultWithNonce(
        getVaultSingletonAddress(ChainId.GNOSIS),
        initilizer,
        dayjs().unix()
      );

    const receipt = await createVaultWithNonceTx.wait();
    const vaultAddress = getVaultAddressFromTransactionReceipt(receipt);

    if (!vaultAddress) {
      setCreateVaultError(new Error('Could not find vault address'));
      return;
    }

    setVaultAddress(vaultAddress);

    // Deposit the sell token amount into the vault
    const vaultContract = getERC20Contract(
      sellTokenAmount.currency.address,
      signer
    );

    const depositTx = await vaultContract.transfer(
      vaultAddress,
      sellTokenAmount.toRawAmount()
    );

    const depositTxReceipt = await depositTx.wait();

    if (!depositTxReceipt.status) {
      setCreateVaultError(new Error('Could not deposit sell token amount'));
      return;
    }

    // Create EIP-712 order
    const order = {
      vault: vaultAddress,
      sellToken: sellTokenAmount.currency.address,
      buyToken: buyToken.address,
      sellAmount: sellTokenAmount.toRawAmount().toString(),
      startAt: startAt.utc().unix(),
      endAt: endAt.utc().unix(),
      frequency: buyFrequency,
      frequencyInterval: buyFrequencyInterval,
      chainId: ChainId.GNOSIS,
    };

    const orderHash = await signTypedDataAsync({});

    utils.keccak256(
      utils.defaultAbiCoder.encode(
        [
          'address', // vault
          'address', // sellToken
          'address', // buyToken
          'uint256', // sellAmount
          'uint256', // startAt
          'uint256', // endAt
          'uint256', // frequency
          'string', // frequencyInterval
          'uint256', // chainId
        ],
        [
          order.vault,
          order.sellToken,
          order.buyToken,
          order.sellAmount,
          order.startAt,
          order.endAt,
          order.frequency,
          order.frequencyInterval,
          order.chainId,
        ]
      )
    );

    const signature = await signer.signMessage(utils.arrayify(orderHash));

    const orderWithSignature = {
      ...order,
      signature,
    };

    console.log({
      orderWithSignature,
    });

    setOrderWithSignature(orderWithSignature);
  };

  // Calculate the number of buy orders
  const buyOrders = Math.ceil(
    endAt.diff(startAt, buyFrequencyInterval) / buyFrequency
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
                    value={buyFrequencyInterval}
                    onChange={(e) => {
                      setBuyFrequencyInterval(
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
                    every {buyFrequencyInterval}
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
              {orderWithSignature !== null && (
                <div>{JSON.stringify(orderWithSignature, null, 2)}</div>
              )}
            </CardInnerWrapper>
          </Card>
        </InnerContainer>
      </FlexContainer>
    </Container>
  );
}
