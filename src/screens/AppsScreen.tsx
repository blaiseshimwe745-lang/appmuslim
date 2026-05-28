import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBarakahStore } from '../store/useBarakahStore';
import { BlockedAppCard } from '../components/BlockedAppCard';
import { COLORS, RADIUS, SHADOWS } from '../components/theme';

export function AppsScreen() {
  const { t } = useTranslation();
  const { dailyLog, blockedApps, isLocked } = useBarakahStore();

  if (!dailyLog) return null;

  const completedTasks = [
    dailyLog.prayers.fajr,
    dailyLog.prayers.dhuhr,
    dailyLog.prayers.asr,
    dailyLog.prayers.maghrib,
    dailyLog.prayers.isha,
    dailyLog.quranCompleted,
    dailyLog.dhikrCompleted,
  ].filter(Boolean).length;
  const totalTasks = 7;
  const remainingTasks = totalTasks - completedTasks;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t('apps.title')}</Text>
        </View>

        {/* Lock Status Card */}
        <View style={[styles.statusCard, !isLocked && styles.statusUnlocked]}>
          <View style={[styles.lockCircle, !isLocked && styles.lockCircleUnlocked]}>
            <Text style={styles.lockEmoji}>{isLocked ? '🔒' : '🔓'}</Text>
          </View>
          <Text style={[styles.statusTitle, !isLocked && styles.statusTitleUnlocked]}>
            {isLocked ? t('apps.locked') : t('apps.unlocked')}
          </Text>
          <Text style={styles.statusSubtitle}>
            {isLocked
              ? t('apps.lockedSubtitle', { count: remainingTasks })
              : t('apps.unlockedSubtitle')}
          </Text>

          {isLocked && (
            <View style={styles.progressRow}>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${Math.round((completedTasks / totalTasks) * 100)}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {completedTasks}/{totalTasks}
              </Text>
            </View>
          )}
        </View>

        {/* App Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('apps.blockedApps')}</Text>
        </View>

        <View style={styles.appList}>
          {blockedApps.map((app) => (
            <BlockedAppCard
              key={app.id}
              app={app}
              isUnlocked={!isLocked}
              remainingTasks={remainingTasks}
            />
          ))}
        </View>

        {/* Info */}
        <View style={styles.infoCard}>
          <Text style={styles.infoEmoji}>💡</Text>
          <Text style={styles.infoText}>
            {t('apps.info')}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  statusCard: {
    marginHorizontal: 24,
    padding: 24,
    backgroundColor: COLORS.redLight,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  statusUnlocked: {
    backgroundColor: COLORS.greenPastel,
  },
  lockCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(212,68,68,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  lockCircleUnlocked: {
    backgroundColor: 'rgba(13,90,90,0.12)',
  },
  lockEmoji: { fontSize: 32 },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.red,
    marginBottom: 6,
  },
  statusTitleUnlocked: {
    color: COLORS.greenDeep,
  },
  statusSubtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 280,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginTop: 16,
    width: '100%',
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(212,68,68,0.15)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.greenDeep,
    borderRadius: 4,
  },
  progressText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMedium,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  appList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  infoCard: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.goldPale,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  infoEmoji: { fontSize: 18, marginTop: 1 },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: COLORS.textMedium,
    lineHeight: 20,
  },
});
