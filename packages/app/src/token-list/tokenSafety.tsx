import { NATIVE_TOKEN_ADDRESS } from 'dca-sdk';
import { constants } from 'ethers';
import {
  NATIVE_CHAIN_ID,
  tokenSafetyLookupTable,
  TOKEN_LIST_TYPES,
} from './tokenSafetyLookupTable';

export enum WARNING_LEVEL {
  MEDIUM,
  UNKNOWN,
  BLOCKED,
  TokenSafety,
}

function Plural(props: { value: number; _1: string; other: string }) {
  return <>{props.value === 1 ? props._1 : props.other}</>;
}

export function getWarningCopy(warning: Warning | null, plural = false) {
  let heading = null,
    description = null;
  if (warning) {
    switch (warning.level) {
      case WARNING_LEVEL.MEDIUM:
        heading = (
          <Plural
            value={plural ? 2 : 1}
            _1="This token isn't traded on leading U.S. centralized exchanges."
            other="These tokens aren't traded on leading U.S. centralized exchanges."
          />
        );
        description = <>Always conduct your own research before trading.</>;
        break;
      case WARNING_LEVEL.UNKNOWN:
        heading = (
          <Plural
            value={plural ? 2 : 1}
            _1="This token isn't traded on leading U.S. centralized exchanges or frequently swapped on Uniswap."
            other="These tokens aren't traded on leading U.S. centralized exchanges or frequently swapped on Uniswap."
          />
        );
        description = <>Always conduct your own research before trading.</>;
        break;
      case WARNING_LEVEL.BLOCKED:
        description = (
          <Plural
            value={plural ? 2 : 1}
            _1="You can't trade this token using the Uniswap App."
            other="You can't trade these tokens using the Uniswap App."
          />
        );
        break;
    }
  }
  return { heading, description };
}

export type Warning = {
  level: WARNING_LEVEL;
  message: JSX.Element;
  /* canProceed determines whether triangle/slash alert icon is used, and
    whether this token is supported/able to be traded */
  canProceed: boolean;
};

const MediumWarning: Warning = {
  level: WARNING_LEVEL.MEDIUM,
  message: <>Caution</>,
  canProceed: true,
};

const StrongWarning: Warning = {
  level: WARNING_LEVEL.UNKNOWN,
  message: <>Warning</>,
  canProceed: true,
};

const BlockedWarning: Warning = {
  level: WARNING_LEVEL.BLOCKED,
  message: <>Not Available</>,
  canProceed: false,
};

export function checkWarning(tokenAddress: string) {
  if (
    tokenAddress === NATIVE_TOKEN_ADDRESS ||
    tokenAddress === NATIVE_CHAIN_ID ||
    tokenAddress === constants.AddressZero
  ) {
    return null;
  }
  switch (tokenSafetyLookupTable.checkToken(tokenAddress.toLowerCase())) {
    case TOKEN_LIST_TYPES.UNI_DEFAULT:
      return null;
    case TOKEN_LIST_TYPES.UNI_EXTENDED:
      return MediumWarning;
    case TOKEN_LIST_TYPES.UNKNOWN:
      return StrongWarning;
    case TOKEN_LIST_TYPES.BLOCKED:
      return BlockedWarning;
    case TOKEN_LIST_TYPES.BROKEN:
      return BlockedWarning;
  }
}
