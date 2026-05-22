import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useBarakahStore } from '../store/useBarakahStore';
import { CalendarGrid } from '../components/CalendarGrid';
import { StatCard } from '../components/StatCard';
import { MilestoneItem } from '../components/MilestoneItem';
import { COLORS, RADIUS } from '../components/theme';

interface Props {
  onBack: () => void;
}

export function StreakScreen({ onBack }: Props) {
  const {
    streak,
    longestStreak,
    hoursSaved,
    successRate,
    milestones,
    calendarMonth,
    calendarYear,
    monthLogs,
    user,
    fetchMonthLogs,
  } = useBarakahStore();

  const monthNames = [
    'Januar', 'Februar', 'März', 'April', 'Mai', 'Juni',
    'Juli', 'August', 'September', 'Oktober', 'November', 'Dezember',
  ];

  const goToPrevMonth = () => {
    const m = calendarMonth === 1 ? 12 : calendarMonth - 1;
    const y = calendarMonth === 1 ? calendarYear - 1 : calendarYear;
    fetchMonthLogs(m, y);
  };

  const goToNextMonth = () => {
    const m = calendarMonth === 12 ? 1 : calendarMonth + 1;
    const y = calendarMonth === 12 ? calendarYear + 1 : calendarYear;
    fetchMonthLogs(m, y);
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Back Header */}
        <View style={styles.backHeader}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mein Streak</Text>
        </View>

        {/* Mega Streak */}
        <View style={styles.mega}>
          <Text style={styles.fireBig}>🔥</Text>
          <Text style={styles.bigNumber}>{streak}</Text>
          <Text style={styles.bigLabel}>Tage am Stück</Text>
          <View style={styles.messageBadge}>
            <Text style={styles.messageText}>
              🎉 Masha'Allah! {streak} Tage Barakah!
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <StatCard value={hoursSaved} label="Stunden gespart" />
          <StatCard value={`${successRate}%`} label="Erfolgsquote" />
          <StatCard value={`#${user?.rank || '–'}`} label="Rang weltweit" />
        </View>

        {/* Calendar */}
        <View style={styles.sectionHeader}>
          <TouchableOpacity onPress={goToPrevMonth}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.sectionTitle}>
            {monthNames[calendarMonth - 1]} {calendarYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth}>
            <Text style={styles.navArrow}>›</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.calendarWrap}>
          <CalendarGrid
            year={calendarYear}
            month={calendarMonth}
            logs={monthLogs}
            currentStreak={streak}
          />
        </View>

        {/* Milestones */}
        <View style={[styles.sectionHeader, { marginTop: 24 }]}>
          <Text style={styles.sectionTitle}>Meilensteine 🏆</Text>
          <View />
        </View>

        <View style={styles.milestoneList}>
          {milestones.map((m) => (
            <MilestoneItem key={m.id} milestone={m} currentStreak={streak} />
          ))}
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  backHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 56,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backBtn: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  backIcon: { fontSize: 20, color: COLORS.textDark },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  mega: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  fireBig: { fontSize: 52, marginBottom: 4 },
  bigNumber: {
    fontSize: 52,
    fontWeight: '700',
    color: COLORS.greenDeep,
    lineHeight: 60,
    letterSpacing: -2,
  },
  bigLabel: {
    fontSize: 15,
    color: COLORS.textMedium,
    fontWeight: '400',
    marginTop: 4,
  },
  messageBadge: {
    backgroundColor: COLORS.greenPastel,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 40,
    marginTop: 12,
  },
  messageText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.greenDeep,
  },
  stats: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  navArrow: {
    fontSize: 24,
    color: COLORS.greenMedium,
    fontWeight: '600',
    paddingHorizontal: 12,
  },
  calendarWrap: {
    paddingHorizontal: 24,
  },
  milestoneList: {
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 12,
  },
});
