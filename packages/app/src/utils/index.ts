/**
 * Shorten the checksummed version of the input address to have 0x + 4 characters at start and end
 * @param address The input address
 * @param charsBefore The number of characters to show before the trimmed part
 * @param charsAfter The number of characters to show after the trimmed part
 * @returns The shortened address
 * @throws If the address is not checksummed
 */
export function shortenAddress(
    address?: string,
    charsBefore = 4,
    charsAfter = 4
): string {
    if (!address) return "";
    return `${address.substring(0, charsBefore + 2)}...${address.substring(
        42 - charsAfter
    )}`;
}

export const numberFormatter = new Intl.NumberFormat('en-US', {
  maximumFractionDigits: 3,
});
