import { NATIVE_TOKEN_ADDRESS } from '../constants';
import { BaseCurrency } from './BaseCurrency';

/**
 * Represents the native currency of the chain on which it resides, e.g.
 */
export abstract class NativeCurrency extends BaseCurrency {
  public readonly address = NATIVE_TOKEN_ADDRESS;
  public readonly isNative: true = true as const;
  public readonly isToken: false = false as const;
}
