import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { activateSubscription, restorePurchases } from '../services/subscriptionService';
import { COLORS } from '../components/theme';

interface Props {
  trialDaysLeft: number;
  onSubscribed: () => void;
  onClose?: () => void;
}

export function PaywallScreen({ trialDaysLeft, onSubscribed, onClose }: Props) {
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);

  const isTrialExpired = trialDaysLeft <= 0;

  const handleSubscribe = async () => {
    setIsLoading(true);
    try {
      // In production: trigger Apple/Google IAP purchase flow
      // For prototype: simulate purchase
      await activateSubscription(selectedPlan);
      onSubscribed();
    } catch (error) {
      Alert.alert('Fehler', 'Kauf konnte nicht abgeschlossen werden. Bitte versuche es erneut.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    setIsLoading(true);
    try {
      const restored = await restorePurchases();
      if (restored) {
        onSubscribed();
      } else {
        Alert.alert('Kein Abo gefunden', 'Es wurde kein aktives Abonnement gefunden.');
      }
    } catch (error) {
      Alert.alert('Fehler', 'Wiederherstellen fehlgeschlagen.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Close button (only during trial) */}
        {!isTrialExpired && onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🕌</Text>
          <Text style={styles.title}>Barakah Premium</Text>
          <Text style={styles.subtitle}>
            {isTrialExpired
              ? 'Deine kostenlose Testphase ist abgelaufen.\nAbonniere, um weiterzumachen.'
              : `Noch ${trialDaysLeft} Tag${trialDaysLeft !== 1 ? 'e' : ''} kostenlos testen`}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Alles inklusive:</Text>
          {[
            { icon: '🕋', text: 'Alle 5 Gebete tracken' },
            { icon: '📖', text: 'Qur\'an & Dhikr Erinnerungen' },
            { icon: '🔒', text: 'App-Sperre bis Aufgaben erledigt' },
            { icon: '🔔', text: 'Push-Benachrichtigungen' },
            { icon: '🔥', text: 'Streak-System & Meilensteine' },
            { icon: '📊', text: 'Statistiken & Kalender' },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
              <Text style={styles.featureCheck}>✓</Text>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        <View style={styles.plans}>
          {/* Yearly - Best Value */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'yearly' && styles.planSelected]}
            onPress={() => setSelectedPlan('yearly')}
            activeOpacity={0.8}
          >
            <View style={styles.planBadge}>
              <Text style={styles.planBadgeText}>Spare 67%</Text>
            </View>
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedPlan === 'yearly' && styles.radioOuterActive]}>
                {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Jährlich</Text>
              <Text style={styles.planPrice}>19,90 € / Jahr</Text>
              <Text style={styles.planSub}>= 1,66 € pro Monat</Text>
            </View>
          </TouchableOpacity>

          {/* Monthly */}
          <TouchableOpacity
            style={[styles.planCard, selectedPlan === 'monthly' && styles.planSelected]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planRadio}>
              <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioOuterActive]}>
                {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
              </View>
            </View>
            <View style={styles.planInfo}>
              <Text style={styles.planName}>Monatlich</Text>
              <Text style={styles.planPrice}>4,99 € / Monat</Text>
              <Text style={styles.planSub}>Jederzeit kündbar</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* CTA Button */}
        <TouchableOpacity
          style={[styles.ctaBtn, isLoading && styles.ctaDisabled]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.ctaText}>
              {isTrialExpired
                ? `Jetzt abonnieren – ${selectedPlan === 'yearly' ? '19,90 €/Jahr' : '4,99 €/Monat'}`
                : '3 Tage kostenlos starten'}
            </Text>
          )}
        </TouchableOpacity>

        {/* Trial info */}
        {!isTrialExpired && (
          <Text style={styles.trialInfo}>
            3 Tage kostenlos, dann {selectedPlan === 'yearly' ? '19,90 €/Jahr' : '4,99 €/Monat'}.{'\n'}
            Jederzeit vor Ablauf der Testphase kündbar.
          </Text>
        )}

        {/* Restore */}
        <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore} disabled={isLoading}>
          <Text style={styles.restoreText}>Käufe wiederherstellen</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legal}>
          Das Abonnement verlängert sich automatisch, sofern es nicht mindestens 24 Stunden vor Ende der aktuellen Laufzeit gekündigt wird. Die Zahlung wird über dein Apple-ID-Konto abgewickelt.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  scroll: {
    padding: 24,
    paddingBottom: 40,
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.creamDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  closeText: {
    fontSize: 18,
    color: COLORS.textMedium,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  headerEmoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.greenDeep,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: COLORS.textMedium,
    textAlign: 'center',
    lineHeight: 22,
  },
  features: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '650',
    color: COLORS.textDark,
    marginBottom: 14,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    gap: 12,
  },
  featureIcon: {
    fontSize: 18,
    width: 28,
  },
  featureText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.textDark,
    fontWeight: '500',
  },
  featureCheck: {
    fontSize: 16,
    color: COLORS.greenMedium,
    fontWeight: '700',
  },
  plans: {
    gap: 12,
    marginBottom: 20,
  },
  planCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: COLORS.creamDarker,
    position: 'relative',
    overflow: 'hidden',
  },
  planSelected: {
    borderColor: COLORS.greenDeep,
    backgroundColor: '#f0fafa',
  },
  planBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: COLORS.gold,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderBottomLeftRadius: 10,
  },
  planBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.white,
  },
  planRadio: {
    marginRight: 14,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: COLORS.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActive: {
    borderColor: COLORS.greenDeep,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.greenDeep,
  },
  planInfo: {
    flex: 1,
  },
  planName: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.textDark,
  },
  planPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.greenDeep,
    marginTop: 2,
  },
  planSub: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
  ctaBtn: {
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
    marginBottom: 12,
  },
  ctaDisabled: {
    opacity: 0.7,
  },
  ctaText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
  trialInfo: {
    textAlign: 'center',
    fontSize: 12,
    color: COLORS.textLight,
    lineHeight: 18,
    marginBottom: 16,
  },
  restoreBtn: {
    alignItems: 'center',
    padding: 10,
    marginBottom: 16,
  },
  restoreText: {
    fontSize: 14,
    color: COLORS.greenMedium,
    fontWeight: '500',
  },
  legal: {
    fontSize: 10,
    color: COLORS.textLight,
    textAlign: 'center',
    lineHeight: 16,
  },
});
