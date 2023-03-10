import { Amount, Currency, USDC } from 'dca-sdk';
import { useCallback, useEffect, useState } from 'react';
import { SelectBalanceButtonContainer } from '../SelectBalanceButtonContainer';
import { CurrencySearchModal } from '../SearchModal/CurrencySearchModal';
import { useNetwork } from 'wagmi';

import { CurrencyAmountInputInnerWrapper, TokenButton } from './styled';
import { InputGroup as _InputGroup, NumberInput } from '../form';
import styled from 'styled-components';

interface CurrencyAmountInputProps {
  value?: Amount<Currency>;
  onChange: (tokenAmount: Amount<Currency>) => void;
  /**
   * User's address. If provided, the user's balance will be shown.
   */
  userAddress?: string;
  /**
   * Chain ID. If provided, the user's balance will be shown.
   */
  chainId?: number;
  showNativeCurrency?: boolean;
  disabled?: boolean;
}

export function CurrencyAmountInput({
  value,
  onChange,
  userAddress,
  showNativeCurrency,
  disabled,
}: CurrencyAmountInputProps) {
  const { chain } = useNetwork();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const handleDismissSearch = useCallback(() => {
    setIsSearchModalOpen(false);
  }, [setIsSearchModalOpen]);
  // Start with USDC
  const [currencyAmount, setCurrencyAmount] = useState<Amount<Currency>>(
    value || new Amount(USDC[1], '0') // Start with USDC if no value is provided
  );
  const [inputAmount, setInputAmount] = useState<string>('');

  // Close the search modal if the chain changes
  useEffect(() => {
    setIsSearchModalOpen(false);
    return;
  }, [chain]);

  return (
    <CurrencyAmountInputInnerWrapper>
      <InputGroup>
        <TokenButton disabled={disabled} type="button" onClick={() => setIsSearchModalOpen(true)}>
          {currencyAmount.currency.symbol}
        </TokenButton>
        <NumberInput
          disabled={disabled}
          value={inputAmount}
          onChange={(nextSellAmount) => {
            let nextCurrencyAmount = new Amount(currencyAmount.currency, nextSellAmount || 0);
            setInputAmount(nextSellAmount);
            onChange(nextCurrencyAmount);
          }}
        />
        <CurrencySearchModal
          isOpen={isSearchModalOpen}
          onDismiss={handleDismissSearch}
          onCurrencySelect={(nextCurrency) => {
            const nextCurrencyAmount = new Amount(nextCurrency, inputAmount);
            setInputAmount(nextCurrencyAmount.toString());
            setCurrencyAmount(nextCurrencyAmount);
            onChange(nextCurrencyAmount);
            handleDismissSearch();
          }}
          selectedCurrency={currencyAmount.currency}
          showCommonBases={true}
          showCurrencyAmount={true}
          showNativeCurrency={showNativeCurrency}
        />
      </InputGroup>
      {userAddress && !disabled ? (
        <SelectBalanceButtonContainer
          currency={currencyAmount.currency}
          userAddress={userAddress}
          onBalanceSelect={(userBalance) => {
            if (disabled) return;
            const nextCurrencyAmount = userBalance;
            setInputAmount(nextCurrencyAmount.toString());
            setCurrencyAmount(nextCurrencyAmount);
            onChange(nextCurrencyAmount);
          }}
        />
      ) : null}
    </CurrencyAmountInputInnerWrapper>
  );
}

const InputGroup = styled(_InputGroup)`
  margin-bottom: 8px;
`;
