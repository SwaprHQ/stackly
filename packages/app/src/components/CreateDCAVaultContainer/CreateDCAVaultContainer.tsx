import dayjs, { Dayjs, isDayjs } from 'dayjs';
import { BigNumber } from 'ethers';
import { useEffect, useState } from 'react';
import {
  USDC,
  ChainId,
  Amount,
  WETH,
  DCAFrequencyInterval,
  getOrderFactory,
  getOrderFactoryAddress,
  createDCAOrderWithNonce,
  getorderAddressFromTransactionReceipt,
  getERC20Contract,
  Currency,
  getCOWProtocolSettlementAddress,
  getDCAOrderSingletonAddress,
} from 'dca-sdk';
import { FormGroup } from '../form/FormGroup';
import { FlexContainer, FormButtonGroup, InnerContainer } from './styled';
import dayjsUTCPlugin from 'dayjs/plugin/utc';
import { useAccount, useNetwork, useSigner, useSwitchNetwork } from 'wagmi';
import { CardExtraShadow as Card, CardInnerWrapper } from '../Card';
import { Container } from '../Container';
import { Modal, useModal } from '../../modal';
import styled from 'styled-components';
import { VaultCreateAndDepositStepsModalProps, CreateVaultAndDepositStep } from '../Modal/CreateVaultSteps';
import { FrequencyIntervalSelect, getFrequencyIntervalInHours } from './FrequencyIntervalSelect';
import { DateTimeInput } from '../form/DateTime';
import { CurrencyAmountInput } from '../CurrencyAmountInput';
import { CurrencyInput } from '../CurrencyAmountInput/CurrencyInput';
import { Button, WhiteButton } from '../../ui/components/Button/Button';
import { useCurrencyBalance } from '../../tokens/hooks';
import { Sdk, TransactionRequest, Web3WalletProvider, randomPrivateKey } from 'etherspot';
import { Web3Auth } from '@web3auth/modal';
import { MetamaskAdapter } from '@web3auth/metamask-adapter';
import Web3 from 'web3';
import { CHAIN_NAMESPACES } from '@web3auth/base';
import { retry } from '../../utils/retry';

const metamaskAdapter = new MetamaskAdapter();

//Initialize within your constructor
const web3auth = new Web3Auth({
  clientId: 'BP0JoR-e4jT9Cp6VnYSajms1Df6IOXA3fUGbIQS9kB-kYVONVZd4BwG9iKGhwIqIlRyTfrNk3flGvb1oO--F3sw', // Get your Client ID from Web3Auth Dashboard
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x64', // Please use 0x5 for Goerli Testnet,
    rpcTarget: 'https://rpc.gnosischain.com/',
  },
});

web3auth.configureAdapter(metamaskAdapter);

async function createSDK(wallet: any) {
  const sdk = new Sdk(wallet);

  sdk.notifications$.subscribe((notification) => console.log('notification:', notification));

  await sdk.computeContractAccount();

  const { account } = sdk.state;

  console.log('contract account:', account);

  // top-up contract account (account.address)

  // add transaction to gateway batch
  // await sdk.batchExecuteAccountTransaction({
  //   to: '0xEEb4801FBc9781EEF20801853C1Cb25faB8A7a3b',
  //   value: 100, // 100 wei
  // });

  // console.log('gateway batch estimation:', await sdk.estimateGatewayBatch());

  // console.log('submitted gateway batch:', await sdk.submitGatewayBatch());
  return sdk;
}

async function connect() {
  const web3authProvider = await web3auth.connect();

  const web3 = new Web3(web3authProvider as any);
  const web3provider = new Web3WalletProvider(web3.currentProvider as any);
  // Refresh the web3 Injectable to validate the provider
  await web3provider.refresh();
  return createSDK(web3provider);
}

dayjs.extend(dayjsUTCPlugin);

