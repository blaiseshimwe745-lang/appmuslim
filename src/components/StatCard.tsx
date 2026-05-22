import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, RADIUS } from './theme';

interface Props {
  value: string | number;
  label: string;
}

export function StatCard({ value, label }: Props) {
  return (
    <View style={styles.card}>
      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 16,
    alignItems: 'center',
    ...SHADOWS.sm,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.greenDeep,
    letterSpacing: -0.3,
  },
  label: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
    textAlign: 'center',
  },
});
