import { ChainId, Currency, USDC, WETH } from 'dca-sdk';
import { AutoColumn } from '../../components/Column';
import { AutoRow } from '../../components/Row';
import styled from 'styled-components/macro';
import { currencyId } from '../../utils';

const MobileWrapper = styled(AutoColumn)`
  @media (max-width: 480px) {
    display: none;
  }
`;

const BaseWrapper = styled.div<{ disable?: boolean }>`
  border: 1px solid;
  border-radius: 16px;
  display: flex;
  padding: 6px;
  padding-right: 12px;

  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
  }
`;

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[];
};

const COMMON_BASES: ChainCurrencyList = {
  [ChainId.ETHEREUM]: [WETH[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM]],
  [ChainId.GNOSIS]: [WETH[ChainId.GNOSIS], USDC[ChainId.GNOSIS]],
};

export function CommonBases({
  chainId,
  onSelect,
  selectedCurrency,
}: {
  chainId?: number;
  selectedCurrency?: Currency | null;
  onSelect: (currency: Currency) => void;
}) {
  const bases =
    typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : [];

  if (bases.length === 0) {
    return null;
  }

  return (
    <MobileWrapper gap="md">
      <AutoRow gap="4px">
        {bases.map((currency) => {
          const isSelected = selectedCurrency?.equals(currency);

          return (
            <BaseWrapper
              tabIndex={0}
              onKeyPress={(e) =>
                !isSelected && e.key === 'Enter' && onSelect(currency)
              }
              onClick={() => !isSelected && onSelect(currency)}
              disable={isSelected}
              key={currencyId(currency)}
            >
              <span
                style={{
                  fontWeight: 500,
                  fontSize: 16,
                }}
              >
                {currency.symbol}
              </span>
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </MobileWrapper>
  );
}
