import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useBarakahStore } from '../store/useBarakahStore';
import { StatCard } from '../components/StatCard';
import { COLORS, RADIUS, SHADOWS } from '../components/theme';

interface Props {
  onBack: () => void;
}

export function ProfileScreen({ onBack }: Props) {
  const { user, streak, longestStreak, hoursSaved, successRate } = useBarakahStore();
  if (!user) return null;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Mein Profil</Text>
        </View>

        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.avatarEmoji}</Text>
          </View>
          <Text style={styles.name}>{user.displayName}</Text>
          <Text style={styles.email}>{user.email || 'Anonymer Benutzer'}</Text>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>📍 {user.city}, {user.country}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.stats}>
          <StatCard value={streak} label="Aktueller Streak" />
          <StatCard value={longestStreak} label="Längster Streak" />
        </View>
        <View style={[styles.stats, { marginTop: 10 }]}>
          <StatCard value={hoursSaved} label="Stunden gespart" />
          <StatCard value={`${successRate}%`} label="Erfolgsquote" />
        </View>
        <View style={[styles.stats, { marginTop: 10 }]}>
          <StatCard value={user.totalDaysCompleted} label="Tage erledigt" />
          <StatCard value={`#${user.rank || '–'}`} label="Weltrang" />
        </View>

        {/* Info Cards */}
        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>🕋</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Berechnungsmethode</Text>
              <Text style={styles.infoValue}>Methode {user.calculationMethod} (MWL)</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>📖</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Qur'an Tagesziel</Text>
              <Text style={styles.infoValue}>{user.dailyGoalQuranMinutes} Minuten</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoEmoji}>📿</Text>
            <View style={styles.infoText}>
              <Text style={styles.infoTitle}>Dhikr Tagesziel</Text>
              <Text style={styles.infoValue}>
                {user.dailyGoalDhikrSubhanallah}+{user.dailyGoalDhikrAlhamdulillah}+{user.dailyGoalDhikrAllahuakbar}
              </Text>
            </View>
          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingTop: 56,
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  backBtn: { padding: 4, paddingHorizontal: 8, borderRadius: 12 },
  backIcon: { fontSize: 20, color: COLORS.textDark },
  headerTitle: { fontSize: 20, fontWeight: '700', color: COLORS.textDark },
  avatarSection: { alignItems: 'center', paddingVertical: 20 },
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
  email: { fontSize: 14, color: COLORS.textLight, marginTop: 4 },
  locationBadge: {
    backgroundColor: COLORS.greenPastel,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 40,
    marginTop: 10,
  },
  locationText: { fontSize: 13, color: COLORS.greenDeep, fontWeight: '500' },
  stats: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 24,
  },
  infoSection: {
    paddingHorizontal: 24,
    gap: 10,
    marginTop: 20,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    ...SHADOWS.sm,
  },
  infoEmoji: { fontSize: 24 },
  infoText: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: '600', color: COLORS.textDark },
  infoValue: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
});
