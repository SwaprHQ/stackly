import { Amount, Currency, Token, WrappedTokenInfo } from 'dca-sdk';
import { CSSProperties, MutableRefObject, useCallback, useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import styled from 'styled-components/macro';
import { useAccount } from 'wagmi';
import { checkWarning } from '../../../token-list/tokenSafety';
import { useCurrencyBalance } from '../../../tokens/hooks';
import { Loader } from '../../Loader';

// import Column, { AutoColumn } from '../../Column';
// import Loader from '../../Loader';
// import Row, { RowFixed } from '../../Row';
// import { MouseoverTooltip } from '../../Tooltip';
import { LoadingRows, MenuItem } from '../styleds';
import { TokenTags } from './TokenTags';

function currencyKey(currency: Currency): string {
  return currency instanceof Token
    ? currency.address
    : currency.symbol ?? 'ETHER';
}

const CheckIcon = styled.div`
  background: #ff007a;
  border-radius: 50%;
  height: 20px;
  width: 20px;
  margin-left: 4px;
`;

const StyledBalanceText = styled.div`
  white-space: nowrap;
  overflow: hidden;
  max-width: 5rem;
  text-overflow: ellipsis;
`;

const CurrencyName = styled.div`
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const WarningContainer = styled.div`
  margin-left: 0.3em;
`;

function Balance({ balance }: { balance: Amount<Currency> }) {
  return (
    <StyledBalanceText title={balance.toFixed()}>
      {balance.toFixed(4)}
    </StyledBalanceText>
  );
}

export function CurrencyRow({
  currency,
  onSelect,
  isSelected,
  otherSelected,
  style,
  showCurrencyAmount,
}: {
  currency: Currency;
  onSelect: (hasWarning: boolean) => void;
  isSelected: boolean;
  otherSelected: boolean;
  style?: CSSProperties;
  showCurrencyAmount?: boolean;
}) {
  const { address: account } = useAccount();
  const key = currencyKey(currency);
  const { balance } = useCurrencyBalance(account ?? undefined, currency);
  const warning = currency.isNative ? null : checkWarning(currency.address);
  return (
    <MenuItem
      tabIndex={0}
      style={style}
      className={`token-item-${key}`}
      onKeyPress={(e) =>
        !isSelected && e.key === 'Enter' ? onSelect(!!warning) : null
      }
      onClick={() => (isSelected ? null : onSelect(!!warning))}
      disabled={isSelected}
      selected={otherSelected}
    >
      <div>
        <div>
          <CurrencyName title={currency.name}>{currency.name}</CurrencyName>
        </div>
        <h4>{currency.symbol}</h4>
      </div>
      <div>
        <TokenTags currency={currency} />
      </div>
      {showCurrencyAmount ? (
        <div style={{ justifySelf: 'flex-end' }}>
          {balance ? (
            <Balance balance={balance} />
          ) : account ? (
            <Loader />
          ) : null}
          {isSelected && <CheckIcon />}
        </div>
      ) : (
        isSelected && <div style={{ justifySelf: 'flex-end' }}>✅</div>
      )}
    </MenuItem>
  );
}

interface TokenRowProps {
  data: Array<Currency>;
  index: number;
  style: CSSProperties;
}

const LoadingRow = () => (
  <LoadingRows>
    <div />
    <div />
    <div />
  </LoadingRows>
);

export default function CurrencyList({
  height,
  currencies,
  otherListTokens,
  selectedCurrency,
  onCurrencySelect,
  otherCurrency,
  fixedListRef,
  showCurrencyAmount,
  isLoading,
}: {
  height: number;
  currencies: Currency[];
  otherListTokens?: WrappedTokenInfo[];
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency, hasWarning?: boolean) => void;
  otherCurrency?: Currency | null;
  fixedListRef?: MutableRefObject<FixedSizeList | undefined>;
  showCurrencyAmount?: boolean;
  isLoading: boolean;
}) {
  const itemData: Currency[] = useMemo(() => {
    if (otherListTokens && otherListTokens?.length > 0) {
      return [...currencies, ...otherListTokens];
    }
    return currencies;
  }, [currencies, otherListTokens]);

  const Row = useCallback(
    function TokenRow({ data, index, style }: TokenRowProps) {
      const row: Currency = data[index];

      const currency = row;

      const isSelected = Boolean(
        currency && selectedCurrency && selectedCurrency.equals(currency)
      );
      const otherSelected = Boolean(
        currency && otherCurrency && otherCurrency.equals(currency)
      );
      const handleSelect = (hasWarning: boolean) =>
        currency && onCurrencySelect(currency, hasWarning);

      if (isLoading) {
        return LoadingRow();
      } else if (currency) {
        return (
          <CurrencyRow
            style={style}
            currency={currency}
            isSelected={isSelected}
            onSelect={handleSelect}
            otherSelected={otherSelected}
            showCurrencyAmount={showCurrencyAmount}
          />
        );
      } else {
        return null;
      }
    },
    [
      onCurrencySelect,
      otherCurrency,
      selectedCurrency,
      showCurrencyAmount,
      isLoading,
    ]
  );
  const itemKey = useCallback((index: number, data: typeof itemData) => {
    const currency = data[index];
    return currencyKey(currency);
  }, []);

  return (
    <div style={{ paddingRight: '8px', paddingTop: '8px' }}>
      {isLoading ? (
        <FixedSizeList
          // className={styles.scrollbarStyle}
          height={height}
          ref={fixedListRef as any}
          width="100%"
          itemData={[]}
          itemCount={10}
          itemSize={56}
        >
          {LoadingRow}
        </FixedSizeList>
      ) : (
        <FixedSizeList
          // className={styles.scrollbarStyle}
          height={height}
          ref={fixedListRef as any}
          width="100%"
          itemData={itemData}
          itemCount={itemData.length}
          itemSize={56}
          itemKey={itemKey}
        >
          {Row}
        </FixedSizeList>
      )}
    </div>
  );
}
