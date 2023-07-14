import { ChainId, Currency, USDC, WETH, SWPR, WBTC } from 'dca-sdk';
import { AutoColumn } from '../../components/Column';
import { AutoRow } from '../../components/Row';
import styled from 'styled-components/macro';
import { currencyId } from '../../utils';
import { Button } from '../../ui/components/Button/Button';

const MobileWrapper = styled(AutoColumn)`
  @media (max-width: 480px) {
    display: none;
  }
`;

const BaseWrapper = styled(Button)<{
  disable?: boolean;
}>`
  display: flex;
  padding: 0px 6px;
  align-items: center;
  :hover {
    cursor: ${({ disable }) => !disable && 'pointer'};
  }
  font-size: 14px;
  min-width: auto;
  height: 40px;
`;

type ChainCurrencyList = {
  readonly [chainId: number]: Currency[];
};

const COMMON_BASES: ChainCurrencyList = {
  [ChainId.ETHEREUM]: [WETH[ChainId.ETHEREUM], USDC[ChainId.ETHEREUM], WBTC[ChainId.ETHEREUM], SWPR[ChainId.ETHEREUM]],
  [ChainId.GNOSIS]: [WETH[ChainId.GNOSIS], USDC[ChainId.GNOSIS], WBTC[ChainId.GNOSIS], SWPR[ChainId.GNOSIS]],
  [ChainId.GOERLI]: [WETH[ChainId.GOERLI], USDC[ChainId.GOERLI]],
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
  const bases = typeof chainId !== 'undefined' ? COMMON_BASES[chainId] ?? [] : [];

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
              onKeyPress={(e) => !isSelected && e.key === 'Enter' && onSelect(currency)}
              onClick={() => !isSelected && onSelect(currency)}
              disable={isSelected}
              key={currencyId(currency)}
            >
              {currency.symbol}
            </BaseWrapper>
          );
        })}
      </AutoRow>
    </MobileWrapper>
  );
}
