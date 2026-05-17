import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const STATUS_OPTIONS = ['planned', 'watching', 'watched'];
const STATUS_COLORS = { planned: '#888', watching: '#f9c84a', watched: '#4caf50' };
const STATUS_ICONS = { planned: '📌', watching: '▶️', watched: '✅' };

export default function WatchlistItem({ item, onPress, onRemove, onStatusChange }) {
  return (
    <View style={styles.card}>
      <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.8}>
        <Image
          source={{
            uri: item.poster || `https://via.placeholder.com/56x80/1a1a1a/555?text=?`,
          }}
          style={styles.poster}
          resizeMode="cover"
        />
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
          <Text style={[styles.status, { color: STATUS_COLORS[item.status] }]}>
            {STATUS_ICONS[item.status]} {item.status?.charAt(0).toUpperCase() + item.status?.slice(1)}
          </Text>
          {item.status === 'watched' && item.watchedAt && (
            <Text style={styles.watchedDate}>
              Watched {new Date(item.watchedAt).toLocaleDateString()}
            </Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        <View style={styles.statusBtns}>
          {STATUS_OPTIONS.map(s => (
            <TouchableOpacity
              key={s}
              style={[styles.statusBtn, item.status === s && styles.statusBtnActive]}
              onPress={() => onStatusChange(s)}
            >
              <Text style={[styles.statusBtnText, item.status === s && styles.statusBtnTextActive]}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity onPress={onRemove} style={styles.removeBtn}>
          <Text style={styles.removeText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderRadius: 10, overflow: 'hidden' },
  row: { flexDirection: 'row', padding: 12 },
  poster: { width: 54, height: 80, borderRadius: 5, backgroundColor: '#2a2a2a' },
  info: { flex: 1, paddingLeft: 12, justifyContent: 'center' },
  title: { color: '#fff', fontWeight: '600', fontSize: 15, marginBottom: 5 },
  status: { fontSize: 13, fontWeight: '500' },
  watchedDate: { color: '#555', fontSize: 11, marginTop: 3 },
  actions: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingBottom: 10, gap: 8 },
  statusBtns: { flex: 1, flexDirection: 'row', gap: 6 },
  statusBtn: {
    flex: 1, paddingVertical: 5, borderRadius: 4,
    borderWidth: 1, borderColor: '#2a2a2a', alignItems: 'center',
  },
  statusBtnActive: { backgroundColor: '#f5c518', borderColor: '#f5c518' },
  statusBtnText: { color: '#555', fontSize: 11, fontWeight: '500' },
  statusBtnTextActive: { color: '#000', fontWeight: '700' },
  removeBtn: { padding: 6 },
  removeText: { color: '#555', fontSize: 16 },
});
