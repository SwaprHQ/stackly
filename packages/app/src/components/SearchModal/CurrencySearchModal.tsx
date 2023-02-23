import { Currency, Token } from 'dca-sdk';
import { memo, useCallback, useEffect, useState } from 'react';
import { useUserAddedTokens } from '../../state/user/hooks';
import {
  ModalBackdrop,
  ModalContent,
  ModalHeader,
  ModalInnerWrapper,
  ModalOutterWrapper,
} from '../Modal/styles';
import { TokenSafety } from '../TokenSafety';
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
  disableNonToken?: boolean;
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
  disableNonToken = false,
  showNativeCurrency = true,
}: CurrencySearchModalProps) {
  const [modalView, setModalView] = useState<CurrencyModalView>(
    CurrencyModalView.search
  );
  const lastOpen = isOpen;
  const userAddedTokens = useUserAddedTokens();

  useEffect(() => {
    if (isOpen && !lastOpen) {
      setModalView(CurrencyModalView.search);
    }
  }, [isOpen, lastOpen]);

  const showTokenSafetySpeedbump = (token: Token) => {
    setWarningToken(token);
    setModalView(CurrencyModalView.tokenSafety);
  };

  const handleCurrencySelect = useCallback(
    (currency: Currency, hasWarning?: boolean) => {
      if (
        hasWarning &&
        currency.isToken &&
        !userAddedTokens.find((token) => token.equals(currency))
      ) {
        showTokenSafetySpeedbump(currency);
      } else {
        onCurrencySelect(currency);
        onDismiss();
      }
    },
    [onDismiss, onCurrencySelect, userAddedTokens]
  );
  // used for token safety
  const [warningToken, setWarningToken] = useState<Token | undefined>();

  let content = null;
  switch (modalView) {
    case CurrencyModalView.search:
      content = (
        <>
          <ModalHeader>
            <h2>Select A Token</h2>
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
              disableNonToken={disableNonToken}
              showNativeCurrency={showNativeCurrency}
            />
          </ModalContent>
        </>
      );
      break;
    case CurrencyModalView.tokenSafety:
      if (warningToken) {
        content = (
          <TokenSafety
            tokenAddress={warningToken.address}
            onContinue={() => handleCurrencySelect(warningToken)}
            onCancel={() => setModalView(CurrencyModalView.search)}
            showCancel={true}
          />
        );
      }
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
