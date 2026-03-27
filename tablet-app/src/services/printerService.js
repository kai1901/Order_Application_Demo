export async function printKitchenTicket({ tableId, items, orderId }) {
  console.log('Printing kitchen ticket', { tableId, items, orderId });
  return { ok: true, printerIp: '192.168.1.50' };
}

export async function printReceipt({ orderId, total }) {
  console.log('Printing customer receipt', { orderId, total });
  return { ok: true, printerIp: '192.168.1.51' };
}
