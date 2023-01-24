import { Token } from '../token';
import { Currency } from '../currency';
import { BigNumberish } from '@ethersproject/bignumber';
import Decimal, { Numeric } from 'decimal.js-light';
import { formatUnits, parseUnits } from '@ethersproject/units';

export type TokenOrCurrency = Token | Currency;

export class Amount<T extends TokenOrCurrency> extends Decimal {
  public readonly currency: T;

  public constructor(currency: T, amount: Numeric) {
    super(amount);
    this.currency = currency;
  }

  public static fromRawAmount<T extends TokenOrCurrency>(
    currency: T,
    amount: BigNumberish
  ) {
    return new Amount(currency, formatUnits(amount, currency.decimals));
  }

  public toRawAmount() {
    return parseUnits(
      this.toFixed(this.currency.decimals),
      this.currency.decimals
    );
  }
}
