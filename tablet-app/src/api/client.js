const API_BASE_URL = 'http://192.168.2.163:4000/api';

export async function createOrder(payload) {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error('Failed to create order');
  }

  return response.json();
}

export async function confirmOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/confirm`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ printerIp: '192.168.1.50' })
  });

  if (!response.ok) {
    throw new Error('Failed to confirm order');
  }

  return response.json();
}

export async function payOrder(orderId) {
  const response = await fetch(`${API_BASE_URL}/orders/${orderId}/pay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ method: 'CASH', printerIp: '192.168.1.51' })
  });

  if (!response.ok) {
    throw new Error('Failed to pay order');
  }

  return response.json();
}
