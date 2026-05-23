import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, AppState, AppStateStatus } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useBarakahStore } from '../store/useBarakahStore';
import { StreakBadge } from '../components/StreakBadge';
import { ProgressBar } from '../components/ProgressBar';
import { PrayerCard } from '../components/PrayerCard';
import { TaskItem } from '../components/TaskItem';
import { COLORS, RADIUS } from '../components/theme';

export function DashboardScreen() {
  const {
    user,
    dailyLog,
    streak,
    nextPrayer,
    isLocked,
    showConfetti,
    setShowConfetti,
    togglePrayer,
    updateQuranMinutes,
    incrementDhikr,
    toggleWudu,
    refreshNextPrayer,
    resetDay,
  } = useBarakahStore();

  const confettiRef = useRef<ConfettiCannon>(null);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const interval = setInterval(refreshNextPrayer, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const sub = AppState.addEventListener('change', (state: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && state === 'active') {
        resetDay();
      }
      appState.current = state;
    });
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (showConfetti) {
      confettiRef.current?.start();
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [showConfetti]);

  if (!dailyLog || !user) return null;

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
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>Assalamu Alaikum</Text>
              <Text style={styles.subGreeting}>Heute ist ein gesegneter Tag ☀️</Text>
            </View>
            <View style={styles.streakPill}>
              <Text style={styles.streakEmoji}>🔥</Text>
              <Text style={styles.streakCount}>{streak}</Text>
            </View>
          </View>

          <ProgressBar percent={progressPercent} />
          <Text style={styles.progressLabel}>
            {completedTasks}/{totalTasks} Aufgaben erledigt
          </Text>
        </View>

        {/* Next Prayer */}
        <PrayerCard nextPrayer={nextPrayer} />

        {/* Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Heutige Aufgaben</Text>
        </View>

        <View style={styles.taskList}>
          <TaskItem
            emoji="🕋"
            title="Fajr"
            subtitle={dailyLog.prayers.fajr ? 'Erledigt' : 'Noch offen'}
            checked={dailyLog.prayers.fajr}
            onToggle={() => togglePrayer('fajr')}
          />
          <TaskItem
            emoji="🕋"
            title="Dhuhr"
            subtitle={dailyLog.prayers.dhuhr ? 'Erledigt' : 'Noch offen'}
            checked={dailyLog.prayers.dhuhr}
            onToggle={() => togglePrayer('dhuhr')}
          />
          <TaskItem
            emoji="🕋"
            title="Asr"
            subtitle={dailyLog.prayers.asr ? 'Erledigt' : 'Noch offen'}
            checked={dailyLog.prayers.asr}
            onToggle={() => togglePrayer('asr')}
          />
          <TaskItem
            emoji="🕋"
            title="Maghrib"
            subtitle={dailyLog.prayers.maghrib ? 'Erledigt' : 'Noch offen'}
            checked={dailyLog.prayers.maghrib}
            onToggle={() => togglePrayer('maghrib')}
          />
          <TaskItem
            emoji="🕋"
            title="Isha"
            subtitle={dailyLog.prayers.isha ? 'Erledigt' : 'Noch offen'}
            checked={dailyLog.prayers.isha}
            onToggle={() => togglePrayer('isha')}
          />
          <TaskItem
            emoji="📖"
            title={`Qur'an lesen (${user.dailyGoalQuranMinutes} Min)`}
            subtitle={
              dailyLog.quranCompleted
                ? 'Erledigt'
                : `${dailyLog.quranMinutes}/${user.dailyGoalQuranMinutes} Min`
            }
            checked={dailyLog.quranCompleted}
            onToggle={() =>
              updateQuranMinutes(
                dailyLog.quranCompleted ? 0 : user.dailyGoalQuranMinutes
              )
            }
          />
          <TaskItem
            emoji="📿"
            title="Dhikr (33+33+34)"
            subtitle={
              dailyLog.dhikrCompleted
                ? 'Erledigt'
                : `${dailyLog.dhikr.subhanallah}+${dailyLog.dhikr.alhamdulillah}+${dailyLog.dhikr.allahuakbar}`
            }
            checked={dailyLog.dhikrCompleted}
            onToggle={() => {
              if (!dailyLog.dhikrCompleted) {
                for (let i = 0; i < user.dailyGoalDhikrSubhanallah - dailyLog.dhikr.subhanallah; i++)
                  incrementDhikr('subhanallah');
                for (let i = 0; i < user.dailyGoalDhikrAlhamdulillah - dailyLog.dhikr.alhamdulillah; i++)
                  incrementDhikr('alhamdulillah');
                for (let i = 0; i < user.dailyGoalDhikrAllahuakbar - dailyLog.dhikr.allahuakbar; i++)
                  incrementDhikr('allahuakbar');
              }
            }}
          />
        </View>

        {/* Status Banner */}
        <View style={[styles.statusBanner, !isLocked && styles.statusUnlocked]}>
          <Text style={styles.statusEmoji}>{isLocked ? '🔒' : '🔓'}</Text>
          <Text style={[styles.statusText, !isLocked && styles.statusTextUnlocked]}>
            {isLocked
              ? `Noch ${totalTasks - completedTasks} Aufgaben bis Apps freigeschaltet`
              : "Masha'Allah! Apps freigeschaltet 🎉"}
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {showConfetti && (
        <ConfettiCannon
          ref={confettiRef}
          count={80}
          origin={{ x: -10, y: 0 }}
          autoStart
          fadeOut
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 20,
    backgroundColor: COLORS.greenDeep,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  greeting: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.white,
  },
  subGreeting: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  streakPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  streakEmoji: { fontSize: 18 },
  streakCount: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.gold,
  },
  progressLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  taskList: {
    paddingHorizontal: 24,
    gap: 10,
  },
  statusBanner: {
    marginHorizontal: 24,
    marginTop: 20,
    padding: 16,
    backgroundColor: COLORS.redLight,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusUnlocked: {
    backgroundColor: COLORS.greenPastel,
  },
  statusEmoji: { fontSize: 20 },
  statusText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.red,
  },
  statusTextUnlocked: {
    color: COLORS.greenDeep,
  },
});
