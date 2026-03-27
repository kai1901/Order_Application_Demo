import { Pressable, StyleSheet, Text } from 'react-native';

export default function TableCard({ table, selected, onPress }) {
  const isOccupied = table.status === 'OCCUPIED';

  return (
    <Pressable
      style={({ pressed }) => [
        styles.card,
        selected && styles.selected,
        isOccupied && styles.occupied,
        pressed && styles.pressed
      ]}
      onPress={onPress}
    >
      <Text style={[styles.name, isOccupied && styles.occupiedText]}>{table.name}</Text>
      <Text style={[styles.status, isOccupied && styles.occupiedText]}>{table.status}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#ddd',
    width: 140
  },
  selected: {
    borderColor: '#9f1d22',
    backgroundColor: '#fbe8e9'
  },
  occupied: {
    borderColor: '#9f1d22',
    backgroundColor: '#b6252a'
  },
  pressed: {
    transform: [{ scale: 0.98 }],
    opacity: 0.88
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#251313'
  },
  status: {
    marginTop: 8,
    color: '#5c5c5c'
  },
  occupiedText: {
    color: '#fff'
  }
});
