import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { DashboardScreen } from '../screens/DashboardScreen';
import { AppsScreen } from '../screens/AppsScreen';
import { IchScreen } from '../screens/IchScreen';
import { BottomNav, Tab } from '../components/BottomNav';
import { useBarakahStore } from '../store/useBarakahStore';
import { COLORS } from '../components/theme';

export function RootNavigator() {
  const [activeTab, setActiveTab] = useState<Tab>('heute');
  const isLocked = useBarakahStore((s) => s.isLocked);

  const renderScreen = () => {
    switch (activeTab) {
      case 'heute':
        return <DashboardScreen />;
      case 'apps':
        return <AppsScreen />;
      case 'ich':
        return <IchScreen />;
      default:
        return <DashboardScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>{renderScreen()}</View>
      <BottomNav active={activeTab} onNavigate={setActiveTab} isLocked={isLocked} />
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
