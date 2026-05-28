import React, { useState, useEffect } from 'react';
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
import { PurchasesPackage } from 'react-native-purchases';
import { useTranslation } from 'react-i18next';
import {
  getOfferings,
  purchasePackage,
  restorePurchases,
} from '../services/subscriptionService';
import { COLORS } from '../components/theme';

interface Props {
  onSubscribed: () => void;
  onClose?: () => void;
}

export function PaywallScreen({ onSubscribed, onClose }: Props) {
  const { t } = useTranslation();
  const [selectedPlan, setSelectedPlan] = useState<'yearly' | 'monthly'>('yearly');
  const [isLoading, setIsLoading] = useState(false);
  const [packages, setPackages] = useState<{
    monthly: PurchasesPackage | null;
    yearly: PurchasesPackage | null;
  }>({ monthly: null, yearly: null });
  const [loadingPackages, setLoadingPackages] = useState(true);

  useEffect(() => {
    loadOfferings();
  }, []);

  const loadOfferings = async () => {
    try {
      const offerings = await getOfferings();
      setPackages(offerings);
    } catch (error) {
      console.error('Failed to load offerings:', error);
    } finally {
      setLoadingPackages(false);
    }
  };

  const handleSubscribe = async () => {
    const pkg = selectedPlan === 'yearly' ? packages.yearly : packages.monthly;
    if (!pkg) {
      Alert.alert(t('paywall.errorTitle'), t('paywall.errorUnavailable'));
      return;
    }

    setIsLoading(true);
    try {
      const result = await purchasePackage(pkg);
      if (result.success) {
        onSubscribed();
      }
    } catch (error) {
      Alert.alert(t('paywall.errorTitle'), t('paywall.errorPurchase'));
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
        Alert.alert(t('paywall.noSubTitle'), t('paywall.noSubMessage'));
      }
    } catch (error) {
      Alert.alert(t('paywall.errorTitle'), t('paywall.errorRestore'));
    } finally {
      setIsLoading(false);
    }
  };

  // Get display prices from RevenueCat (localized for user's region)
  const monthlyPrice = packages.monthly?.product?.priceString || '4,99 €';
  const yearlyPrice = packages.yearly?.product?.priceString || '39,99 €';
  const trialInfo = selectedPlan === 'yearly'
    ? t('paywall.trialInfoYearly', { price: yearlyPrice })
    : t('paywall.trialInfoMonthly', { price: monthlyPrice });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Close button (only if allowed) */}
        {onClose && (
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
        )}

        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerEmoji}>🕌</Text>
          <Text style={styles.title}>{t('paywall.title')}</Text>
          <Text style={styles.subtitle}>
            {t('paywall.subtitle')}
          </Text>
        </View>

        {/* Features */}
        <View style={styles.features}>
          <Text style={styles.featuresTitle}>{t('paywall.featuresTitle')}</Text>
          {[
            { icon: '🕋', text: t('paywall.feat1') },
            { icon: '📖', text: t('paywall.feat2') },
            { icon: '🔒', text: t('paywall.feat3') },
            { icon: '🕌', text: t('paywall.feat4') },
            { icon: '🔥', text: t('paywall.feat5') },
            { icon: '📊', text: t('paywall.feat6') },
          ].map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
              <Text style={styles.featureText}>{f.text}</Text>
              <Text style={styles.featureCheck}>✓</Text>
            </View>
          ))}
        </View>

        {/* Plan Selection */}
        {loadingPackages ? (
          <ActivityIndicator color={COLORS.greenDeep} style={{ marginVertical: 20 }} />
        ) : (
          <View style={styles.plans}>
            {/* Yearly */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'yearly' && styles.planSelected]}
              onPress={() => setSelectedPlan('yearly')}
              activeOpacity={0.8}
            >
              <View style={styles.planBadge}>
                <Text style={styles.planBadgeText}>{t('paywall.saveBadge')}</Text>
              </View>
              <View style={styles.planRadio}>
                <View style={[styles.radioOuter, selectedPlan === 'yearly' && styles.radioActive]}>
                  {selectedPlan === 'yearly' && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{t('paywall.yearly')}</Text>
                <Text style={styles.planPrice}>{t('paywall.perYear', { price: yearlyPrice })}</Text>
                <Text style={styles.planSub}>{t('paywall.yearlySub')}</Text>
              </View>
            </TouchableOpacity>

            {/* Monthly */}
            <TouchableOpacity
              style={[styles.planCard, selectedPlan === 'monthly' && styles.planSelected]}
              onPress={() => setSelectedPlan('monthly')}
              activeOpacity={0.8}
            >
              <View style={styles.planRadio}>
                <View style={[styles.radioOuter, selectedPlan === 'monthly' && styles.radioActive]}>
                  {selectedPlan === 'monthly' && <View style={styles.radioInner} />}
                </View>
              </View>
              <View style={styles.planInfo}>
                <Text style={styles.planName}>{t('paywall.monthly')}</Text>
                <Text style={styles.planPrice}>{t('paywall.perMonth', { price: monthlyPrice })}</Text>
                <Text style={styles.planSub}>{t('paywall.monthlySub')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaBtn, isLoading && styles.ctaDisabled]}
          onPress={handleSubscribe}
          activeOpacity={0.8}
          disabled={isLoading || loadingPackages}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.ctaText}>{t('paywall.cta')}</Text>
          )}
        </TouchableOpacity>

        <Text style={styles.trialInfo}>
          {trialInfo}
        </Text>

        {/* Restore */}
        <TouchableOpacity style={styles.restoreBtn} onPress={handleRestore} disabled={isLoading}>
          <Text style={styles.restoreText}>{t('paywall.restore')}</Text>
        </TouchableOpacity>

        {/* Legal */}
        <Text style={styles.legal}>
          {t('paywall.legal')}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.cream },
  scroll: { padding: 24, paddingBottom: 40 },
  closeBtn: {
    alignSelf: 'flex-end', width: 36, height: 36, borderRadius: 18,
    backgroundColor: COLORS.creamDark, alignItems: 'center', justifyContent: 'center', marginBottom: 8,
  },
  closeText: { fontSize: 18, color: COLORS.textMedium, fontWeight: '600' },
  header: { alignItems: 'center', marginBottom: 28 },
  headerEmoji: { fontSize: 56, marginBottom: 16 },
  title: { fontSize: 28, fontWeight: '800', color: COLORS.greenDeep, marginBottom: 8 },
  subtitle: { fontSize: 15, color: COLORS.textMedium, textAlign: 'center', lineHeight: 22 },
  features: {
    backgroundColor: COLORS.white, borderRadius: 16, padding: 20, marginBottom: 24,
    shadowColor: '#0d5a5a', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2,
  },
  featuresTitle: { fontSize: 16, fontWeight: '650', color: COLORS.textDark, marginBottom: 14 },
  featureRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, gap: 12 },
  featureIcon: { fontSize: 18, width: 28 },
  featureText: { flex: 1, fontSize: 14, color: COLORS.textDark, fontWeight: '500' },
  featureCheck: { fontSize: 16, color: COLORS.greenMedium, fontWeight: '700' },
  plans: { gap: 12, marginBottom: 20 },
  planCard: {
    flexDirection: 'row', alignItems: 'center', padding: 18,
    backgroundColor: COLORS.white, borderRadius: 16,
    borderWidth: 2, borderColor: COLORS.creamDarker,
    position: 'relative', overflow: 'hidden',
  },
  planSelected: { borderColor: COLORS.greenDeep, backgroundColor: '#f0fafa' },
  planBadge: {
    position: 'absolute', top: 0, right: 0,
    backgroundColor: COLORS.gold, paddingHorizontal: 12, paddingVertical: 4, borderBottomLeftRadius: 10,
  },
  planBadgeText: { fontSize: 11, fontWeight: '700', color: COLORS.white },
  planRadio: { marginRight: 14 },
  radioOuter: {
    width: 22, height: 22, borderRadius: 11,
    borderWidth: 2, borderColor: COLORS.sand,
    alignItems: 'center', justifyContent: 'center',
  },
  radioActive: { borderColor: COLORS.greenDeep },
  radioInner: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.greenDeep },
  planInfo: { flex: 1 },
  planName: { fontSize: 16, fontWeight: '700', color: COLORS.textDark },
  planPrice: { fontSize: 14, fontWeight: '600', color: COLORS.greenDeep, marginTop: 2 },
  planSub: { fontSize: 12, color: COLORS.textLight, marginTop: 2 },
  ctaBtn: {
    width: '100%', padding: 18, backgroundColor: COLORS.greenDeep, borderRadius: 20,
    alignItems: 'center', shadowColor: '#0d5a5a', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25, shadowRadius: 20, elevation: 6, marginBottom: 12,
  },
  ctaDisabled: { opacity: 0.7 },
  ctaText: { color: COLORS.white, fontSize: 16, fontWeight: '700' },
  trialInfo: { textAlign: 'center', fontSize: 12, color: COLORS.textLight, lineHeight: 18, marginBottom: 16 },
  restoreBtn: { alignItems: 'center', padding: 10, marginBottom: 16 },
  restoreText: { fontSize: 14, color: COLORS.greenMedium, fontWeight: '500' },
  legal: { fontSize: 10, color: COLORS.textLight, textAlign: 'center', lineHeight: 16 },
});
