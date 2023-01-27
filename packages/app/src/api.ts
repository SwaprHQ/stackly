import { DollarCostAveragingOrderWithSignature } from 'dca-sdk';

export const API_SERVIEC_BASE_URL = process.env.REACT_APP_API_SERVIEC_BASE_URL || 'http://localhost:4000';

export function cancelOrder(orderId: string, signature: string): Promise<void> {
  const body = {
    signature,
  };

  return fetch(`/api/orders/${orderId}`, {
    method: 'DELETE',
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}

/**
 * Post an order to the API
 * @param signedOrder
 * @returns
 */
export function postOrder(signedOrder: DollarCostAveragingOrderWithSignature) {
  return fetch(`${API_SERVIEC_BASE_URL}/orders`, {
    method: 'POST',
    body: JSON.stringify(signedOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
