import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View
} from 'react-native';
import TableCard from './src/components/TableCard';
import { menuItems } from './src/data/menu';
import { confirmOrder, createOrder, payOrder } from './src/api/client';
import { printKitchenTicket, printReceipt } from './src/services/printerService';

const initialTables = [
  { id: 'T1', name: 'Ban 1', status: 'AVAILABLE' },
  { id: 'T2', name: 'Ban 2', status: 'AVAILABLE' },
  { id: 'T3', name: 'Ban 3', status: 'AVAILABLE' },
  { id: 'T4', name: 'Ban 4', status: 'AVAILABLE' },
  { id: 'T5', name: 'Ban 5', status: 'AVAILABLE' }
];

export default function App() {
  const [tables, setTables] = useState(initialTables);
  const [selectedTableId, setSelectedTableId] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const selectedTable = useMemo(
    () => tables.find((table) => table.id === selectedTableId),
    [tables, selectedTableId]
  );

  const subtotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.price, 0),
    [selectedItems]
  );

  const total = useMemo(() => Math.round(subtotal * 1.1), [subtotal]);

  function toggleItem(item) {
    const exists = selectedItems.some((selected) => selected.id === item.id);
    if (exists) {
      setSelectedItems((prev) => prev.filter((selected) => selected.id !== item.id));
      return;
    }
    setSelectedItems((prev) => [...prev, item]);
  }

  async function handleConfirmOrder() {
    if (!selectedTableId) {
      Alert.alert('Thong bao', 'Vui long chon ban truoc khi nhan order.');
      return;
    }

    if (selectedItems.length === 0) {
      Alert.alert('Thong bao', 'Vui long chon it nhat 1 mon.');
      return;
    }

    try {
      const payload = {
        tableId: selectedTableId,
        items: selectedItems.map((item) => ({ menuItemId: item.id, qty: 1 }))
      };

      const { order } = await createOrder(payload);
      await confirmOrder(order.id);
      await printKitchenTicket({ tableId: selectedTableId, items: selectedItems, orderId: order.id });
      setCurrentOrderId(order.id);
      setTables((prev) =>
        prev.map((table) =>
          table.id === selectedTableId ? { ...table, status: 'OCCUPIED' } : table
        )
      );
      Alert.alert('Thanh cong', `Da xac nhan order ${order.id} cho ${selectedTable?.name}.`);
    } catch (error) {
      Alert.alert('Loi', error.message);
    }
  }

  async function handlePayOrder() {
    if (!currentOrderId) {
      Alert.alert('Thong bao', 'Chua co order da xac nhan de thanh toan.');
      return;
    }

    try {
      await payOrder(currentOrderId);
      await printReceipt({ orderId: currentOrderId, total });
      Alert.alert('Thanh cong', `Da thanh toan order ${currentOrderId}.`);
      setTables((prev) =>
        prev.map((table) =>
          table.id === selectedTableId ? { ...table, status: 'AVAILABLE' } : table
        )
      );
      setCurrentOrderId(null);
      setSelectedItems([]);
      setSelectedTableId(null);
    } catch (error) {
      Alert.alert('Loi', error.message);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.heading}>Sakura Order - Tablet MVP</Text>
      <Text style={styles.subheading}>Buoc 1: Chon ban (1-5)</Text>

      <View style={styles.tableGrid}>
        {tables.map((table) => (
          <TableCard
            key={table.id}
            table={table}
            selected={selectedTableId === table.id}
            onPress={() => setSelectedTableId(table.id)}
          />
        ))}
      </View>

      <Text style={styles.subheading}>Buoc 2: Chon mon</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.menuRow}>
        {menuItems.map((item) => {
          const active = selectedItems.some((selected) => selected.id === item.id);
          return (
            <Pressable
              key={item.id}
              style={[styles.menuItem, active && styles.menuItemActive]}
              onPress={() => toggleItem(item)}
            >
              <Text style={styles.menuName}>{item.name}</Text>
              <Text style={styles.menuPrice}>{item.price.toLocaleString('vi-VN')} VND</Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View style={styles.summary}>
        <Text style={styles.summaryText}>Ban: {selectedTable?.name || '-'}</Text>
        <Text style={styles.summaryText}>Mon da chon: {selectedItems.length}</Text>
        <Text style={styles.summaryText}>Tong tam tinh (da VAT): {total.toLocaleString('vi-VN')} VND</Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [styles.confirmBtn, pressed && styles.buttonPressed]}
          onPress={handleConfirmOrder}
        >
          <Text style={styles.btnText}>Xac nhan Order + In bep</Text>
        </Pressable>
        <Pressable
          style={({ pressed }) => [styles.payBtn, pressed && styles.buttonPressed]}
          onPress={handlePayOrder}
        >
          <Text style={styles.btnText}>Xac nhan Thanh toan + In hoa don</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f2ec',
    padding: 18
  },
  heading: {
    fontSize: 30,
    fontWeight: '800',
    color: '#9f1d22'
  },
  subheading: {
    marginTop: 16,
    fontSize: 18,
    fontWeight: '700',
    color: '#1f1b1b'
  },
  tableGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10
  },
  menuRow: {
    gap: 10,
    paddingVertical: 10
  },
  menuItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d4d4d4',
    padding: 12,
    width: 200
  },
  menuItemActive: {
    borderColor: '#9f1d22',
    backgroundColor: '#fbe8e9'
  },
  menuName: {
    fontWeight: '700',
    color: '#2f1f1f'
  },
  menuPrice: {
    marginTop: 6,
    color: '#5e5e5e'
  },
  summary: {
    marginTop: 8,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14
  },
  summaryText: {
    fontSize: 16,
    marginBottom: 4
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 14
  },
  confirmBtn: {
    flex: 1,
    backgroundColor: '#9f1d22',
    paddingVertical: 14,
    borderRadius: 10
  },
  payBtn: {
    flex: 1,
    backgroundColor: '#2c7a4a',
    paddingVertical: 14,
    borderRadius: 10
  },
  btnText: {
    textAlign: 'center',
    color: '#fff',
    fontWeight: '700'
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }]
  }
});
