import { Router } from 'express';
import { listMenuItems, listTables } from '../services/orderService.js';

const router = Router();

router.get('/tables', (req, res) => {
  res.json({ tables: listTables() });
});

router.get('/menu', (req, res) => {
  res.json({ menuItems: listMenuItems() });
});

export default router;
