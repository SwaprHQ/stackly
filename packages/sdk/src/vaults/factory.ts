import { AddressZero } from '@ethersproject/constants';
import type { ContractReceipt } from '@ethersproject/contracts';
import type { Provider } from '@ethersproject/abstract-provider';
import type { Signer } from '@ethersproject/abstract-signer';

import { getCOWProtocolSettlementAddress, getDCAOrderSingletonAddress } from './constants';
import { ChainId } from '../constants';
import {
  OrderFactory__factory,
  DCAOrder__factory,
  ERC20__factory,
  OrderFactory,
  Multicall__factory,
  ERC20Bytes32__factory,
} from '../generated/contracts';

/**
 * Creates a contract instance for a DCA order
 * @param proxyAddress
 * @param provider
 * @returns
 */
export function getDCAOrderContract(proxyAddress: string, signerOrProvider: Provider | Signer) {
  return DCAOrder__factory.connect(proxyAddress, signerOrProvider);
}

/**
 * Create a contract instance for an ERC20 token
 * @param tokenAddress
 * @param provider
 * @returns
 */
export function getERC20Contract(tokenAddress: string, signerOrProvider: Provider | Signer) {
  return ERC20__factory.connect(tokenAddress, signerOrProvider);
}

/**
 * Create a contract instance for an ERC20 bytes 32 token
 * @param tokenAddress
 * @param provider
 * @returns
 */
export function getERC20Byte32Contract(tokenAddress: string, signerOrProvider: Provider | Signer) {
  return ERC20Bytes32__factory.connect(tokenAddress, signerOrProvider);
}

/**
 *
 * @param address
 * @param provider
 * @returns
 */
export function getOrderFactory(address: string, signerOrProvider: Provider | Signer) {
  if (address === AddressZero) {
    throw new Error(`Zero address is not a valid order factory address`);
  }

  return OrderFactory__factory.connect(address, signerOrProvider);
}

export function getOrderFactoryInterface() {
  return OrderFactory__factory.createInterface();
}

export function getDCAOrderInterface() {
  return DCAOrder__factory.createInterface();
}

export function getERC20Interface() {
  return ERC20__factory.createInterface();
}

export function getorderAddressFromTransactionReceipt(receipt: ContractReceipt) {
  const orderFactoryInterface = getOrderFactoryInterface();
  let prxoyAddress: undefined | string;

  receipt.events?.forEach((event) => {
    if (event.event === orderFactoryInterface.events['OrderCreated(address)'].name) {
      prxoyAddress = event.args?.[0];
    }
  });

  return prxoyAddress;
}

interface CreateorderWithNonceInitializeParams {
  receiver: string;
  sellToken: string;
  buyToken: string;
  principal: string;
  startTime: number;
  endTime: number;
  interval: number;
  owner: string;
  nonce: number;
}

/**
 * Creates a DCA order with a given nonce
 * @param orderFactory The order factory contract
 * @param param0
 * @returns
 */
export async function createDCAOrderWithNonce(
  orderFactory: OrderFactory,
  {
    owner,
    receiver,
    sellToken,
    buyToken,
    principal,
    startTime,
    endTime,
    interval,
    nonce,
  }: CreateorderWithNonceInitializeParams
) {
  const rawChainId = (await orderFactory.provider.getNetwork().then((n) => n.chainId)) as number;
  const chainId = rawChainId as ChainId;

  if (chainId !== ChainId.ETHEREUM && chainId !== ChainId.GNOSIS) {
    throw new Error(`Chain id ${chainId} is not supported`);
  }

  const singleton = getDCAOrderSingletonAddress(chainId);
  const settlementContract = getCOWProtocolSettlementAddress(chainId);

  const initializer = getDCAOrderInterface().encodeFunctionData('initialize', [
    owner,
    receiver,
    sellToken,
    buyToken,
    principal,
    startTime,
    endTime,
    interval,
    settlementContract,
  ]);

  const createTx = await orderFactory.createOrderWithNonce(singleton, initializer, nonce);

  return createTx;
}

export const MULTICALL_ADDRESS = '0xcA11bde05977b3631167028862bE2a173976CA11';

/**
 * Returns a contract instance for the Multicall contract
 * @param signerOrProvider
 * @returns
 */
export function getMulticallContract(signerOrProvider: Provider | Signer) {
  return Multicall__factory.connect(MULTICALL_ADDRESS, signerOrProvider);
}
