import { Amount, Token, isAddress, getERC20Interface } from 'dca-sdk';
import { useMemo } from 'react';
import { useAccount, useNetwork } from 'wagmi';
import { useMultipleContractSingleData } from '../lib/hooks/multicall';
import { useAllTokens } from './Tokens';
// import { useAllTokens } from '../token-list';

const tokenBalancesGasRequirement = { gasRequired: 185_000 }

/**
 * Returns a map of token addresses to their eventually consistent token balances for a single account.
 */
export function useTokenBalancesWithLoadingIndicator(
  address?: string,
  tokens?: (Token | undefined)[]
): [{ [tokenAddress: string]: Amount<Token> | undefined }, boolean] {
  const { chain } = useNetwork(); // we cannot fetch balances cross-chain
  const chainId = chain?.id as number;

  const validatedTokens: Token[] = useMemo(
    () =>
      tokens?.filter(
        (t?: Token): t is Token =>
          isAddress(t?.address) !== false && t?.chainId === chainId
      ) ?? [],
    [chainId, tokens]
  );
  const validatedTokenAddresses = useMemo(
    () => validatedTokens.map((vt) => vt.address),
    [validatedTokens]
  );

  const balances = useMultipleContractSingleData(
    validatedTokenAddresses,
    getERC20Interface(),
    'balanceOf',
    useMemo(() => [address], [address]),
    tokenBalancesGasRequirement
  );

  const anyLoading: boolean = useMemo(
    () => balances.some((callState) => callState.loading),
    [balances]
  );

  return useMemo(
    () => [
      address && validatedTokens.length > 0
        ? validatedTokens.reduce<{
            [tokenAddress: string]: Amount<Token> | undefined;
          }>((memo, token, i) => {
            const value = balances?.[i]?.result?.[0]; // this is a BigNumber
            if (value) {
              memo[token.address] = Amount.fromRawAmount(token, value);
            }
            return memo;
          }, {})
        : {},
      anyLoading,
    ],
    [address, validatedTokens, anyLoading, balances]
  );
}

// mimics useAllBalances
export function useAllTokenBalances() {
  const { address } = useAccount();
  const allTokens = useAllTokens();
  const allTokensArray = useMemo(() => Object.values(allTokens ?? {}), [
    allTokens,
  ]);

  const [balances, balancesIsLoading] = useTokenBalancesWithLoadingIndicator(
    address ?? undefined,
    allTokensArray
  );

  return {
    balances,
    loading: balancesIsLoading,
  };
}
