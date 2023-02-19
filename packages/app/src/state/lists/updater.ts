import {
  getVersionUpgrade,
  minVersionBump,
  VersionUpgrade,
} from '@uniswap/token-lists';
import ms from 'ms.macro';
import { useCallback, useEffect } from 'react';
import { useProvider } from 'wagmi';
import { useFetchListCallback } from '../../lib/hooks/useTokenList/useFetchListCallback';
import {
  DEFAULT_LIST_OF_LISTS,
  UNSUPPORTED_LIST_URLS,
} from '../../token-list/lists';
import useInterval from '../../hooks/useInterval';
import { useIsWindowVisible } from '../../hooks/useIsWindowVisible';
import { useAppDispatch } from '../hooks';
import { useAllLists } from '../lists/hooks';
import { acceptListUpdate } from './actions';

/**
 *
 * @returns
 */
export function ListsUpdater(): null {
  const provider = useProvider({
    chainId: 1,
  });
  const dispatch = useAppDispatch();
  const isWindowVisible = useIsWindowVisible();

  // get all loaded lists, and the active urls
  const lists = useAllLists();
  const fetchList = useFetchListCallback();
  const fetchAllListsCallback = useCallback(() => {
    if (!isWindowVisible) return;
    console.log({ DEFAULT_LIST_OF_LISTS });
    DEFAULT_LIST_OF_LISTS.forEach((url) => {
      // Skip validation on unsupported lists
      const isUnsupportedList = UNSUPPORTED_LIST_URLS.includes(url);
      fetchList(url, isUnsupportedList).catch((error) =>
        console.warn('interval list fetching error', error)
      );
    });
  }, [fetchList, isWindowVisible]);

  // fetch all lists every 10 minutes, but only after we initialize provider
  useInterval(fetchAllListsCallback, provider ? ms`10m` : null);

  // whenever a list is not loaded and not loading, try again to load it
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list.current && !list.loadingRequestId && !list.error) {
        fetchList(listUrl).catch((error) =>
          console.debug('list added fetching error', error)
        );
      }
    });
  }, [dispatch, fetchList, lists]);

  // if any lists from unsupported lists are loaded, check them too (in case new updates since last visit)
  useEffect(() => {
    UNSUPPORTED_LIST_URLS.forEach((listUrl) => {
      const list = lists[listUrl];
      if (!list || (!list.current && !list.loadingRequestId && !list.error)) {
        fetchList(listUrl, /* isUnsupportedList= */ true).catch((error) =>
          console.debug('list added fetching error', error)
        );
      }
    });
  }, [dispatch, fetchList, lists]);

  // automatically update lists if versions are minor/patch
  useEffect(() => {
    Object.keys(lists).forEach((listUrl) => {
      const list = lists[listUrl];
      if (list.current && list.pendingUpdate) {
        const bump = getVersionUpgrade(
          list.current.version,
          list.pendingUpdate.version
        );
        switch (bump) {
          case VersionUpgrade.NONE:
            throw new Error('unexpected no version bump');
          case VersionUpgrade.PATCH:
          case VersionUpgrade.MINOR: {
            const min = minVersionBump(
              list.current.tokens,
              list.pendingUpdate.tokens
            );
            // automatically update minor/patch as long as bump matches the min update
            if (bump >= min) {
              dispatch(acceptListUpdate(listUrl));
            } else {
              console.error(
                `List at url ${listUrl} could not automatically update because the version bump was only PATCH/MINOR while the update had breaking changes and should have been MAJOR`
              );
            }
            break;
          }
          // update any active or inactive lists
          case VersionUpgrade.MAJOR:
            dispatch(acceptListUpdate(listUrl));
        }
      }
    });
  }, [dispatch, lists]);

  return null;
}
