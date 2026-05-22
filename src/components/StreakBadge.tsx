import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from './theme';

interface Props {
  streak: number;
  onPress: () => void;
}

export function StreakBadge({ streak, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.badge} onPress={onPress} activeOpacity={0.8}>
      <Text style={styles.fire}>🔥</Text>
      <Text style={styles.number}>{streak}</Text>
      <Text style={styles.label}>Tage Streak</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.10)',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 40,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  fire: { fontSize: 22 },
  number: {
    fontSize: 26,
    fontWeight: '700',
    color: COLORS.goldLight,
    lineHeight: 30,
  },
  label: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
});
