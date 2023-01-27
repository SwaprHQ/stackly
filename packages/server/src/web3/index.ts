import { JsonRpcProvider } from '@ethersproject/providers';
import { config } from 'dotenv';
import { ChainId } from 'dca-sdk';
import { getEnv, getRequiredEnv } from '../utils/env';

const production = getEnv('NODE_ENV') === 'production';
if (!production) {
  config();
}

const PROVIDER_LIST: Record<ChainId, JsonRpcProvider> = {
  [ChainId.ETHEREUM]: new JsonRpcProvider(
    getRequiredEnv('ETHEREUM_RPC_ENDPOINT')
  ),
  [ChainId.GNOSIS]: new JsonRpcProvider(getRequiredEnv('GNOSIS_RPC_ENDPOINT')),
};

/**
 * Returns the provider for the given chainId
 * @param chainId
 * @returns
 */
export function getProvider(chainId: ChainId): JsonRpcProvider {
  return PROVIDER_LIST[chainId];
}
