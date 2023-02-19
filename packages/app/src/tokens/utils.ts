import { ChainId, Ether, NativeCurrency, Token, xDAI } from "dca-sdk"

const cachedNativeCurrency: { [chainId: number]: NativeCurrency | Token } = {}


export function nativeOnChain(chainId: number): NativeCurrency | Token {
  if (cachedNativeCurrency[chainId]) return cachedNativeCurrency[chainId]
  let nativeCurrency: NativeCurrency | Token
  if (chainId === ChainId.GNOSIS) {
    nativeCurrency = new xDAI();
  } else {
    nativeCurrency = Ether.onChain(chainId)
  }
  return (cachedNativeCurrency[chainId] = nativeCurrency)
}
