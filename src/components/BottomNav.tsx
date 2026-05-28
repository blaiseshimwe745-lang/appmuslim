import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { COLORS } from './theme';

export type Tab = 'heute' | 'apps' | 'ich';

interface Props {
  active: Tab;
  onNavigate: (tab: Tab) => void;
  isLocked: boolean;
}

const TABS: { key: Tab; iconActive: keyof typeof Ionicons.glyphMap; iconInactive: keyof typeof Ionicons.glyphMap; labelKey: string }[] = [
  { key: 'heute', iconActive: 'checkmark-circle', iconInactive: 'checkmark-circle-outline', labelKey: 'nav.today' },
  { key: 'apps', iconActive: 'lock-closed', iconInactive: 'lock-closed-outline', labelKey: 'nav.apps' },
  { key: 'ich', iconActive: 'person', iconInactive: 'person-outline', labelKey: 'nav.me' },
];

export function BottomNav({ active, onNavigate, isLocked }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.nav}>
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        // Show unlocked icon for apps tab when unlocked
        let iconName = isActive ? tab.iconActive : tab.iconInactive;
        if (tab.key === 'apps' && !isLocked) {
          iconName = isActive ? 'lock-open' : 'lock-open-outline';
        }

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.item}
            onPress={() => onNavigate(tab.key)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={iconName}
              size={22}
              color={isActive ? COLORS.greenDeep : COLORS.textLight}
            />
            <Text style={[styles.label, isActive && styles.labelActive]}>
              {t(tab.labelKey)}
            </Text>
            {tab.key === 'apps' && isLocked && (
              <View style={styles.lockDot} />
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
    paddingTop: 10,
    paddingBottom: 28,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: 'rgba(208,208,200,0.3)',
  },
  item: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 6,
    paddingHorizontal: 20,
    position: 'relative',
  },
  label: {
    fontSize: 11,
    color: COLORS.textLight,
    fontWeight: '500',
  },
  labelActive: {
    color: COLORS.greenDeep,
    fontWeight: '600',
  },
  lockDot: {
    position: 'absolute',
    top: 4,
    right: 14,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: COLORS.red,
  },
});
