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
import { updateUser } from '../services/firestoreService';
import { COLORS, RADIUS, SHADOWS } from '../components/theme';

interface Props {
  onBack: () => void;
}

export function SettingsScreen({ onBack }: Props) {
  const { user } = useBarakahStore();
  if (!user) return null;

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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onBack} style={styles.backBtn}>
            <Text style={styles.backIcon}>←</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Einstellungen</Text>
        </View>

        {/* Location */}
        <Text style={styles.sectionLabel}>Standort</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Stadt</Text>
            <TextInput style={styles.input} value={city} onChangeText={setCity} />
          </View>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Land</Text>
            <TextInput style={styles.input} value={country} onChangeText={setCountry} />
          </View>
        </View>

        {/* Goals */}
        <Text style={styles.sectionLabel}>Tagesziele</Text>
        <View style={styles.card}>
          <View style={styles.inputRow}>
            <Text style={styles.inputLabel}>Qur'an (Minuten)</Text>
            <TextInput
              style={styles.input}
              value={quranGoal}
              onChangeText={setQuranGoal}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Notifications */}
        <Text style={styles.sectionLabel}>Benachrichtigungen</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Gebetserinnerungen</Text>
            <Switch
              value={prayerReminders}
              onValueChange={setPrayerReminders}
              trackColor={{ true: COLORS.greenMedium }}
            />
          </View>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Streak-Erinnerung (20:00)</Text>
            <Switch
              value={streakReminder}
              onValueChange={setStreakReminder}
              trackColor={{ true: COLORS.greenMedium }}
            />
          </View>
        </View>

        {/* Travel Mode */}
        <Text style={styles.sectionLabel}>Spezial-Modi</Text>
        <View style={styles.card}>
          <View style={styles.switchRow}>
            <View>
              <Text style={styles.switchLabel}>Reise-Modus</Text>
              <Text style={styles.switchDesc}>Nur 3 Gebete (Qasr), Streak bleibt</Text>
            </View>
            <Switch
              value={travelMode}
              onValueChange={setTravelMode}
              trackColor={{ true: COLORS.greenMedium }}
            />
          </View>
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleSave} activeOpacity={0.8}>
          <Text style={styles.saveBtnText}>Speichern</Text>
        </TouchableOpacity>

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
  sectionLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textLight,
    textTransform: 'uppercase',
    paddingHorizontal: 24,
    marginTop: 20,
    marginBottom: 8,
  },
  card: {
    marginHorizontal: 24,
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
    marginHorizontal: 24,
    marginTop: 24,
    padding: 18,
    backgroundColor: COLORS.greenDeep,
    borderRadius: RADIUS.md,
    alignItems: 'center',
    ...SHADOWS.md,
  },
  saveBtnText: { color: COLORS.white, fontSize: 16, fontWeight: '600' },
});
