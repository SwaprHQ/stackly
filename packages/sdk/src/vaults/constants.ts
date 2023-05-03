import { AddressZero } from '@ethersproject/constants';
import { ChainId } from '../constants';

/**
 * Order factory address list
 */
export const ORDER_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x3976B81ffb024075Be2e412a974E67E4448051B4',
};

/**
 * DCA Order singleton/mastercopy address list
 */
export const DCAORDER_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0xd8a2295fe8E047eEEE2620617A6Fc5f87fDff9a6',
};

/**
 * COW's settlement address list
 */
export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: '0xC92E8bdf79f0507f65a392b0ab4667716BFE0110',
  [ChainId.GNOSIS]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<string, string>> = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/adamazad/dca-dev-ethereum',
  [ChainId.GNOSIS]: 'https://api.thegraph.com/subgraphs/name/adamazad/dca-dev-gnosis',
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
