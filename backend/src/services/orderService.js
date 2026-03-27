import { v4 as uuid } from 'uuid';
import { store } from '../store.js';

function findTableById(tableId) {
  return store.tables.find((table) => table.id === tableId);
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) => sum + item.qty * item.unitPrice, 0);
}

export function listTables() {
  return store.tables;
}

export function listMenuItems() {
  return store.menuItems.filter((item) => item.isActive);
}

export function createOrder({ tableId, items = [] }) {
  const table = findTableById(tableId);

  if (!table) {
    throw new Error('Table not found');
  }

  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Order requires at least one item');
  }

  const normalizedItems = items.map((item) => {
    const menuItem = store.menuItems.find((m) => m.id === item.menuItemId);
    if (!menuItem) {
      throw new Error(`Menu item not found: ${item.menuItemId}`);
    }

    return {
      id: uuid(),
      menuItemId: menuItem.id,
      name: menuItem.name,
      qty: Number(item.qty || 1),
      unitPrice: menuItem.price,
      note: item.note || ''
    };
  });

  const subtotal = calculateSubtotal(normalizedItems);
  const tax = Math.round(subtotal * 0.1);
  const total = subtotal + tax;

  const now = new Date().toISOString();
  const order = {
    id: uuid(),
    tableId,
    status: 'DRAFT',
    items: normalizedItems,
    subtotal,
    tax,
    total,
    createdAt: now,
    updatedAt: now,
    paidAt: null
  };

  table.status = 'ORDERING';
  store.orders.push(order);

  return order;
}

export function getOrder(orderId) {
  return store.orders.find((order) => order.id === orderId);
}

export function confirmOrder(orderId) {
  const order = getOrder(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = 'CONFIRMED';
  order.updatedAt = new Date().toISOString();

  return order;
}

export function payOrder(orderId, method = 'CASH') {
  const order = getOrder(orderId);

  if (!order) {
    throw new Error('Order not found');
  }

  order.status = 'PAID';
  order.paymentMethod = method;
  order.paidAt = new Date().toISOString();
  order.updatedAt = order.paidAt;

  const table = findTableById(order.tableId);
  if (table) {
    table.status = 'AVAILABLE';
  }

  return order;
}
