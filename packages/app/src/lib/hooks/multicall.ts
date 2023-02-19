import { useBlockNumber, useNetwork } from 'wagmi';
import { multicall } from '../state/multicall';

export type { CallStateResult } from '@uniswap/redux-multicall'; // re-export for convenience
export { NEVER_RELOAD } from '@uniswap/redux-multicall'; // re-export for convenience

// Create wrappers for hooks so consumers don't need to get latest block themselves

// From https://stackoverflow.com/a/67605309/1345206
// Used for slicing tuples (e.g. picking some subset of a param type)

type TupleSplit<
  T,
  N extends number,
  O extends readonly any[] = readonly []
> = O['length'] extends N
  ? [O, T]
  : T extends readonly [infer F, ...(infer R)]
  ? TupleSplit<readonly [...R], N, readonly [...O, F]>
  : [O, T];

export type SkipFirst<T extends readonly any[], N extends number> = TupleSplit<
  T,
  N
>[1];

type SkipFirstTwoParams<T extends (...args: any) => any> = SkipFirst<
  Parameters<T>,
  2
>;

export function useMultipleContractSingleData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useMultipleContractSingleData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useMultipleContractSingleData(
    chainId,
    latestBlock,
    ...args
  );
}

export function useSingleCallResult(
  ...args: SkipFirstTwoParams<typeof multicall.hooks.useSingleCallResult>
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleCallResult(chainId, latestBlock, ...args);
}

export function useSingleContractMultipleData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useSingleContractMultipleData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleContractMultipleData(
    chainId,
    latestBlock,
    ...args
  );
}

export function useSingleContractWithCallData(
  ...args: SkipFirstTwoParams<
    typeof multicall.hooks.useSingleContractWithCallData
  >
) {
  const { chainId, latestBlock } = useCallContext();
  return multicall.hooks.useSingleContractWithCallData(
    chainId,
    latestBlock,
    ...args
  );
}

function useCallContext() {
  const { chain } = useNetwork();
  const chainId = chain?.id as number;
  const { data: latestBlock } = useBlockNumber();
  return { chainId, latestBlock };
}
