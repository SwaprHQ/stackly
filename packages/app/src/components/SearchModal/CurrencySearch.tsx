import {
  KeyboardEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components/macro';
import { CurrencyRow } from './CurrencyList';
import CurrencyList from './CurrencyList';
import { UserAddedToken } from '../../token-list/types';
import { Currency, isAddress, Token } from 'dca-sdk';

import { useDebounce, useToggle } from '../../utils/hooks';

import useNativeCurrency from '../../tokens/hooks';
import Column from '../Column';
import { useAllTokenBalances } from '../../tokens/useAllTokenBalances';
import {
  useAllTokens,
  useIsUserAddedToken,
  useSearchInactiveTokenLists,
  useToken,
} from '../../tokens/Tokens';
import { getTokenFilter } from '../../lib/hooks/useTokenList/filtering';
import {
  tokenComparator,
  useSortTokensByQuery,
} from '../../lib/hooks/useTokenList/sorting';
import { useOnClickOutside } from '../../hooks/useOnClickOutside';
import { CommonBases } from './CommonBases';
import { useNetwork } from 'wagmi';
import { FormGroup, TextInput } from '../form';

interface CurrencySearchProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency, hasWarning?: boolean) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showCurrencyAmount?: boolean;
  showNativeCurrency?: boolean;
  disableNonToken?: boolean;
}

