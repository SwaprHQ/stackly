import { AddressZero } from '@ethersproject/constants';
import { ChainId } from '../constants';

/**
 * Order factory address list
 */
export const ORDER_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x40CF89E715F1fA37799fC3a17681a4C6a7bdfdd0',
};

/**
 * DCA Order singleton/mastercopy address list
 */
export const DCAORDER_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x521aC6dA724aD873977d3d0b5d7B4a52E1dC52b7',
};

/**
 * COW's settlement address list
 */
export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
  [ChainId.GNOSIS]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<string, string>> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GNOSIS]: 'https://api.thegraph.com/subgraphs/name/swaprhq/stackly',
};

/**
 * Returns the address of the order factory for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getOrderFactoryAddress(chainId: ChainId): string {
  const address = ORDER_FACTORY_ADDRESS_LIST[chainId];
  if (address === AddressZero) {
    throw new Error(`Order factory is not deployed on chain ${chainId}`);
  }

  return address;
}

/**
 * Gets the address of the order singleton for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getDCAOrderSingletonAddress(chainId: ChainId): string {
  const address = DCAORDER_SINGLETON_ADDRESS_LIST[chainId];
  if (address === AddressZero) {
    throw new Error(`DCAOrder singleton is not deployed on chain ${chainId}`);
  }

  return address;
}

/**
 * Gets the address of the settlement contract for a given chain id
 * @param chainId The chain id
 * @returns The address of the settlement contract
 */
export function getCOWProtocolSettlementAddress(chainId: ChainId): string {
  return {
    [ChainId.ETHEREUM]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
    [ChainId.GNOSIS]: '0x9008d19f58aabd9ed0d60971565aa8510560ab41',
  }[chainId];
}

/**
 * Get the subgraph endpoint for a chainId
 * @param chainId - Chain ID
 * @returns Subgraph endpoint
 * @throws Error if no subgraph endpoint is found for the chainId
 */
export function getSubgraphEndpoint(chainId: ChainId) {
  const endpoint = SUBGRAPH_ENDPOINT_LIST[chainId];

  if (!endpoint || endpoint === '') {
    throw new Error(`No subgraph endpoint for chainId ${chainId}`);
  }

  return endpoint;
}

/**
 * DCA Frequency interval. How often the order will be placed.
 */
export enum DCAFrequencyInterval {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
