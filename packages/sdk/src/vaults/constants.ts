import { AddressZero } from '@ethersproject/constants';
import { ChainId } from '../constants';

/**
 * Order factory address list
 */
export const ORDER_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: '',
  [ChainId.GNOSIS]: '0x45B91Da2834010751b17F1eadE0a5a7B64233add',
  [ChainId.GOERLI]: '0x6123653C60FAF7576FD567C5f6c7b71e4a98f401',
};

/**
 * DCA Order singleton/mastercopy address list
 */
export const DCAORDER_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0xb8B01eAD81DCF4E95C700DEA4D4fB90fc8099696',
  [ChainId.GOERLI]: '0x95e05d6bc600e015ccac449e480e10a5f72b9d46',
};

/**
 * DCA Order singleton/mastercopy address list
 */
export const NFT_WHITELIST_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x610a4F6f4A9fDf5c715d60a65758d2fd9B6Ee138',
  [ChainId.GOERLI]: AddressZero,
};

/**
 * COW's settlement address list
 */
export const COW_SETTLEMENT_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
  [ChainId.GNOSIS]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
  [ChainId.GOERLI]: '0x9008D19f58AAbD9eD0D60971565AA8510560ab41',
};

export const SUBGRAPH_ENDPOINT_LIST: Readonly<Record<string, string>> = {
  [ChainId.ETHEREUM]: 'https://api.thegraph.com/subgraphs/name/swaprhq/stackly-eth',
  [ChainId.GNOSIS]: 'https://api.thegraph.com/subgraphs/name/swaprhq/stackly',
  [ChainId.GOERLI]: 'https://api.thegraph.com/subgraphs/name/swaprhq/stackly-goerli',
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
 * Gets the address of the order singleton for a given chain id
 * @param chainId The chain id
 * @returns
 */
export function getNftWhitelistAddress(chainId: ChainId): string {
  const address = NFT_WHITELIST_ADDRESS_LIST[chainId];
  if (address === AddressZero) {
    throw new Error(`NFT Whitelist is not deployed on chain ${chainId}`);
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
    [ChainId.GOERLI]: '0x9008d19f58aabd9ed0d60971565aa8510560ab41',
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
