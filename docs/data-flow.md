# Data Flow MVP

## Buoc nghiep vu

1. Chon ban
- Tablet hien thi danh sach T1-T5
- Nhan vien chon 1 ban truoc khi dat mon

2. Tao order
- Nhan vien chon mon
- Tablet goi `POST /api/orders` voi `tableId + items`
- Backend tao order status `DRAFT`, table status `ORDERING`

3. Xac nhan order + in bep
- Tablet goi `POST /api/orders/:id/confirm`
- Backend chuyen status `CONFIRMED`
- Tablet/Backend luu print log loai `KITCHEN_TICKET`

4. Thanh toan + in hoa don
- Tablet goi `POST /api/orders/:id/pay`
- Backend chuyen status `PAID`, dat `paidAt`
- Table status quay ve `AVAILABLE`
- Tablet/Backend luu print log loai `RECEIPT`

## Printer Mapping

- Kitchen printer: `192.168.1.50`
- Receipt printer: `192.168.1.51`

IP se doi theo mang LAN thuc te cua nha hang.
