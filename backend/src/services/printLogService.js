import { v4 as uuid } from 'uuid';
import { store } from '../store.js';

export function addPrintLog({ orderId, type, printerIp, status, errorMessage = '' }) {
  const log = {
    id: uuid(),
    orderId,
    type,
    printerIp,
    status,
    errorMessage,
    printedAt: new Date().toISOString()
  };

  store.printLogs.push(log);
  return log;
}

export function listPrintLogs() {
  return store.printLogs;
}
