import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ReviewCard({ review, onDelete, showUser, showTitle }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });

  const starsDisplay = '★'.repeat(Math.round(review.rating / 2)) + '☆'.repeat(5 - Math.round(review.rating / 2));

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.left}>
          {showUser && review.userId?.username && (
            <Text style={styles.username}>{review.userId.username}</Text>
          )}
          {showTitle && review.title && (
            <Text style={styles.title}>{review.title}</Text>
          )}
          <Text style={styles.date}>{date}</Text>
        </View>
        <View style={styles.ratingBlock}>
          <Text style={styles.ratingNum}>{review.rating}<Text style={styles.ratingMax}>/10</Text></Text>
          <Text style={styles.stars}>{starsDisplay}</Text>
        </View>
      </View>

      {review.reviewText ? (
        <Text style={styles.reviewText}>{review.reviewText}</Text>
      ) : null}

      {onDelete && (
        <TouchableOpacity style={styles.deleteBtn} onPress={onDelete}>
          <Text style={styles.deleteText}>Delete</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#1a1a1a', borderRadius: 10, padding: 14, borderLeftWidth: 3, borderLeftColor: '#E50914' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  left: { flex: 1, marginRight: 10 },
  username: { color: '#E50914', fontWeight: 'bold', fontSize: 14, marginBottom: 2 },
  title: { color: '#fff', fontWeight: '600', fontSize: 15, marginBottom: 2 },
  date: { color: '#555', fontSize: 12 },
  ratingBlock: { alignItems: 'flex-end' },
  ratingNum: { color: '#fff', fontWeight: 'bold', fontSize: 18 },
  ratingMax: { color: '#666', fontSize: 12 },
  stars: { color: '#f9c84a', fontSize: 12, marginTop: 2 },
  reviewText: { color: '#bbb', fontSize: 14, lineHeight: 21 },
  deleteBtn: { marginTop: 10, alignSelf: 'flex-end', padding: 4 },
  deleteText: { color: '#E50914', fontSize: 13 },
});