function WalletConnectButton() {
  const account = useAccount();
  const { openModal } = useModal();
  const { chain } = useNetwork();
  const { switchNetworkAsync } = useSwitchNetwork();
  const isNetworkSupported = chain && !chain.unsupported;

  if (account.isConnected && !isNetworkSupported) {
    return (
      <Button type="button" onClick={() => switchNetworkAsync?.(ChainId.GNOSIS)}>
        Switch Network
      </Button>
    );
  }

  return (
    <Button type="button" onClick={() => openModal(Modal.Wallet)} title="Connect Wallet">
      Connect Wallet
    </Button>
  );
}

function getInitialSellTokenAmountValue(chain?: ReturnType<typeof useNetwork>['chain']) {
  return chain && chain.id && !chain.unsupported
    ? new Amount(USDC[chain.id as ChainId], '0')
    : new Amount(USDC[ChainId.ETHEREUM], '0');
}

function getInitialBuyTokenValue(chain?: ReturnType<typeof useNetwork>['chain']) {
  return chain && chain.id && !chain.unsupported ? WETH[chain.id as ChainId] : WETH[ChainId.ETHEREUM];
}

export function getFrequencyIntervalToEndDatetime(startAt: Dayjs | 'Now', interval: DCAFrequencyInterval) {
  let startDate = startAt as Dayjs;
  if (startAt === 'Now') startDate = dayjs();

  switch (interval) {
    case DCAFrequencyInterval.HOUR:
      return startDate.add(48, 'h');
    case DCAFrequencyInterval.DAY:
      return startDate.add(30, 'd');
    case DCAFrequencyInterval.WEEK:
      return startDate.add(8, 'w');
    case DCAFrequencyInterval.MONTH:
      return startDate.add(3, 'm');
    default:
      return startDate.add(48, 'h');
  }
}

