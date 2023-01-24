import { Provider } from '@ethersproject/abstract-provider';
import { Contract } from '@ethersproject/contracts';
import { ChainId, MULTICALL_ADDRESS } from '../../constants';
import { MULTICALL_ABI } from '../../abis/multicall';

/**
 * Get the Multicall contract for a given provider
 * @param provider
 * @returns
 */
export function getMulticallContractForProvider(provider: Provider): Contract {
  return new Contract(MULTICALL_ADDRESS, MULTICALL_ABI, provider);
}

/**
 * Get the Multicall contract for a given chain id
 * @param providerList - A list of providers for each chain id
 * @returns
 */
export function getMulticallContract(
  providerList: Record<ChainId, Provider>
): Record<ChainId, Contract> {
  return {
    [ChainId.ETHEREUM]: getMulticallContractForProvider(
      providerList[ChainId.ETHEREUM]
    ),
    [ChainId.GNOSIS]: getMulticallContractForProvider(
      providerList[ChainId.GNOSIS]
    ),
  };
}
