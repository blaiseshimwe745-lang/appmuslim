import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { requestNotificationPermissions } from '../utils/notificationManager';
import { COLORS } from '../components/theme';

interface Props {
  onComplete: () => void;
}

export function NotificationConsentScreen({ onComplete }: Props) {
  const handleAllow = async () => {
    await requestNotificationPermissions();
    onComplete();
  };

  const handleSkip = () => {
    onComplete();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconCircle}>
          <Text style={styles.bellIcon}>🔔</Text>
        </View>

        <Text style={styles.title}>Bleib auf dem Weg</Text>
        <Text style={styles.subtitle}>
          Erhalte Erinnerungen für deine Gebete, Streak-Checks und wenn du deine Aufgaben noch nicht erledigt hast.
        </Text>

        <View style={styles.features}>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🕌</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Gebetszeiten</Text>
              <Text style={styles.featureDesc}>Erinnerung vor jedem Gebet</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔥</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Streak-Schutz</Text>
              <Text style={styles.featureDesc}>Abends erinnert, bevor der Streak bricht</Text>
            </View>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>📖</Text>
            <View style={styles.featureText}>
              <Text style={styles.featureTitle}>Qur'an & Dhikr</Text>
              <Text style={styles.featureDesc}>Sanfte Erinnerung an deine Ibadaat</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttons}>
          <TouchableOpacity style={styles.allowBtn} onPress={handleAllow} activeOpacity={0.8}>
            <Text style={styles.allowText}>Benachrichtigungen erlauben</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipBtn} onPress={handleSkip} activeOpacity={0.7}>
            <Text style={styles.skipText}>Vielleicht später</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.greenPastel,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
  },
  bellIcon: {
    fontSize: 56,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.greenDeep,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
    marginBottom: 32,
  },
  features: {
    width: '100%',
    gap: 12,
    marginBottom: 40,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: COLORS.white,
    padding: 16,
    borderRadius: 14,
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  featureDesc: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  buttons: {
    width: '100%',
    gap: 12,
  },
  allowBtn: {
    width: '100%',
    padding: 18,
    backgroundColor: COLORS.greenDeep,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 6,
  },
  allowText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  skipBtn: {
    padding: 12,
    alignItems: 'center',
  },
  skipText: {
    color: COLORS.textLight,
    fontSize: 14,
    fontWeight: '500',
  },
});
