import { Currency } from 'dca-sdk';
import { useCallback, useEffect, useState } from 'react';
import { useNetwork } from 'wagmi';
import { CurrencySearchModal } from '../SearchModal/CurrencySearchModal';
import { TokenButton } from './styled';

interface CurrencyInputProps {
  value?: Currency;
  onChange: (currency: Currency) => void;
  showNativeCurrency?: boolean;
  disabled?: boolean;
}

export function CurrencyInput({ value, onChange, showNativeCurrency, disabled }: CurrencyInputProps) {
  const { chain } = useNetwork();
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const handleDismissSearch = useCallback(() => {
    setIsSearchModalOpen(false);
  }, [setIsSearchModalOpen]);

  // If the chain is unsupported, close the search modal
  useEffect(() => {
    setIsSearchModalOpen(false);
  }, [chain]);

  return (
    <>
      <TokenButton disabled={disabled} type="button" onClick={() => setIsSearchModalOpen(true)}>
        {value?.symbol}
      </TokenButton>
      <CurrencySearchModal
        isOpen={isSearchModalOpen}
        onDismiss={handleDismissSearch}
        onCurrencySelect={(nextCurrency) => {
          onChange(nextCurrency);
          handleDismissSearch();
        }}
        selectedCurrency={value}
        showCommonBases={true}
        showCurrencyAmount={true}
        showNativeCurrency={showNativeCurrency}
      />
    </>
  );
}
