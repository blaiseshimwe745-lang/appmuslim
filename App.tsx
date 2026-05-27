import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBarakahStore } from './src/store/useBarakahStore';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { NotificationConsentScreen } from './src/screens/NotificationConsentScreen';
import { PaywallScreen } from './src/screens/PaywallScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  initializePurchases,
  getSubscriptionStatus,
  SubscriptionStatus,
} from './src/services/subscriptionService';
import { COLORS } from './src/components/theme';
import { maybeRequestReview } from './src/utils/reviewPrompt';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = 'hasSeenOnboarding';
const NOTIFICATION_CONSENT_KEY = 'hasSeenNotificationConsent';

type AppScreen = 'loading' | 'onboarding' | 'notification_consent' | 'paywall' | 'main';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('loading');
  const [subscriptionStatus, setSubscriptionStatus] = useState<SubscriptionStatus | null>(null);
  const { isLoading, initialize } = useBarakahStore();

  useEffect(() => {
    async function prepare() {
      try {
        // Load fonts
        await Font.loadAsync({
          Inter: require('./assets/fonts/Inter.ttf'),
        }).catch(() => {});

        // Initialize RevenueCat
        await initializePurchases().catch(() => {});

        // Check what screen to show
        const hasSeenOnboarding = await AsyncStorage.getItem(ONBOARDING_KEY);
        const hasSeenNotification = await AsyncStorage.getItem(NOTIFICATION_CONSENT_KEY);
        const subStatus = await getSubscriptionStatus();
        setSubscriptionStatus(subStatus);

        // Initialize Firebase & store
        await initialize();

        // Determine first screen
        if (hasSeenOnboarding !== 'true') {
          setCurrentScreen('onboarding');
        } else if (hasSeenNotification !== 'true') {
          setCurrentScreen('notification_consent');
        } else if (!subStatus.isActive) {
          setCurrentScreen('paywall');
        } else {
          setCurrentScreen('main');
          maybeRequestReview(5000);
        }
      } catch (e) {
        console.error('App prepare error:', e);
        setCurrentScreen('main'); // Fallback to main on error
      } finally {
        setAppReady(true);
      }
    }
    prepare();
  }, []);

  const onLayoutRootView = useCallback(async () => {
    if (appReady) {
      await SplashScreen.hideAsync();
    }
  }, [appReady]);

  // Handle onboarding complete
  const handleOnboardingComplete = async () => {
    await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
    setCurrentScreen('notification_consent');
  };

  // Handle notification consent complete
  const handleNotificationConsentComplete = async () => {
    await AsyncStorage.setItem(NOTIFICATION_CONSENT_KEY, 'true');
    const subStatus = await getSubscriptionStatus();
    setSubscriptionStatus(subStatus);

    if (subStatus.isActive) {
      setCurrentScreen('main');
      maybeRequestReview(3000);
    } else {
      setCurrentScreen('paywall');
    }
  };

  // Handle subscription complete
  const handleSubscribed = async () => {
    const subStatus = await getSubscriptionStatus();
    setSubscriptionStatus(subStatus);
    setCurrentScreen('main');
    // Apple's native review popup ~4s after entering main
    maybeRequestReview(4000);
  };

  // Show splash while loading
  if (!appReady || isLoading) {
    return (
      <View style={styles.splash}>
        <Text style={styles.splashEmoji}>🕌</Text>
        <Text style={styles.splashTitle}>Barakah</Text>
        <Text style={styles.splashSub}>Digital Detox für Muslime</Text>
        <ActivityIndicator color={COLORS.gold} style={{ marginTop: 24 }} />
        <StatusBar style="light" />
      </View>
    );
  }

  return (
    <View style={styles.full} onLayout={onLayoutRootView}>
      {currentScreen === 'onboarding' && (
        <OnboardingScreen onComplete={handleOnboardingComplete} />
      )}

      {currentScreen === 'notification_consent' && (
        <NotificationConsentScreen onComplete={handleNotificationConsentComplete} />
      )}

      {currentScreen === 'paywall' && (
        <PaywallScreen
          onSubscribed={handleSubscribed}
          onClose={
            subscriptionStatus?.isTrial
              ? () => setCurrentScreen('main')
              : undefined
          }
        />
      )}

      {currentScreen === 'main' && <RootNavigator />}

      <StatusBar style={currentScreen === 'main' ? 'dark' : 'dark'} />
    </View>
  );
}

const styles = StyleSheet.create({
  full: { flex: 1 },
  splash: {
    flex: 1,
    backgroundColor: COLORS.greenDeep,
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashEmoji: { fontSize: 64, marginBottom: 16 },
  splashTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.gold,
    letterSpacing: 1,
  },
  splashSub: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    marginTop: 8,
  },
});
