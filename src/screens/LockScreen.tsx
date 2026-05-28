import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useBarakahStore } from '../store/useBarakahStore';
import { TaskItem } from '../components/TaskItem';
import { COLORS, RADIUS } from '../components/theme';

interface Props {
  onGoToDashboard: () => void;
}

export function LockScreen({ onGoToDashboard }: Props) {
  const { t } = useTranslation();
  const { dailyLog, togglePrayer, isLocked } = useBarakahStore();

  if (!dailyLog) return null;

  const completedTasks = [
    dailyLog.prayers.fajr,
    dailyLog.prayers.dhuhr,
    dailyLog.prayers.asr,
    dailyLog.prayers.maghrib,
    dailyLog.prayers.isha,
    dailyLog.quranCompleted,
    dailyLog.dhikrCompleted,
    dailyLog.wuduComplete,
  ].filter(Boolean).length;
  const remaining = 8 - completedTasks;

  return (
    <View style={styles.container}>
      <View style={styles.lockIconWrap}>
        <Text style={styles.lockEmoji}>{isLocked ? '🔒' : '🔓'}</Text>
      </View>

      <Text style={styles.title}>
        {isLocked ? t('lock.locked') : t('lock.unlocked')}
      </Text>
      <Text style={styles.subtitle}>
        {isLocked ? t('lock.lockedSubtitle') : t('lock.unlockedSubtitle')}
      </Text>

      <View style={styles.lockedApps}>
        {['📸', '🎵', '▶️', '💬'].map((emoji, i) => (
          <View key={i} style={styles.appIcon}>
            <Text style={styles.appEmoji}>{emoji}</Text>
            {isLocked && <Text style={styles.appLock}>🔒</Text>}
          </View>
        ))}
      </View>

      {isLocked && (
        <View style={styles.taskList}>
          <TaskItem
            emoji="🕋"
            title={t('lock.fajrDhuhr')}
            subtitle={
              dailyLog.prayers.fajr && dailyLog.prayers.dhuhr
                ? t('lock.fajrDhuhrDone')
                : t('lock.taskOpen')
            }
            checked={dailyLog.prayers.fajr && dailyLog.prayers.dhuhr}
            onToggle={() => {
              if (!dailyLog.prayers.fajr) togglePrayer('fajr');
              if (!dailyLog.prayers.dhuhr) togglePrayer('dhuhr');
            }}
          />
          <TaskItem
            emoji="🕋"
            title={t('lock.asrTask')}
            subtitle={
              dailyLog.prayers.asr
                ? t('lock.asrDone')
                : t('lock.taskOpen')
            }
            checked={dailyLog.prayers.asr}
            onToggle={() => togglePrayer('asr')}
          />
        </View>
      )}

      {isLocked && (
        <Text style={styles.remaining}>
          ⏱️ <Text style={styles.remainingBold}>{t('lock.remaining', { count: remaining })}</Text>
        </Text>
      )}

      <TouchableOpacity
        style={[styles.btn, !isLocked && styles.btnSuccess]}
        onPress={onGoToDashboard}
        activeOpacity={0.8}
      >
        <Text style={styles.btnText}>
          {isLocked ? t('lock.backToDashboard') : t('lock.continueToApp')}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  lockIconWrap: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.redLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  lockEmoji: { fontSize: 40 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textMedium,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 280,
  },
  lockedApps: {
    flexDirection: 'row',
    gap: 16,
    marginVertical: 24,
  },
  appIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  appEmoji: { fontSize: 28 },
  appLock: {
    position: 'absolute',
    top: -4,
    right: -4,
    fontSize: 12,
  },
  taskList: {
    width: '100%',
    gap: 10,
  },
  remaining: {
    marginTop: 20,
    fontSize: 13,
    color: COLORS.textLight,
  },
  remainingBold: {
    fontWeight: '700',
    color: COLORS.greenDeep,
  },
  btn: {
    width: '100%',
    padding: 18,
    backgroundColor: '#c44',
    borderRadius: RADIUS.md,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#c44',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 5,
  },
  btnSuccess: {
    backgroundColor: COLORS.greenDeep,
    shadowColor: COLORS.greenDeep,
  },
  btnText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
