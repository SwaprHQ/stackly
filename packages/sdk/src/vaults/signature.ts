import type { JsonRpcSigner } from '@ethersproject/providers';
import {
  recoverTypedSignature,
  SignTypedDataVersion,
} from '@metamask/eth-sig-util';
import { DollarCostAveragingOrder } from '../interfaces';

export function toTypedDataV3(order: DollarCostAveragingOrder) {
  return {
    domain: {
      name: 'Dollar Cost Averaging',
      version: '3',
      chainId: order.chainId,
      verifyingContract: order.vault,
    },
    types: {
      Order: [
        { name: 'vault', type: 'address' },
        { name: 'recipient', type: 'address' },
        { name: 'sellToken', type: 'address' },
        { name: 'buyToken', type: 'address' },
        { name: 'sellAmount', type: 'uint256' },
        { name: 'startAt', type: 'uint256' },
        { name: 'endAt', type: 'uint256' },
        { name: 'frequency', type: 'uint256' },
        { name: 'frequencyInterval', type: 'string' },
      ],
    },
    primaryType: 'Order',
    value: {
      vault: order.vault,
      recipient: order.recipient,
      sellToken: order.sellToken,
      buyToken: order.buyToken,
      sellAmount: order.sellAmount,
      startAt: order.startAt,
      endAt: order.endAt,
      frequency: order.frequency,
      frequencyInterval: order.frequencyInterval,
    },
  };
}

/**
 * Get the signature for a DCA order
 * @param order
 * @param signTypedDataAsync A function that signs a typed data object. This is provided by the wallet provider
 * @returns
 */
export function signOrder(
  order: DollarCostAveragingOrder,
  signer: JsonRpcSigner
) {
  const orderTypedData = toTypedDataV3(order);
  return signer._signTypedData(
    orderTypedData.domain,
    orderTypedData.types,
    orderTypedData.value
  );
}

/**
 * Get the signature for a DCA order
 * @param order The signed order
 * @param signTypedDataAsync A function that signs a typed data object. This is provided by the wallet provider
 * @returns
 */
export async function getOrderSigner(
  order: DollarCostAveragingOrder,
  signature: string
) {
  const orderTypedData = toTypedDataV3(order);
  return recoverTypedSignature({
    data: {
      domain: orderTypedData.domain,
      types: {
        Order: orderTypedData.types.Order,
        EIP712Domain: [
          { name: 'name', type: 'string' },
          { name: 'version', type: 'string' },
          { name: 'chainId', type: 'uint256' },
          { name: 'verifyingContract', type: 'address' },
        ],
      },
      message: orderTypedData.value,
      primaryType: 'Order',
    },
    signature,
    version: SignTypedDataVersion.V3,
  });
}
