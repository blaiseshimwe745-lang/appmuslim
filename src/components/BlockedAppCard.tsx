import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SHADOWS, RADIUS } from './theme';
import { BlockedApp } from '../types';

interface Props {
  app: BlockedApp;
  isUnlocked: boolean;
  remainingTasks: number;
}

export function BlockedAppCard({ app, isUnlocked, remainingTasks }: Props) {
  return (
    <View style={[styles.card, isUnlocked && styles.unlocked]}>
      <Text style={styles.emoji}>{app.emoji}</Text>
      <View style={styles.text}>
        <Text style={styles.name}>{app.appName}</Text>
        <Text style={styles.status}>
          {isUnlocked ? 'Bereits freigeschaltet ✅' : `Noch ${remainingTasks} Aufgaben übrig 🔒`}
        </Text>
      </View>
      <Text style={styles.lockIcon}>{isUnlocked ? '✅' : '🔒'}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    ...SHADOWS.sm,
  },
  unlocked: {
    backgroundColor: COLORS.greenPastel,
  },
  emoji: { fontSize: 24 },
  text: { flex: 1 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  status: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  lockIcon: { fontSize: 14 },
});
