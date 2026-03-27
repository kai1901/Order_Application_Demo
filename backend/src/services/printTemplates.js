const PAPER_WIDTH = 48; // 80mm printer width in text mode

function line(char = '-') {
  return char.repeat(PAPER_WIDTH);
}

function center(text = '') {
  const clean = String(text).slice(0, PAPER_WIDTH);
  const leftPad = Math.max(0, Math.floor((PAPER_WIDTH - clean.length) / 2));
  return `${' '.repeat(leftPad)}${clean}`;
}

function right(text = '') {
  const clean = String(text);
  return clean.length >= PAPER_WIDTH
    ? clean.slice(0, PAPER_WIDTH)
    : `${' '.repeat(PAPER_WIDTH - clean.length)}${clean}`;
}

function row(left = '', rightText = '') {
  const rightClean = String(rightText);
  const leftWidth = Math.max(0, PAPER_WIDTH - rightClean.length - 1);
  const leftClean = String(left).slice(0, leftWidth);
  return `${leftClean}${' '.repeat(PAPER_WIDTH - leftClean.length - rightClean.length)}${rightClean}`;
}

function money(value) {
  return `${Number(value || 0).toLocaleString('vi-VN')} VND`;
}

function shortId(id = '') {
  return String(id).slice(0, 8).toUpperCase();
}

function nowText() {
  return new Date().toLocaleString('vi-VN', { hour12: false });
}

export function buildKitchenTicketTemplate(order) {
  const lines = [];
  lines.push(center('SAKURA RESTAURANT'));
  lines.push(center('KITCHEN TICKET'));
  lines.push(line('='));
  lines.push(row(`Order: ${shortId(order.id)}`, `Table: ${order.tableId}`));
  lines.push(`Time: ${nowText()}`);
  lines.push(line('-'));

  order.items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.name}`);
    lines.push(row(`   Qty: ${item.qty}`, money(item.qty * item.unitPrice)));
    if (item.note) {
      lines.push(`   Note: ${item.note}`);
    }
    lines.push(line('.'));
  });

  lines.push(line('-'));
  lines.push(center('PLEASE PREPARE IN ORDER'));
  lines.push('\n\n\n');
  return lines.join('\n');
}

export function buildReceiptTemplate(order) {
  const lines = [];
  lines.push(center('SAKURA RESTAURANT'));
  lines.push(center('CUSTOMER RECEIPT'));
  lines.push(line('='));
  lines.push(row(`Bill: ${shortId(order.id)}`, `Table: ${order.tableId}`));
  lines.push(`Time: ${nowText()}`);
  lines.push(line('-'));

  order.items.forEach((item) => {
    const amount = item.qty * item.unitPrice;
    lines.push(item.name);
    lines.push(row(`  ${item.qty} x ${money(item.unitPrice)}`, money(amount)));
  });

  lines.push(line('-'));
  lines.push(row('Subtotal', money(order.subtotal)));
  lines.push(row('VAT (10%)', money(order.tax)));
  lines.push(row('TOTAL', money(order.total)));
  lines.push(line('='));
  lines.push(`Payment: ${order.paymentMethod || 'CASH'}`);
  lines.push(center('Thank you and see you again!'));
  lines.push('\n\n\n');
  return lines.join('\n');
}
