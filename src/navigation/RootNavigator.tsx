import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { StreakScreen } from '../screens/StreakScreen';
import { LockScreen } from '../screens/LockScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { BottomNav } from '../components/BottomNav';
import { COLORS } from '../components/theme';

type Tab = 'home' | 'streak' | 'lock' | 'profile' | 'settings';

export function RootNavigator() {
  const [activeTab, setActiveTab] = useState<Tab>('home');

  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return <DashboardScreen onNavigate={(tab) => setActiveTab(tab as Tab)} />;
      case 'streak':
        return <StreakScreen onBack={() => setActiveTab('home')} />;
      case 'lock':
        return <LockScreen onGoToDashboard={() => setActiveTab('home')} />;
      case 'profile':
        return <ProfileScreen onBack={() => setActiveTab('home')} />;
      case 'settings':
        return <SettingsScreen onBack={() => setActiveTab('home')} />;
      default:
        return <DashboardScreen onNavigate={(tab) => setActiveTab(tab as Tab)} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.cream,
  },
  content: {
    flex: 1,
  },
});
