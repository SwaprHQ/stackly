import { Wallet } from 'ethers';
import { signOrder, getOrderSigner } from './signature';

describe('Signature Functions', () => {
  test('works correctly ', async () => {
    const signer = Wallet.createRandom();
    const expectedSignerAddress = signer.address;
    const order = {
      buyToken: '0x6b175474e89094c44da98b954eedeac495271d0f',
      sellToken: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
      sellAmount: '1000000000000000000',
      startAt: new Date('2024-01-01T00:00:00.000Z').getTime(),
      endAt: new Date('2024-01-03T00:00:00.000Z').getTime(),
      frequencyInterval: 'hour' as any,
      frequency: 1,
      chainId: 1,
      vault: '0x6b175474e89094c44da98b954eedeac495271d0f',
    };
    const signature = await signOrder(order, signer as any);
    const actualSignerAddress = await getOrderSigner(order, signature);
    expect(actualSignerAddress.toLowerCase()).toEqual(
      expectedSignerAddress.toLowerCase()
    );
  });
});
