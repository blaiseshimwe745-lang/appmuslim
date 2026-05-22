import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, RADIUS } from './theme';
import { DailyLog } from '../types';
import { getCalendarData, getToday } from '../utils/dateHelpers';

interface Props {
  year: number;
  month: number;
  logs: DailyLog[];
  currentStreak: number;
}

const DAY_LABELS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So'];

export function CalendarGrid({ year, month, logs, currentStreak }: Props) {
  const { daysInMonth, startDayOfWeek } = getCalendarData(year, month);
  const today = getToday();
  const todayDay = new Date().getDate();
  const isCurrentMonth =
    new Date().getMonth() + 1 === month && new Date().getFullYear() === year;

  const completedDays = new Set(
    logs.filter((l) => l.allTasksDone).map((l) => parseInt(l.date.split('-')[2], 10))
  );

  const streakStartDay = isCurrentMonth ? Math.max(1, todayDay - currentStreak + 1) : -1;

  return (
    <View style={styles.grid}>
      {DAY_LABELS.map((label) => (
        <View style={styles.labelCell} key={label}>
          <Text style={styles.labelText}>{label}</Text>
        </View>
      ))}

      {Array.from({ length: startDayOfWeek }).map((_, i) => (
        <View style={styles.emptyCell} key={`empty-${i}`} />
      ))}

      {Array.from({ length: daysInMonth }).map((_, i) => {
        const day = i + 1;
        const isDone = completedDays.has(day);
        const isToday = isCurrentMonth && day === todayDay;
        const isPast = isCurrentMonth ? day < todayDay : true;
        const isMissed = isPast && !isDone && !(isCurrentMonth && day === todayDay);
        const isStreakDay =
          isDone && isCurrentMonth && day >= streakStartDay && day <= todayDay;

        return (
          <View
            key={day}
            style={[
              styles.dayCell,
              isDone && styles.done,
              isStreakDay && styles.streak,
              isToday && styles.today,
              isMissed && styles.missed,
            ]}
          >
            <Text
              style={[
                styles.dayText,
                (isDone || isStreakDay) && styles.dayTextLight,
                isMissed && styles.dayTextMissed,
              ]}
            >
              {day}
            </Text>
            {isStreakDay && <Text style={styles.fireIcon}>🔥</Text>}
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 5,
    marginTop: 14,
  },
  labelCell: {
    width: '13%',
    alignItems: 'center',
    paddingVertical: 6,
  },
  labelText: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
  },
  emptyCell: {
    width: '13%',
    aspectRatio: 1,
  },
  dayCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: 10,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  done: { backgroundColor: COLORS.greenDeep },
  streak: {
    backgroundColor: COLORS.greenDeep,
    shadowColor: COLORS.greenDeep,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 3,
  },
  today: {
    borderWidth: 2,
    borderColor: COLORS.gold,
  },
  missed: { backgroundColor: COLORS.redLight },
  dayText: {
    fontSize: 13,
    fontWeight: '500',
    color: COLORS.textMedium,
  },
  dayTextLight: { color: COLORS.white, fontWeight: '600' },
  dayTextMissed: { color: COLORS.red },
  fireIcon: {
    position: 'absolute',
    top: -2,
    right: -2,
    fontSize: 8,
  },
});
