import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useBarakahStore } from './src/store/useBarakahStore';
import { OnboardingScreen } from './src/screens/OnboardingScreen';
import { RootNavigator } from './src/navigation/RootNavigator';
import { requestNotificationPermissions } from './src/utils/notificationManager';
import { COLORS } from './src/components/theme';

SplashScreen.preventAutoHideAsync();

const ONBOARDING_KEY = 'hasSeenOnboarding';

export default function App() {
  const [appReady, setAppReady] = useState(false);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<boolean | null>(null);
  const { isLoading, initialize } = useBarakahStore();

  useEffect(() => {
    async function prepare() {
      try {
        await Font.loadAsync({
          Inter: require('./assets/fonts/Inter.ttf'),
        }).catch(() => {});

        const seen = await AsyncStorage.getItem(ONBOARDING_KEY);
        setHasSeenOnboarding(seen === 'true');

        await initialize();
        await requestNotificationPermissions();
      } catch (e) {
        console.error('App prepare error:', e);
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

  if (hasSeenOnboarding === false) {
    return (
      <View style={styles.full} onLayout={onLayoutRootView}>
        <OnboardingScreen
          onComplete={async () => {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            setHasSeenOnboarding(true);
          }}
        />
        <StatusBar style="dark" />
      </View>
    );
  }

  return (
    <View style={styles.full} onLayout={onLayoutRootView}>
      <RootNavigator />
      <StatusBar style="dark" />
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
