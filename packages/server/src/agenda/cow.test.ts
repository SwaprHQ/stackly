import { getCOWQuote, postCOWOrder } from './cow';
import dayjs from 'dayjs';

describe('COW API', () => {
  test('should return a quote', async () => {
    const validTo = dayjs().add(1, 'hour').unix();

    const testAccount = '0xf17bbF8cE0e4b3FD216a659bb15199f877AaD6FD';

    const quote = await getCOWQuote(100, {
      appData:
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      sellAmountBeforeFee: '10000000',
      buyToken: '0x6a023ccd1ff6f2045c3309768ead9e68f978f6e1', // WETH
      from: testAccount,
      kind: 'sell' as any,
      partiallyFillable: false,
      receiver: testAccount,
      sellToken: '0xddafbb505ad214d7b80b1f830fccc89b60fb7a83', // USDC
      validTo,
    });

    console.log(quote);

    try {
      const orderId = await postCOWOrder(100, {
        ...quote.quote,
        from: quote.from,
        quoteId: quote.id,
        signingScheme: 'presign',
        signature: '0x',
      });

      console.log(orderId);
    } catch (error) {
      console.log(error.response);
    }
  });
});
