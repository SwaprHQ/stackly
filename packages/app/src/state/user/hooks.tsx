import { Token } from 'dca-sdk';
import { useCallback, useMemo } from 'react';
import { shallowEqual } from 'react-redux';
import { useNetwork } from 'wagmi';
import { UserAddedToken } from '../../token-list/types';
import { useAppDispatch, useAppSelector } from '../hooks';
import { AppState } from '../index';
import {
  addSerializedToken,
  updateFiatOnrampAcknowledgments,
  updateUserClientSideRouter,
  updateUserDarkMode,
  updateUserDeadline,
  updateUserExpertMode,
} from './reducer';
import { SerializedToken } from './types';

function serializeToken(token: Token): SerializedToken {
  return {
    chainId: token.chainId,
    address: token.address,
    decimals: token.decimals,
    symbol: token.symbol,
    name: token.name,
  };
}

function deserializeToken(
  serializedToken: SerializedToken,
  Class: typeof Token = Token
): Token {
  return new Class(
    serializedToken.chainId,
    serializedToken.address,
    serializedToken.decimals,
    serializedToken.symbol,
    serializedToken.name
  );
}

export function useIsDarkMode(): boolean {
  const { userDarkMode, matchesDarkMode } = useAppSelector(
    ({ user: { matchesDarkMode, userDarkMode } }) => ({
      userDarkMode,
      matchesDarkMode,
    }),
    shallowEqual
  );

  return userDarkMode === null ? matchesDarkMode : userDarkMode;
}

export function useDarkModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const darkMode = useIsDarkMode();

  const toggleSetDarkMode = useCallback(() => {
    dispatch(updateUserDarkMode({ userDarkMode: !darkMode }));
  }, [darkMode, dispatch]);

  return [darkMode, toggleSetDarkMode];
}

export function useIsExpertMode(): boolean {
  return useAppSelector((state) => state.user.userExpertMode);
}

export function useExpertModeManager(): [boolean, () => void] {
  const dispatch = useAppDispatch();
  const expertMode = useIsExpertMode();

  const toggleSetExpertMode = useCallback(() => {
    dispatch(updateUserExpertMode({ userExpertMode: !expertMode }));
  }, [expertMode, dispatch]);

  return [expertMode, toggleSetExpertMode];
}

interface FiatOnrampAcknowledgements {
  renderCount: number;
  system: boolean;
  user: boolean;
}
export function useFiatOnrampAck(): [
  FiatOnrampAcknowledgements,
  (acknowledgements: Partial<FiatOnrampAcknowledgements>) => void
] {
  const dispatch = useAppDispatch();
  const fiatOnrampAcknowledgments = useAppSelector(
    (state) => state.user.fiatOnrampAcknowledgments
  );
  const setAcknowledgements = useCallback(
    (acks: Partial<FiatOnrampAcknowledgements>) => {
      dispatch(updateFiatOnrampAcknowledgments(acks));
    },
    [dispatch]
  );
  return [fiatOnrampAcknowledgments, setAcknowledgements];
}

export function useClientSideRouter(): [
  boolean,
  (userClientSideRouter: boolean) => void
] {
  const dispatch = useAppDispatch();

  const clientSideRouter = useAppSelector((state) =>
    Boolean(state.user.userClientSideRouter)
  );

  const setClientSideRouter = useCallback(
    (newClientSideRouter: boolean) => {
      dispatch(
        updateUserClientSideRouter({
          userClientSideRouter: newClientSideRouter,
        })
      );
    },
    [dispatch]
  );

  return [clientSideRouter, setClientSideRouter];
}

export function useUserTransactionTTL(): [number, (slippage: number) => void] {
  const dispatch = useAppDispatch();
  const deadline = useAppSelector((state) => state.user.userDeadline);

  const setUserDeadline = useCallback(
    (userDeadline: number) => {
      dispatch(updateUserDeadline({ userDeadline }));
    },
    [dispatch]
  );

  return [deadline, setUserDeadline];
}

export function useAddUserToken(): (token: Token) => void {
  const dispatch = useAppDispatch();
  return useCallback(
    (token: Token) => {
      dispatch(addSerializedToken({ serializedToken: serializeToken(token) }));
    },
    [dispatch]
  );
}

export function useUserAddedTokensOnChain(
  chainId: number | undefined | null
): Token[] {
  const serializedTokensMap = useAppSelector(({ user: { tokens } }) => tokens);

  return useMemo(() => {
    if (!chainId) return [];
    const tokenMap: Token[] = serializedTokensMap?.[chainId]
      ? Object.values(serializedTokensMap[chainId]).map((value) =>
          deserializeToken(value, UserAddedToken)
        )
      : [];
    return tokenMap;
  }, [serializedTokensMap, chainId]);
}

export function useUserAddedTokens(): Token[] {
  return useUserAddedTokensOnChain(useNetwork().chain?.id);
}

export function useURLWarningVisible(): boolean {
  return useAppSelector((state: AppState) => state.user.URLWarningVisible);
}