export function CreateDCAVaultContainer() {
  const account = useAccount();
  const { chain, chains } = useNetwork();
  const { openModal, setModalData } = useModal<VaultCreateAndDepositStepsModalProps>();
  const { data: signer } = useSigner();
  const [validationError, setValidationError] = useState<Error | null>(null);
  const [frequencyInterval, setFrequencyInterval] = useState<DCAFrequencyInterval>(DCAFrequencyInterval.HOUR);
  const [startAt, setStartAt] = useState<Dayjs | 'Now'>('Now');
  const [endAt, setEndAt] = useState<Dayjs>(getFrequencyIntervalToEndDatetime(startAt, frequencyInterval)); // 7 days from now
  const [sellTokenAmount, setSellTokenAmount] = useState<Amount<Currency>>(getInitialSellTokenAmountValue(chain));
  const { balance: userSellTokenBalance } = useCurrencyBalance(account.address, sellTokenAmount.currency);
  const [buyToken, setBuyToken] = useState<Currency>(getInitialBuyTokenValue(chain));
  const [createVaultError, setCreateVaultError] = useState<Error | null>(null);
  const [receiver] = useState<string | null>(null);
  const [allowance, setAllowance] = useState<BigNumber | null>(null);

  const [sdk, setSDK] = useState<Sdk | null>(null);
  // Update initial values when chain changes
  useEffect(() => {
    setSellTokenAmount(getInitialSellTokenAmountValue(chain));
    setBuyToken(getInitialBuyTokenValue(chain));
  }, [signer, chain]);

  useEffect(() => {
    setEndAt(getFrequencyIntervalToEndDatetime(startAt, frequencyInterval));
  }, [frequencyInterval, startAt]);

  // Update allowance when account or sell token changes
  useEffect(() => {
    if (!signer || !account.address || !sellTokenAmount.currency.address) {
      return;
    }
    let factoryAddress;
    try {
      factoryAddress = getOrderFactoryAddress(chain?.id as ChainId);
      getERC20Contract(sellTokenAmount.currency.address, signer)
        .allowance(account.address, factoryAddress)
        .then(setAllowance);
    } catch (e) {
      console.error(e);
    }
  }, [signer, account.address, sellTokenAmount.currency.address, chain, sellTokenAmount]);

  // Validate the user has enough balance
  useEffect(() => {
    if (!signer || !account.address || !sellTokenAmount.currency.address || !userSellTokenBalance) {
      return;
    }
    if (userSellTokenBalance?.lessThan(sellTokenAmount)) {
      setValidationError(new Error('Insufficient balance'));
    } else {
      setValidationError(null);
    }
  }, [userSellTokenBalance, signer, account.address, sellTokenAmount]);

  const isNetworkSupported = !!chains.find((c) => c.id === chain?.id);

  const onCreateOrderHandler = async () => {
    setCreateVaultError(null);

    // Start date must be in the future
    if (isDayjs(startAt) && startAt.isBefore(dayjs())) {
      return setCreateVaultError(new Error('Starting date must be in the future'));
    }
    // End date must be after start date
    if (endAt.isBefore(startAt)) {
      return setCreateVaultError(new Error('Until date must be after starting date'));
    }

    if (startAt === 'Now' && endAt.isBefore(dayjs().add(10, 'm'))) {
      return setCreateVaultError(new Error('Until date must be more than 10 minutes after starting date'));
    }

    if (!signer) {
      return setCreateVaultError(new Error('No signer found'));
    }

    if (sellTokenAmount.eq('0')) {
      return setCreateVaultError(new Error(`${sellTokenAmount.currency.symbol} amount must be greater than zero`));
    }

    const chainId = chain?.id as ChainId;
    let orderProxy: undefined | string;
    // Open the modal with initial required data
    openModal(Modal.VaultCreateAndDepositSteps, {
      chainId,
      stepsCompleted: [CreateVaultAndDepositStep.APPROVE_FACTORY],
      tokenSymbol: sellTokenAmount.currency.symbol as string,
      tokenDepositAmount: parseFloat(sellTokenAmount.toFixed(3)),
    });

    const sellTokenContract = getERC20Contract(sellTokenAmount.currency.address, signer);

    // Skip to next step if allowance is sufficient
    if (allowance && allowance.gte(sellTokenAmount.toRawAmount())) {
      setModalData((prev) => ({
        ...prev,
        stepsCompleted: [CreateVaultAndDepositStep.CREATE_ORDER],
        approveFactoryReceipt: {} as any,
      }));
    } else {
      try {
        // Approve factory to spend sell token
        const approveFactoryTransaction = await sellTokenContract.approve(
          getOrderFactoryAddress(chainId),
          sellTokenAmount.toRawAmount()
        );

        setModalData((prev) => ({
          ...prev,
          approveFactoryTransaction,
        }));

        const approveFactoryReceipt = await approveFactoryTransaction.wait();

        setModalData((prev) => ({
          ...prev,
          stepsCompleted: [CreateVaultAndDepositStep.CREATE_ORDER],
          approveFactoryReceipt,
        }));
      } catch (e) {
        setModalData((prev) => ({
          ...prev,
          stepsCompleted: [CreateVaultAndDepositStep.REJECT_APPROVE_FACTORY],
        }));
        return;
      }
    }
    // Create a new vault if one doesn't exist
    const orderFactory = getOrderFactory(getOrderFactoryAddress(chainId), signer);

    const initParams: Parameters<typeof createDCAOrderWithNonce>['1'] = {
      nonce: dayjs().unix(),
      // dca order params
      owner: account.address as string,
      receiver: receiver ?? (account.address as string), // TODO: add receiver
      sellToken: sellTokenAmount.currency.address,
      buyToken: buyToken.address,
      amount: sellTokenAmount.toRawAmount().toString(),
      // If startAt is 'now', set it to the current time plus 10 minutes into the future
      startTime:
        startAt === 'Now' || startAt.utc().unix() < dayjs().add(10, 'm').utc().unix()
          ? dayjs().add(10, 'm').utc().unix()
          : startAt.utc().unix(),
      endTime: endAt.utc().unix(),
      interval: getFrequencyIntervalInHours(frequencyInterval),
    };

    try {
      const createOrderTransaction = await createDCAOrderWithNonce(orderFactory, initParams);

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
        stepsCompleted: [CreateVaultAndDepositStep.CREATE_ORDER],
        createOrderReceipt,
        orderProxy,
        isOrderCreated: true,
      }));
    } catch (e) {
      setModalData((prev) => ({
        ...prev,
        stepsCompleted: [CreateVaultAndDepositStep.REJECT_CREATE_ORDER],
      }));
    }
  };
  const { data: walletClient, isError, isLoading } = useSigner();

  useEffect(() => {
    const initAA = async () => {
      await web3auth.initModal();
    };
    initAA();
  }, [walletClient]);

  const createSDKInstance = async () => {
    const sdkInstance = await connect();
    console.log('sdkInstance', sdkInstance);
    setSDK(sdkInstance);
  };

  const executeStack = async () => {
    if (!sdk) return;

    const contractAbi = [
      'function createOrderWithNonce(address,address,address,address,address,uint256,uint256,uint256,uint256,address,uint256)',
    ];
    const orderContract = sdk.registerContract<{
      encodeCreateOrderWithNonce: (
        singleton: string,
        owner: string,
        receiver: string,
        sellToken: string,
        buyToken: string,
        amount: string,
        startTime: number,
        endTime: number,
        interval: number,
        settlementContract: string,
        nonce: number
      ) => TransactionRequest;
    }>('orderContract', contractAbi, getOrderFactoryAddress(ChainId.GNOSIS));

    const initParams = {
      nonce: dayjs().unix(),
      // dca order params
      owner: sdk.state.account.address,
      receiver: sdk.state.account.address, // TODO: add receiver
      sellToken: sellTokenAmount.currency.address,
      buyToken: buyToken.address,
      amount: sellTokenAmount.toRawAmount().toString(),
      // If startAt is 'now', set it to the current time plus 10 minutes into the future
      startTime:
        startAt === 'Now' || startAt.utc().unix() < dayjs().add(10, 'm').utc().unix()
          ? dayjs().add(10, 'm').utc().unix()
          : startAt.utc().unix(),
      endTime: endAt.utc().unix(),
      interval: getFrequencyIntervalInHours(frequencyInterval),
      settlementContract: getCOWProtocolSettlementAddress(ChainId.GNOSIS),
      singleton: getDCAOrderSingletonAddress(ChainId.GNOSIS),
    };

    // amount type is defined based on the constract function parameter type
    if (!orderContract.encodeCreateOrderWithNonce) return;

    const orderTransactionRequest = orderContract.encodeCreateOrderWithNonce(
      initParams.singleton,
      initParams.owner,
      initParams.receiver,
      initParams.sellToken,
      initParams.buyToken,
      initParams.amount,
      initParams.startTime,
      initParams.endTime,
      initParams.interval,
      initParams.settlementContract,
      initParams.nonce
    );

    const tokenContractAbi = ['function approve(address,uint256)'];
    const tokenContract = sdk.registerContract<{
      encodeApprove: (address: string, amount: string) => TransactionRequest;
    }>('tokenContract', tokenContractAbi, sellTokenAmount.currency.address);

    if (!tokenContract.encodeApprove) return;

    const tokenTransactionRequest = tokenContract.encodeApprove(
      getOrderFactoryAddress(ChainId.GNOSIS),
      sellTokenAmount.toRawAmount().toString()
    );

    console.log('hello', orderTransactionRequest, tokenTransactionRequest);

    if (orderTransactionRequest && tokenTransactionRequest) {
      console.log('hello2');

      await sdk
        .batchExecuteAccountTransaction({
          to: tokenTransactionRequest.to,
          data: tokenTransactionRequest.data,
        })
        .catch(console.error);

      await sdk
        .batchExecuteAccountTransaction({
          to: orderTransactionRequest.to,
          data: orderTransactionRequest.data,
        })
        .catch(console.error);

      const estimationResponse = await sdk.estimateGatewayBatch().catch(console.error);

      console.log('ETHERSPOT Gas estimated at:', estimationResponse);

      const submissionResponse = await sdk.submitGatewayBatch().catch(console.error);

      console.log('ETHERSPOT Submission response:', submissionResponse);
    }
  };

  return (
    <Container>
      <FlexContainer>
        <InnerContainer>
          <Card>
            <CardInnerWrapper>
              <form>
                <FormGroup>
                  <label>From</label>
                  <CurrencyAmountInput
                    disabled={!isNetworkSupported}
                    value={sellTokenAmount}
                    showNativeCurrency={false}
                    userAddress={account.address}
                    onChange={(nextSellAmount) => {
                      // If the user select a token that is the same as the buy token, we swap the buy token
                      if (nextSellAmount.currency.equals(buyToken)) {
                        const nextBuyToken = sellTokenAmount.currency;
                        setBuyToken(nextBuyToken);
                      }
                      setSellTokenAmount(nextSellAmount);
                      setCreateVaultError(null);
                    }}
                  />
                </FormGroup>
                <JoinedFormGroup>
                  <FormGroup id="buy-currency">
                    <label>Stack</label>
                    <CurrencyInput
                      disabled={!isNetworkSupported}
                      showNativeCurrency={false}
                      value={buyToken}
                      onChange={(nextBuyToken) => {
                        // Prevent selecting the same token for buy and sell
                        if (nextBuyToken.equals(sellTokenAmount.currency)) {
                          return;
                        }
                        setBuyToken(nextBuyToken);
                      }}
                    />
                  </FormGroup>
                  <FormGroup id="buy-frequency">
                    <label>Every</label>
                    <FrequencyIntervalSelect
                      disabled={!isNetworkSupported}
                      value={frequencyInterval}
                      onChange={(nextFrequencyInterval) => {
                        setFrequencyInterval(nextFrequencyInterval);
                      }}
                    />
                  </FormGroup>
                </JoinedFormGroup>
                <FormGroup>
                  <label>Starting</label>
                  <DateTimeInput
                    onChange={(value) => {
                      if (!value.isValid() || value.utc().unix() <= dayjs().utc().unix()) {
                        setStartAt('Now');
                      } else {
                        setStartAt(value);
                      }
                    }}
                    value={startAt}
                    disabled={!isNetworkSupported}
                  />
                </FormGroup>
                <FormGroup>
                  <label>Until</label>
                  <DateTimeInput
                    onChange={(value) => {
                      if (!value.isValid() || value.utc().unix() <= dayjs().utc().unix()) {
                        setEndAt(getFrequencyIntervalToEndDatetime(startAt, frequencyInterval));
                      } else {
                        setEndAt(value);
                      }
                    }}
                    value={endAt}
                    disabled={!isNetworkSupported}
                  />
                </FormGroup>
                {!!sdk && (
                  <div>
                    <p>{sdk.state.account.address}</p>
                  </div>
                )}
                <FormButtonGroup>
                  {account.isConnected && isNetworkSupported ? (
                    !sdk ? (
                      <Button
                        type="button"
                        onClick={createSDKInstance}
                        title="Create Order"
                        disabled={validationError !== null}
                      >
                        {validationError !== null ? validationError.message : <>Connect to AA</>}
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={executeStack}
                        title="Create Order"
                        disabled={validationError !== null}
                      >
                        {validationError !== null ? validationError.message : <>Create Stack with AA</>}
                      </Button>
                    )
                  ) : (
                    <WalletConnectButton />
                  )}
                  {/* <WhiteButton onClick={createSDKInstance}>Create account</WhiteButton> */}
                </FormButtonGroup>
              </form>
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

export const OrderInfo = styled.div`
  font-size: 18px;
  font-weight: bold;
`;

const JoinedFormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  & #buy-currency button {
    height: 100%;
  }
  & #buy-frequency {
    flex: 1;
  }
  @media (min-width: 320px) {
    flex-direction: row;
  }
`;
