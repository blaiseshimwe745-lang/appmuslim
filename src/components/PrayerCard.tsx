import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { COLORS, SHADOWS, RADIUS } from './theme';
import { NextPrayer } from '../types';
import { minutesToDisplay } from '../utils/dateHelpers';

interface Props {
  nextPrayer: NextPrayer | null;
}

export function PrayerCard({ nextPrayer }: Props) {
  const { t } = useTranslation();
  if (!nextPrayer) return null;

  const prayerName = nextPrayer.tomorrow ? t('prayers.fajrTomorrow') : nextPrayer.name;

  return (
    <View style={styles.card}>
      <View style={styles.accent} />
      <View style={styles.info}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>🕌</Text>
        </View>
        <View>
          <Text style={styles.name}>{t('prayerCard.nextPrayer', { name: prayerName })}</Text>
          <Text style={styles.time}>
            {t('prayerCard.timeRemaining', { time: nextPrayer.time, remaining: minutesToDisplay(nextPrayer.minutesUntil) })}
          </Text>
        </View>
      </View>
      <View style={styles.countdown}>
        <Text style={styles.countdownText}>{nextPrayer.time}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 24,
    marginTop: 16,
    marginBottom: 12,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.md,
    padding: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...SHADOWS.sm,
  },
  accent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 3,
    height: '100%',
    backgroundColor: COLORS.gold,
    borderTopLeftRadius: RADIUS.md,
    borderBottomLeftRadius: RADIUS.md,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  icon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: COLORS.greenPastel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: { fontSize: 20 },
  name: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  time: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  countdown: {
    backgroundColor: COLORS.greenPastel,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 40,
  },
  countdownText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.greenMedium,
  },
});
