import { useAccount, useProvider, useSignMessage } from 'wagmi';

import { cancelOrder } from '../../api';
import { WalletConnectButton } from '../ConnectButton';
import { getVaultContract } from 'dca-sdk';

import { DollarCostAveragingOrder } from 'dca-sdk';

interface DollarCostAveragingOrderDoc extends DollarCostAveragingOrder {
  id: string;
}

export function OrderCard({ order }: { order: DollarCostAveragingOrderDoc }) {
  const account = useAccount();
  const provider = useProvider();

  const { signMessageAsync } = useSignMessage();

  const onCancelOrderHandler = async () => {
    try {
      const signature = await signMessageAsync({
        message: order.id,
      });

      await cancelOrder(order.id, signature);

      // Withdraw tokens from vault contract
      const vaultContract = getVaultContract(order.vault, provider);
      await vaultContract.cancel();
    } catch (error) {
      console.error(error);
    }
  };

  if (account.address === undefined) {
    return <WalletConnectButton />;
  }

  return (
    <div>
      <h1>Order</h1>
      <p>Order ID: {order.id}</p>
      <p>Sell Token: {order.sellToken}</p>
      <p>Buy Token: {order.buyToken}</p>
      <p>Sell Amount: {order.sellAmount}</p>
      <button onClick={onCancelOrderHandler}>
        Cancel Order and withdraw token
      </button>
    </div>
  );
}
