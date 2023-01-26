import { DollarCostAveragingOrderWithSignature } from "dca-sdk";


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

const API_BASE = 'http://localhost:4000'; //@todo: use env variable

/**
 * Post an order to the API
 * @param signedOrder
 * @returns
 */
export function postOrder(signedOrder: DollarCostAveragingOrderWithSignature){
  return fetch( `${API_BASE}/orders`, {
    method: 'DELETE',
    body: JSON.stringify(signedOrder),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then((res) => res.json());
}
