import { nanoid } from '@reduxjs/toolkit';
import { TokenList } from '@uniswap/token-lists';

import { AlchemyProvider } from '@ethersproject/providers';
import { useCallback } from 'react';
import { resolveENSContentHash } from '../../../utils/resolveENSContentHash';
import { fetchTokenList } from '../../../state/lists/actions';
import getTokenList from './fetchTokenList';
import { ALCHEMY_KEY } from '../../../wallet/providers';
import { useAppDispatch } from '../../../state/hooks';

const alchemyMainnet = new AlchemyProvider(
  {
    chainId: 1,
    name: 'homestead',
  },
  ALCHEMY_KEY
);

export function useFetchListCallback(): (
  listUrl: string,
  skipValidation?: boolean
) => Promise<TokenList> {
  const dispatch = useAppDispatch();

  return useCallback(
    async (listUrl: string, skipValidation?: boolean) => {
      const requestId = nanoid();
      dispatch(fetchTokenList.pending({ requestId, url: listUrl }));
      return getTokenList(
        listUrl,
        (ensName: string) => resolveENSContentHash(ensName, alchemyMainnet),
        skipValidation
      )
        .then((tokenList) => {
          dispatch(
            fetchTokenList.fulfilled({ url: listUrl, tokenList, requestId })
          );
          return tokenList;
        })
        .catch((error) => {
          console.debug(`Failed to get list at url ${listUrl}`, error);
          dispatch(
            fetchTokenList.rejected({
              url: listUrl,
              requestId,
              errorMessage: error.message,
            })
          );
          throw error;
        });
    },
    [dispatch]
  );
}
