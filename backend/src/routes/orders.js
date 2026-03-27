import { Router } from 'express';
import { confirmOrder, createOrder, getOrder, payOrder } from '../services/orderService.js';
import { addPrintLog, listPrintLogs } from '../services/printLogService.js';
import { buildKitchenTicketTemplate, buildReceiptTemplate } from '../services/printTemplates.js';

const router = Router();

router.post('/orders', (req, res) => {
  try {
    const order = createOrder(req.body);
    res.status(201).json({ order });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/orders/:orderId', (req, res) => {
  const order = getOrder(req.params.orderId);
  if (!order) {
    return res.status(404).json({ message: 'Order not found' });
  }
  res.json({ order });
});

router.post('/orders/:orderId/confirm', (req, res) => {
  try {
    const order = confirmOrder(req.params.orderId);
    const ticketPreview = buildKitchenTicketTemplate(order);
    const printLog = addPrintLog({
      orderId: order.id,
      type: 'KITCHEN_TICKET',
      printerIp: req.body.printerIp || '192.168.1.50',
      status: 'SUCCESS'
    });

    res.json({ order, printLog, ticketPreview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post('/orders/:orderId/pay', (req, res) => {
  try {
    const order = payOrder(req.params.orderId, req.body.method);
    const receiptPreview = buildReceiptTemplate(order);
    const printLog = addPrintLog({
      orderId: order.id,
      type: 'RECEIPT',
      printerIp: req.body.printerIp || '192.168.1.51',
      status: 'SUCCESS'
    });

    res.json({ order, printLog, receiptPreview });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get('/print-logs', (req, res) => {
  res.json({ printLogs: listPrintLogs() });
});

export default router;
