import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native';
import { useBarakahStore } from '../store/useBarakahStore';
import { CalendarGrid } from '../components/CalendarGrid';
import { MilestoneItem } from '../components/MilestoneItem';
import { updateUser } from '../services/firestoreService';
import { COLORS, RADIUS, SHADOWS } from '../components/theme';

export function IchScreen() {
  const {
    user,
    streak,
    longestStreak,
    hoursSaved,
    successRate,
    milestones,
    calendarMonth,
    calendarYear,
    monthLogs,
    fetchMonthLogs,
  } = useBarakahStore();

  const [showSettings, setShowSettings] = useState(false);

  if (!user) return null;

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
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Ich</Text>
          <TouchableOpacity
            style={styles.settingsBtn}
            onPress={() => setShowSettings(!showSettings)}
          >
            <Text style={styles.settingsIcon}>{showSettings ? '✕' : '⚙️'}</Text>
          </TouchableOpacity>
        </View>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarEmoji}</Text>
          </View>
          <Text style={styles.name}>{user.displayName}</Text>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>📍 {user.city}, {user.country}</Text>
          </View>
        </View>

        {/* Streak Mega Display */}
        <View style={styles.streakCard}>
          <Text style={styles.fireBig}>🔥</Text>
          <Text style={styles.bigNumber}>{streak}</Text>
          <Text style={styles.bigLabel}>Tage am Stück</Text>
          {streak > 0 && (
            <View style={styles.messageBadge}>
              <Text style={styles.messageText}>
                🎉 Masha'Allah! {streak} Tage Barakah!
              </Text>
            </View>
          )}
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{streak}</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{longestStreak}</Text>
            <Text style={styles.statLabel}>Rekord</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{hoursSaved}</Text>
            <Text style={styles.statLabel}>Std. gespart</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{successRate}%</Text>
            <Text style={styles.statLabel}>Quote</Text>
          </View>
        </View>

        {/* Calendar */}
        <View style={styles.calendarHeader}>
          <TouchableOpacity onPress={goToPrevMonth} style={styles.navBtn}>
            <Text style={styles.navArrow}>‹</Text>
          </TouchableOpacity>
          <Text style={styles.calendarTitle}>
            {monthNames[calendarMonth - 1]} {calendarYear}
          </Text>
          <TouchableOpacity onPress={goToNextMonth} style={styles.navBtn}>
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
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Meilensteine 🏆</Text>
        </View>

        <View style={styles.milestoneList}>
          {milestones.map((m) => (
            <MilestoneItem key={m.id} milestone={m} currentStreak={streak} />
          ))}
        </View>

        {/* Settings (collapsible) */}
        {showSettings && (
          <SettingsSection user={user} />
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
}

// Inline settings section
function SettingsSection({ user }: { user: any }) {
  const [city, setCity] = useState(user.city);
  const [country, setCountry] = useState(user.country);
  const [prayerReminders, setPrayerReminders] = useState(user.notificationPreferences.prayerReminders);
  const [streakReminder, setStreakReminder] = useState(user.notificationPreferences.streakReminder);
  const [quranGoal, setQuranGoal] = useState(String(user.dailyGoalQuranMinutes));
  const [travelMode, setTravelMode] = useState(user.travelMode ?? false);

  const handleSave = async () => {
    await updateUser(user.userId, {
      city,
      country,
      dailyGoalQuranMinutes: parseInt(quranGoal, 10) || 5,
      travelMode,
      notificationPreferences: {
        ...user.notificationPreferences,
        prayerReminders,
        streakReminder,
      },
    });
    Alert.alert('Gespeichert', 'Einstellungen aktualisiert.');
  };

  return (
    <View style={settingsStyles.wrapper}>
      <View style={settingsStyles.divider} />
      <Text style={settingsStyles.title}>⚙️ Einstellungen</Text>

      <Text style={settingsStyles.label}>Standort</Text>
      <View style={settingsStyles.card}>
        <View style={settingsStyles.inputRow}>
          <Text style={settingsStyles.inputLabel}>Stadt</Text>
          <TextInput style={settingsStyles.input} value={city} onChangeText={setCity} />
        </View>
        <View style={settingsStyles.inputRow}>
          <Text style={settingsStyles.inputLabel}>Land</Text>
          <TextInput style={settingsStyles.input} value={country} onChangeText={setCountry} />
        </View>
      </View>

      <Text style={settingsStyles.label}>Tagesziele</Text>
      <View style={settingsStyles.card}>
        <View style={settingsStyles.inputRow}>
          <Text style={settingsStyles.inputLabel}>Qur'an (Min)</Text>
          <TextInput
            style={settingsStyles.input}
            value={quranGoal}
            onChangeText={setQuranGoal}
            keyboardType="numeric"
          />
        </View>
      </View>

      <Text style={settingsStyles.label}>Benachrichtigungen</Text>
      <View style={settingsStyles.card}>
        <View style={settingsStyles.switchRow}>
          <Text style={settingsStyles.switchLabel}>Gebetserinnerungen</Text>
          <Switch
            value={prayerReminders}
            onValueChange={setPrayerReminders}
            trackColor={{ true: COLORS.greenMedium, false: COLORS.creamDarker }}
          />
        </View>
        <View style={settingsStyles.switchRow}>
          <Text style={settingsStyles.switchLabel}>Streak-Erinnerung (20:00)</Text>
          <Switch
            value={streakReminder}
            onValueChange={setStreakReminder}
            trackColor={{ true: COLORS.greenMedium, false: COLORS.creamDarker }}
          />
        </View>
      </View>

      <Text style={settingsStyles.label}>Spezial</Text>
      <View style={settingsStyles.card}>
        <View style={settingsStyles.switchRow}>
          <View>
            <Text style={settingsStyles.switchLabel}>Reise-Modus</Text>
            <Text style={settingsStyles.switchDesc}>Nur 3 Gebete (Qasr)</Text>
          </View>
          <Switch
            value={travelMode}
            onValueChange={setTravelMode}
            trackColor={{ true: COLORS.greenMedium, false: COLORS.creamDarker }}
          />
        </View>
      </View>

      <TouchableOpacity style={settingsStyles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
        <Text style={settingsStyles.saveBtnText}>Speichern</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 56,
    paddingHorizontal: 24,
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIcon: { fontSize: 18 },
  profileCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.gold,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 5,
  },
  avatarText: { fontSize: 32, color: COLORS.white, fontWeight: '600' },
  name: { fontSize: 20, fontWeight: '700', color: COLORS.textDark, marginTop: 12 },
  locationBadge: {
    backgroundColor: COLORS.greenPastel,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 40,
    marginTop: 8,
  },
  locationText: { fontSize: 13, color: COLORS.greenDeep, fontWeight: '500' },
  streakCard: {
    alignItems: 'center',
    paddingVertical: 16,
    marginHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: 20,
    ...SHADOWS.md,
    marginBottom: 20,
  },
  fireBig: { fontSize: 48, marginBottom: 4 },
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
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: 24,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    ...SHADOWS.sm,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.greenDeep,
  },
  statLabel: {
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
    fontWeight: '500',
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 8,
  },
  calendarTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  navBtn: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  navArrow: {
    fontSize: 24,
    color: COLORS.greenMedium,
    fontWeight: '600',
  },
  calendarWrap: {
    paddingHorizontal: 24,
  },
  sectionHeader: {
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  milestoneList: {
    paddingHorizontal: 24,
    gap: 10,
  },
});

const settingsStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: 24,
    marginTop: 16,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.creamDarker,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.textDark,
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    marginTop: 16,
    marginBottom: 8,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    padding: 16,
    ...SHADOWS.sm,
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  inputLabel: { fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  input: {
    fontSize: 14,
    color: COLORS.textMedium,
    textAlign: 'right',
    minWidth: 100,
    padding: 6,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.creamDark,
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
  },
  switchLabel: { fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  switchDesc: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  saveBtn: {
    marginTop: 20,
    padding: 18,
    backgroundColor: COLORS.greenDeep,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});
