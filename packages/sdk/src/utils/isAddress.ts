import { getAddress } from '@ethersproject/address';

/**
 * returns the checksummed address if the address is valid, otherwise returns false
 * @param value the potential address to check
 * @returns false if the value is not a valid address, otherwise returns the checksummed address
 */
// eslint-disable-next-line
export function isAddress(value: any): string | false {
  try {
    // Alphabetical letters must be made lowercase for getAddress to work.
    // See documentation here: https://docs.ethers.io/v5/api/utils/address/
    return getAddress(value.toLowerCase());
  } catch {
    return false;
  }
}
