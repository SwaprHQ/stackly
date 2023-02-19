import { createMulticall, ListenerOptions } from '@uniswap/redux-multicall';
import { ChainId, getMulticallContract } from 'dca-sdk';
import { useMemo } from 'react';
import { useBlockNumber, useNetwork, useProvider } from 'wagmi';
// import { useMulticallContract } from '../../multicall/hooks';

export const multicall = createMulticall();

export function useMulticallContract() {
  const provider = useProvider();

  return useMemo(() => {
    if (provider) {
      return getMulticallContract(provider);
    }
  }, [provider]);
}

function getBlocksPerFetchForChainId(chainId: number | undefined): number {
  switch (chainId) {
    case ChainId.GNOSIS:
      return 15;
    default:
      return 1;
  }
}

export function MulticallUpdater() {
  const { chain } = useNetwork();
  const chainId = chain?.id as number;
  const { data: latestBlockNumber } = useBlockNumber();
  const contract = useMulticallContract();
  const listenerOptions: ListenerOptions = useMemo(
    () => ({
      blocksPerFetch: getBlocksPerFetchForChainId(chainId),
    }),
    [chainId]
  );

  return (
    <multicall.Updater
      chainId={chainId}
      latestBlockNumber={latestBlockNumber}
      contract={contract}
      listenerOptions={listenerOptions}
    />
  );
}
