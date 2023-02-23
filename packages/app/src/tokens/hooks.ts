import {
  Amount,
  ChainId,
  Currency,
  Ether,
  getERC20Contract,
  NativeCurrency,
  Token,
  xDAI,
} from 'dca-sdk';
import { useEffect, useMemo, useState } from 'react';
import { useNetwork, useProvider } from 'wagmi';

const _nativeCurrencyCache = {
  [ChainId.ETHEREUM]: Ether.onChain(ChainId.ETHEREUM),
  [ChainId.GNOSIS]: new xDAI(),
};

function nativeOnChain(chainId: ChainId): NativeCurrency {
  return _nativeCurrencyCache[chainId];
}

export default function useNativeCurrency(): NativeCurrency | Token {
  const { chain } = useNetwork();
  const chainId = chain?.id ?? ChainId.ETHEREUM;
  return useMemo(() => nativeOnChain(chainId), [chainId]);
}

export function useCurrencyBalance(
  userAddress: string | undefined,
  token: Currency | undefined
) {
  const provider = useProvider();
  const [loading, setLoading] = useState(true);
  const [balance, setBalance] = useState<Amount<Currency> | undefined>();
  const [error, setError] = useState<Error | null>();

  useEffect(() => {
    if (!userAddress || !token?.address || !provider) {
      return;
    }

    try {
      const getBalancePromise = token.isToken
        ? getERC20Contract(token.address, provider).balanceOf(userAddress)
        : provider.getBalance(userAddress);

      getBalancePromise
        .then((balance) => {
          setBalance(Amount.fromRawAmount(token, balance));
        })
        .catch((error) => {

          console.log('Error getting the balance', error);
          setError(error);
          setBalance(undefined);
        })
        .finally(() => {
          setLoading(false);
        });
    } catch (error) {
      console.error('Error getting the balance', error);
    }
  }, [userAddress, token, token?.chainId, provider]);

  return {
    loading,
    balance,
    error,
  };
}



