import { AddressZero } from '@ethersproject/constants';
import { ChainId } from '../constants';

export const VAULT_FACTORY_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x49ba0d56f7323B102bCb7a1A1b24D17FE4fF6F25',
};

export const VAULT_SINGLETON_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0x6cE732Ee686C69Df898567034A45c0081649578d',
};

export const VAULT_DRIVER_ADDRESS_LIST: Record<ChainId, string> = {
  [ChainId.ETHEREUM]: AddressZero,
  [ChainId.GNOSIS]: '0xf17bbF8cE0e4b3FD216a659bb15199f877AaD6FD',
};

/**
 * DCA Frequency interval. How often the order will be placed.
 */
export enum DCAFrequencyInterval {
  HOUR = 'hour',
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
}
