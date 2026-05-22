import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from './theme';

type Tab = 'home' | 'streak' | 'lock' | 'profile' | 'settings';

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
}

const TABS: { key: Tab; icon: keyof typeof Ionicons.glyphMap; label: string }[] = [
  { key: 'home', icon: 'home-outline', label: 'Home' },
  { key: 'streak', icon: 'calendar-outline', label: 'Streak' },
  { key: 'lock', icon: 'lock-closed-outline', label: 'Lock' },
  { key: 'profile', icon: 'person-outline', label: 'Profil' },
  { key: 'settings', icon: 'settings-outline', label: 'Einst.' },
];

export function BottomNav({ active, onNavigate }: Props) {
  return (
    <View style={styles.nav}>
      {TABS.map((tab) => {
        const isCenter = tab.key === 'lock';
        const isActive = active === tab.key;

        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.item, isCenter && styles.center]}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={isActive && !isCenter ? (tab.icon.replace('-outline', '') as keyof typeof Ionicons.glyphMap) : tab.icon}
              size={isCenter ? 24 : 22}
              color={isCenter ? COLORS.white : isActive ? COLORS.greenDeep : COLORS.textLight}
            />
            {!isCenter && (
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingTop: 8,
    paddingBottom: 24,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(208,208,200,0.3)',
  },
  item: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  center: {
    backgroundColor: COLORS.greenDeep,
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -24,
    shadowColor: COLORS.greenDeep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 8,
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.greenDeep,
    fontWeight: '600',
  },
});
