import { Amount, Currency } from 'dca-sdk';
import { utils } from 'ethers';
import { useCurrencyBalance } from '../../tokens/hooks';
import { numberFormatter } from '../../utils';

import { SelectBalanceButton } from './styled';

const { formatUnits } = utils;

export function SelectBalanceButtonContainer({
  userAddress,
  currency,
  onBalanceSelect,
}: {
  currency: Currency;
  userAddress: string;
  onBalanceSelect: (balance: Amount<Currency>) => void;
}) {
  const { balance, loading, error } = useCurrencyBalance(userAddress, currency);

  if (!userAddress) {
    return <SelectBalanceButton type="button" disabled alignRight />;
  }

  console.log({ loading, balance });

  if (loading && !balance) {
    return (
      <SelectBalanceButton type="button" disabled alignRight>
        Loading ...
      </SelectBalanceButton>
    );
  }

  if (error || !balance) {
    return null;
  }

  return (
    <SelectBalanceButton
      type="button"
      alignRight
      onClick={() => onBalanceSelect(balance)}
    >
      Balance:{' '}
      {numberFormatter.format(
        parseFloat(formatUnits(balance.toRawAmount(), currency.decimals))
      )}
    </SelectBalanceButton>
  );
}
