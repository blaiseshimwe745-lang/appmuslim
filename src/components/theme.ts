export const COLORS = {
  greenDeep: '#0d5a5a',
  greenDark: '#0a4747',
  greenDarker: '#073a3a',
  greenMedium: '#148080',
  greenLight: '#2ab5b5',
  greenPastel: '#e0f7f7',
  greenPastel2: '#d0f0f0',
  gold: '#d4a843',
  goldDark: '#b8922e',
  goldLight: '#f5e6b8',
  goldPale: '#fdf6e3',
  cream: '#faf8f0',
  creamDark: '#f0ece0',
  creamDarker: '#e8e0cc',
  sand: '#d8d0bc',
  textDark: '#1a2a2a',
  textMedium: '#4a5a5a',
  textLight: '#8a9a9a',
  textMuted: '#b0baba',
  white: '#ffffff',
  red: '#d44444',
  redLight: '#fde8e8',
};

export const SHADOWS = {
  sm: {
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  md: {
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.10,
    shadowRadius: 32,
    elevation: 5,
  },
  lg: {
    shadowColor: '#0d5a5a',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.14,
    shadowRadius: 60,
    elevation: 10,
  },
} as const;

export const RADIUS = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
};

export const FONTS = {
  sans: 'Inter',
  arabic: 'Amiri',
};
