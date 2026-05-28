import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SHADOWS, RADIUS } from './theme';
import { Milestone } from '../types';

interface Props {
  milestone: Milestone;
  currentStreak: number;
}

export function MilestoneItem({ milestone, currentStreak }: Props) {
  const { t } = useTranslation();
  const remaining = milestone.targetDays - currentStreak;

  return (
    <View style={[styles.item, milestone.isAchieved && styles.achieved]}>
      <Text style={styles.emoji}>{milestone.emoji}</Text>
      <View style={styles.text}>
        <Text style={styles.title}>{t(`milestones.${milestone.type}`)}</Text>
        <Text style={styles.subtitle}>
          {milestone.isAchieved
            ? t('milestones.achievedStatus')
            : t('milestones.remainingStatus', { count: remaining })}
        </Text>
      </View>
      <View style={[styles.badge, milestone.isAchieved && styles.badgeAchieved]}>
        <Text style={[styles.badgeText, milestone.isAchieved && styles.badgeTextAchieved]}>
          {milestone.isAchieved ? t('milestones.achievedBadge') : `${milestone.progress}%`}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    ...SHADOWS.sm,
  },
  achieved: {
    backgroundColor: '#f5f0e0',
  },
  emoji: { fontSize: 22 },
  text: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  badge: {
    backgroundColor: COLORS.creamDark,
    paddingVertical: 4,
    paddingHorizontal: 14,
    borderRadius: 40,
  },
  badgeAchieved: {
    backgroundColor: COLORS.greenPastel,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: COLORS.textMedium,
  },
  badgeTextAchieved: {
    color: COLORS.greenDeep,
  },
});