export function CurrencySearch({
  selectedCurrency,
  onCurrencySelect,
  otherSelectedCurrency,
  showCommonBases,
  showCurrencyAmount,
  showNativeCurrency,
  disableNonToken,
  onDismiss,
  isOpen,
}: CurrencySearchProps) {
  const chainId = useNetwork().chain?.id as number;
  const [tokenLoaderTimerElapsed, setTokenLoaderTimerElapsed] = useState(false);
  // refs for fixed size lists
  const fixedList = useRef<FixedSizeList>();
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedQuery = useDebounce(searchQuery, 200);
  const searchToken = useToken(debouncedQuery);
  const searchTokenIsAdded = useIsUserAddedToken(searchToken);
  const defaultTokens = useAllTokens();
  const filteredTokens: Token[] = useMemo(() => {
    return Object.values(defaultTokens).filter(getTokenFilter(debouncedQuery));
  }, [defaultTokens, debouncedQuery]);

  // if they input an address, use it
  const isAddressSearch = isAddress(debouncedQuery);

  const { balances, loading: balancesAreLoading } = useAllTokenBalances();
  const sortedTokens: Token[] = useMemo(
    () =>
      !balancesAreLoading
        ? filteredTokens
            .filter((token) => {
              // If there is no query, filter out unselected user-added tokens with no balance.
              if (!debouncedQuery && token instanceof UserAddedToken) {
                if (
                  selectedCurrency?.equals(token) ||
                  otherSelectedCurrency?.equals(token)
                ) {
                  return true;
                }
                return balances[token.address]?.greaterThan(0);
              }
              return true;
            })
            .sort(tokenComparator.bind(null, balances))
        : [],
    [
      balances,
      balancesAreLoading,
      debouncedQuery,
      filteredTokens,
      otherSelectedCurrency,
      selectedCurrency,
    ]
  );
  const isLoading = Boolean(balancesAreLoading && !tokenLoaderTimerElapsed);

  const filteredSortedTokens = useSortTokensByQuery(
    debouncedQuery,
    sortedTokens
  );

  const native = useNativeCurrency();
  const wrapped = native?.wrapped;

  const searchCurrencies: Currency[] = useMemo(() => {
    if (!wrapped) return [];

    const s = debouncedQuery.toLowerCase().trim();

    const tokens = filteredSortedTokens.filter(
      (t) => !(t.equals(wrapped) || (disableNonToken && t.isNative))
    );

    const natives = showNativeCurrency
      ? (disableNonToken || native.equals(wrapped)
          ? [wrapped]
          : [native, wrapped]
        ).filter(
          (n) =>
            n.symbol?.toLowerCase()?.indexOf(s) !== -1 ||
            n.name?.toLowerCase()?.indexOf(s) !== -1
        )
      : [wrapped];
    return [...natives, ...tokens];
  }, [
    debouncedQuery,
    filteredSortedTokens,
    wrapped,
    disableNonToken,
    showNativeCurrency,
    native,
  ]);

  const handleCurrencySelect = useCallback(
    (currency: Currency, hasWarning?: boolean) => {
      onCurrencySelect(currency, hasWarning);
      if (!hasWarning) {
        onDismiss();
      }
    },
    [onDismiss, onCurrencySelect]
  );

  // clear the input on open
  useEffect(() => {
    if (isOpen) setSearchQuery('');
  }, [isOpen]);

  // manage focus on modal show
  // const inputRef = useRef<HTMLInputElement>();
  const handleInput = useCallback((value: string) => {
    // const input = event.target.value;
    const checksummedInput = isAddress(value);
    setSearchQuery(checksummedInput || value);
    fixedList.current?.scrollTo(0);
  }, []);

  const handleEnter = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        const s = debouncedQuery.toLowerCase().trim();
        if (s === native?.symbol?.toLowerCase()) {
          handleCurrencySelect(native);
        } else if (searchCurrencies.length > 0) {
          if (
            searchCurrencies[0].symbol?.toLowerCase() ===
              debouncedQuery.trim().toLowerCase() ||
            searchCurrencies.length === 1
          ) {
            handleCurrencySelect(searchCurrencies[0]);
          }
        }
      }
    },
    [debouncedQuery, native, searchCurrencies, handleCurrencySelect]
  );

  // menu ui
  const [open, toggle] = useToggle(false);
  const node = useRef<HTMLDivElement>();
  useOnClickOutside(node, open ? toggle : undefined);

  // if no results on main list, show option to expand into inactive
  const filteredInactiveTokens = useSearchInactiveTokenLists(
    filteredTokens.length === 0 ||
      (debouncedQuery.length > 2 && !isAddressSearch)
      ? debouncedQuery
      : undefined
  );

  // Timeout token loader after 3 seconds to avoid hanging in a loading state.
  useEffect(() => {
    const tokenLoaderTimer = setTimeout(() => {
      setTokenLoaderTimerElapsed(true);
    }, 3000);
    return () => clearTimeout(tokenLoaderTimer);
  }, []);

  return (
    <ContentWrapper>
      <FormGroup>
        <TextInput
          border={false}
          id="token-search-input"
          placeholder="Search name or paste address"
          autoComplete="off"
          value={searchQuery}
          onChange={handleInput}
          onKeyDown={handleEnter}
        />
      </FormGroup>
      {showCommonBases && (
        <CommonBases chainId={chainId} onSelect={handleCurrencySelect} selectedCurrency={selectedCurrency} />
      )}
      {searchToken && !searchTokenIsAdded ? (
        <Column style={{ padding: '20px 0', height: '100%' }}>
          <CurrencyRow
            currency={searchToken}
            isSelected={Boolean(searchToken && selectedCurrency && selectedCurrency.equals(searchToken))}
            onSelect={(hasWarning: boolean) => searchToken && handleCurrencySelect(searchToken, hasWarning)}
            otherSelected={Boolean(searchToken && otherSelectedCurrency && otherSelectedCurrency.equals(searchToken))}
            showCurrencyAmount={showCurrencyAmount}
          />
        </Column>
      ) : searchCurrencies?.length > 0 || filteredInactiveTokens?.length > 0 || isLoading ? (
        <div style={{ flex: '1' }}>
          <AutoSizer disableWidth>
            {({ height }) => (
              <CurrencyList
                height={height}
                currencies={searchCurrencies}
                onCurrencySelect={handleCurrencySelect}
                otherCurrency={otherSelectedCurrency}
                selectedCurrency={selectedCurrency}
                fixedListRef={fixedList}
                showCurrencyAmount={showCurrencyAmount}
                isLoading={isLoading}
              />
            )}
          </AutoSizer>
        </div>
      ) : (
        <div style={{ padding: '20px', height: '100%' }}>No results found.</div>
      )}
    </ContentWrapper>
  );
}

const ContentWrapper = styled(Column)`
  width: 100%;
  flex: 1 1;
  position: relative;
`;
