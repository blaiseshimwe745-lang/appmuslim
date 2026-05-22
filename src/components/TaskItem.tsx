import React from 'react';
import { TouchableOpacity, View, Text, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { COLORS, SHADOWS, RADIUS } from './theme';

interface Props {
  emoji: string;
  title: string;
  subtitle: string;
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function TaskItem({ emoji, title, subtitle, checked, onToggle, disabled }: Props) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = () => {
    if (disabled) return;
    scale.value = withSpring(0.95, {}, () => {
      scale.value = withSpring(1);
    });
    onToggle();
  };

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.item, disabled && styles.disabled]}
        onPress={handlePress}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={[styles.checkbox, checked && styles.checked]}>
          {checked && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.emoji}>{emoji}</Text>
        <View style={styles.textWrap}>
          <Text style={[styles.title, checked && styles.titleChecked]}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: 14,
    paddingHorizontal: 16,
    backgroundColor: COLORS.white,
    borderRadius: RADIUS.sm,
    ...SHADOWS.sm,
  },
  disabled: { opacity: 0.6 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 7,
    borderWidth: 2,
    borderColor: COLORS.sand,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checked: {
    backgroundColor: COLORS.greenDeep,
    borderColor: COLORS.greenDeep,
  },
  checkmark: {
    fontSize: 12,
    color: COLORS.white,
    fontWeight: '600',
  },
  emoji: { fontSize: 18 },
  textWrap: { flex: 1 },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textDark,
  },
  titleChecked: {
    textDecorationLine: 'line-through',
    color: COLORS.textLight,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textLight,
    marginTop: 2,
  },
});
