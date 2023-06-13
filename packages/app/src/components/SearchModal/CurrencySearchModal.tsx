import { Currency } from 'dca-sdk';
import { memo, useCallback, useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  ModalBackdrop,
  ModalContent as ModalContentBase,
  ModalHeader,
  ModalInnerWrapper,
  ModalOutterWrapper,
  ModalTitle,
} from '../Modal/styles';
import { CurrencySearch } from './CurrencySearch';

export interface TokenSafetyProps {
  tokenAddress: string | null;
  secondTokenAddress?: string;
  onContinue: () => void;
  onCancel: () => void;
  onBlocked?: () => void;
  showCancel?: boolean;
}

interface CurrencySearchModalProps {
  isOpen: boolean;
  onDismiss: () => void;
  selectedCurrency?: Currency | null;
  onCurrencySelect: (currency: Currency) => void;
  otherSelectedCurrency?: Currency | null;
  showCommonBases?: boolean;
  showCurrencyAmount?: boolean;
  showNativeCurrency?: boolean;
}

export enum CurrencyModalView {
  search,
  importToken,
  tokenSafety,
}

export const CurrencySearchModal = memo(function CurrencySearchModal({
  isOpen,
  onDismiss,
  onCurrencySelect,
  selectedCurrency,
  otherSelectedCurrency,
  showCommonBases = false,
  showCurrencyAmount = true,
  showNativeCurrency = true,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(CurrencyModalView.search);
  const lastOpen = isOpen;

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search);
    }
  }, [isOpen, lastOpen]);

  const handleCurrencySelect = useCallback(
    (currency: Currency) => {
      onCurrencySelect(currency);
      onDismiss();
    },
    [onDismiss, onCurrencySelect]
  );

  let content = null;
  switch (modalView) {
    case CurrencyModalView.search:
      content = (
        <>
          <ModalHeader>
            <ModalTitle>Select a token</ModalTitle>
          </ModalHeader>
          <ModalContent minHeight="400px">
            <CurrencySearch
              isOpen={isOpen}
              onDismiss={onDismiss}
              onCurrencySelect={handleCurrencySelect}
              selectedCurrency={selectedCurrency}
              otherSelectedCurrency={otherSelectedCurrency}
              showCommonBases={showCommonBases}
              showCurrencyAmount={showCurrencyAmount}
              showNativeCurrency={showNativeCurrency}
            />
          </ModalContent>
        </>
      );
      break;
  }

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop onClick={onDismiss}>
      <ModalOutterWrapper onClick={(e) => e.stopPropagation()}>
        <ModalInnerWrapper>{content}</ModalInnerWrapper>
      </ModalOutterWrapper>
    </ModalBackdrop>
  );
});

const ModalContent = styled(ModalContentBase)`
  padding-top: 0;
`;
