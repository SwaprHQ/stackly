

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
