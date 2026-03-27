# Sakura Order Application - MVP Skeleton

MVP pham vi:
- 1 chi nhanh
- 1 tablet (Galaxy Tab S9)
- 1 may in bep
- 1 may in hoa don
- 5 ban (T1 - T5)

## Cau truc thu muc

- `backend/`: Node.js + Express API (se host AWS)
- `tablet-app/`: Expo React Native app cho tablet
- `docs/`: Tai lieu luong data va kien truc MVP

## 1) Chay backend local

```bash
cd backend
npm install
npm run dev
```

Backend mac dinh chay: `http://localhost:4000`

API chinh:
- `GET /health`
- `GET /api/tables`
- `GET /api/menu`
- `POST /api/orders`
- `POST /api/orders/:orderId/confirm`
- `POST /api/orders/:orderId/pay`
- `GET /api/print-logs`

## 2) Chay tablet app local

```bash
cd tablet-app
npm install
npm start
```

Luu y:
- Chinh IP backend trong `tablet-app/src/api/client.js` (bien `API_BASE_URL`)
- Tablet va may in can cung mang LAN

## 3) Dinh huong deploy AWS (sau MVP)

- Backend: AWS App Runner/EC2 + RDS PostgreSQL
- Secret: AWS Systems Manager Parameter Store
- Monitoring: CloudWatch Logs

## 4) TODO sau skeleton

- Thay in-memory store bang PostgreSQL
- Them auth nhan vien
- Tich hop ESC/POS thuc te cho Epson TM-T20II
- Retry queue cho in loi
- Reprint kitchen ticket / receipt
