import { ChainId } from '../constants';
import { DCAFrequencyInterval } from '../vaults';

/**
 * The base interface for a DCA order.
 * This is the interface is used in:
 * - The server to store the order in the database.
 * - The dapp to create the order.
 */
export interface DollarCostAveragingOrder {
  /**
   * Vault address: where the order will be placed.
   */
  vault: string;
  /**
   * Sell token: what token will be sold.
   */
  sellToken: string;
  /**
   * Buy token: what token will be bought.
   */
  buyToken: string;
  /**
   * Sell amount: how much of the sell token will be sold.
   */
  sellAmount: string;
  /**
   * Chain ID: where the order will be placed.
   */
  chainId: ChainId;
  /**
   * Start date: when the first order will be placed.
   */
  startAt: Date;
  /**
   * End date: when the last order will be placed.
   */
  endAt: Date;
  /**
   * Frequency unit: how often the order will be placed.
   */
  frequency: number;
  /**
   * Frequency interval: how often the order will be placed.
   */
  frequencyInterval: DCAFrequencyInterval;
}


export interface DollarCostAveragingOrderDocument extends DollarCostAveragingOrder {
  /**
   * Order ID: unique identifier for the order.
   */
  id: string;
  /**
   * Created date: when the order was created.
   */
  createdAt: Date;
  /**
   * Last updated date: when the order was last updated.
   */
  updatedAt: Date;
}
