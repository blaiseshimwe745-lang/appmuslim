import React, { useEffect, useRef } from 'react';
import { View, Text, ScrollView, StyleSheet, AppState, AppStateStatus } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { useBarakahStore } from '../store/useBarakahStore';
import { StreakBadge } from '../components/StreakBadge';
import { ProgressBar } from '../components/ProgressBar';
import { PrayerCard } from '../components/PrayerCard';
import { TaskItem } from '../components/TaskItem';
import { BlockedAppCard } from '../components/BlockedAppCard';
import { COLORS, RADIUS } from '../components/theme';
import { PrayerName } from '../types';

interface Props {
  onNavigate: (tab: string) => void;
}

export function DashboardScreen({ onNavigate }: Props) {
  const {
    user,
    dailyLog,
    streak,
    nextPrayer,
    blockedApps,
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

  const completedTasks =
    [
      dailyLog.prayers.fajr,
      dailyLog.prayers.dhuhr,
      dailyLog.prayers.asr,
      dailyLog.prayers.maghrib,
      dailyLog.prayers.isha,
      dailyLog.quranCompleted,
      dailyLog.dhikrCompleted,
      dailyLog.wuduComplete,
    ].filter(Boolean).length;
  const totalTasks = 8;
  const progressPercent = Math.round((completedTasks / totalTasks) * 100);
  const remainingTasks = totalTasks - completedTasks;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.topRow}>
            <View>
              <Text style={styles.greeting}>Assalamu Alaikum,</Text>
              <Text style={styles.subGreeting}>Heute ist ein gesegneter Tag ☀️</Text>
            </View>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.avatarEmoji}</Text>
            </View>
          </View>

          <StreakBadge streak={streak} onPress={() => onNavigate('streak')} />
          <ProgressBar percent={progressPercent} />
        </View>

        {/* Prayer Card */}
        <PrayerCard nextPrayer={nextPrayer} />

        {/* Tasks */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Heutige Aufgaben</Text>
          <Text style={styles.seeAll} onPress={() => onNavigate('streak')}>
            Alle anzeigen
          </Text>
        </View>

        <View style={styles.taskList}>
          <TaskItem
            emoji="🕋"
            title="Fajr gebetet"
            subtitle={dailyLog.prayers.fajr ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.prayers.fajr}
            onToggle={() => togglePrayer('fajr')}
          />
          <TaskItem
            emoji="🕋"
            title="Dhuhr gebetet"
            subtitle={dailyLog.prayers.dhuhr ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.prayers.dhuhr}
            onToggle={() => togglePrayer('dhuhr')}
          />
          <TaskItem
            emoji="🕋"
            title="Asr gebetet"
            subtitle={dailyLog.prayers.asr ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.prayers.asr}
            onToggle={() => togglePrayer('asr')}
          />
          <TaskItem
            emoji="🕋"
            title="Maghrib gebetet"
            subtitle={dailyLog.prayers.maghrib ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.prayers.maghrib}
            onToggle={() => togglePrayer('maghrib')}
          />
          <TaskItem
            emoji="🕋"
            title="Isha gebetet"
            subtitle={dailyLog.prayers.isha ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.prayers.isha}
            onToggle={() => togglePrayer('isha')}
          />
          <TaskItem
            emoji="📖"
            title={`Qur'an lesen (${user.dailyGoalQuranMinutes} Min)`}
            subtitle={
              dailyLog.quranCompleted
                ? 'Erledigt ✅'
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
                ? 'Erledigt ✅'
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
          <TaskItem
            emoji="💧"
            title="Wudu & Abendgebet"
            subtitle={dailyLog.wuduComplete ? 'Erledigt ✅' : 'Noch offen ⏳'}
            checked={dailyLog.wuduComplete}
            onToggle={toggleWudu}
          />
        </View>

        {/* Blocked Apps */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>🔒 Blockierte Apps</Text>
          <Text style={styles.seeAll}>Verwalten</Text>
        </View>

        <View style={styles.taskList}>
          {blockedApps.map((app) => (
            <BlockedAppCard
              key={app.id}
              app={app}
              isUnlocked={!isLocked}
              remainingTasks={remainingTasks}
            />
          ))}
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
    paddingBottom: 24,
    backgroundColor: COLORS.greenDeep,
    borderBottomLeftRadius: RADIUS.lg,
    borderBottomRightRadius: RADIUS.lg,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 21,
    fontWeight: '700',
    color: COLORS.white,
  },
  subGreeting: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 3,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  avatarText: {
    fontSize: 18,
    color: COLORS.white,
    fontWeight: '600',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  seeAll: {
    fontSize: 13,
    color: COLORS.greenMedium,
    fontWeight: '500',
  },
  taskList: {
    paddingHorizontal: 24,
    gap: 10,
  },
});
