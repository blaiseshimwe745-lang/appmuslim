import { Timestamp } from 'firebase/firestore';

export interface NotificationPreferences {
  prayerReminders: boolean;
  streakReminder: boolean;
  reminderMinutes: number;
  dhikrReminder: boolean;
}

export interface User {
  userId: string;
  email: string | null;
  displayName: string;
  avatarEmoji: string;
  createdAt: Timestamp;
  timezone: string;
  calculationMethod: number;
  city: string;
  country: string;
  longitude: number;
  latitude: number;
  notificationPreferences: NotificationPreferences;
  streak: number;
  longestStreak: number;
  totalDaysCompleted: number;
  totalHoursSaved: number;
  rank: number;
  dailyGoalQuranMinutes: number;
  dailyGoalDhikrSubhanallah: number;
  dailyGoalDhikrAlhamdulillah: number;
  dailyGoalDhikrAllahuakbar: number;
  travelMode?: boolean;
  travelModeEndDate?: string;
  sicknessMode?: boolean;
  sicknessModeEndDate?: string;
}

export interface Prayers {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}

export interface Dhikr {
  subhanallah: number;
  alhamdulillah: number;
  allahuakbar: number;
}

export interface UnlockHistoryEntry {
  appName: string;
  unlockedAt: Timestamp;
  lockedAt: Timestamp;
}

export interface DailyLog {
  id: string;
  userId: string;
  date: string;
  prayers: Prayers;
  quranMinutes: number;
  quranCompleted: boolean;
  dhikr: Dhikr;
  dhikrCompleted: boolean;
  wuduComplete: boolean;
  allTasksDone: boolean;
  streakContinued: boolean;
  unlockedApps: string[];
  unlockHistory: UnlockHistoryEntry[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface BlockedApp {
  id: string;
  userId: string;
  packageName: string;
  appName: string;
  emoji: string;
  isActive: boolean;
  dailyUnlockMinutes: number;
  todayUnlockedMinutes: number;
  lastUnlockDate: string;
}

export type MilestoneType =
  | '7_days'
  | '30_days'
  | '100_days'
  | '365_days'
  | 'first_perfect_week'
  | 'first_prayer';

export interface Milestone {
  id: string;
  userId: string;
  type: MilestoneType;
  label: string;
  emoji: string;
  targetDays: number;
  progress: number;
  isAchieved: boolean;
  achievedAt: Timestamp | null;
  celebrated: boolean;
}

export interface PrayerTimings {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export interface PrayerTimesCache {
  userId: string;
  date: string;
  timings: PrayerTimings;
  fetchedAt: Timestamp;
  city: string;
  method: number;
}

export interface NextPrayer {
  name: string;
  time: string;
  minutesUntil: number;
}

export type PrayerName = 'fajr' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export const PRAYER_ORDER: PrayerName[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

export const PRAYER_DISPLAY: Record<PrayerName, string> = {
  fajr: 'Fajr',
  dhuhr: 'Dhuhr',
  asr: 'Asr',
  maghrib: 'Maghrib',
  isha: 'Isha',
};

export const DEFAULT_USER: Partial<User> = {
  avatarEmoji: 'A',
  timezone: 'Europe/Berlin',
  calculationMethod: 3,
  city: 'Berlin',
  country: 'Germany',
  streak: 0,
  longestStreak: 0,
  totalDaysCompleted: 0,
  totalHoursSaved: 0,
  rank: 0,
  dailyGoalQuranMinutes: 5,
  dailyGoalDhikrSubhanallah: 33,
  dailyGoalDhikrAlhamdulillah: 33,
  dailyGoalDhikrAllahuakbar: 34,
  notificationPreferences: {
    prayerReminders: true,
    streakReminder: true,
    reminderMinutes: 15,
    dhikrReminder: false,
  },
};

export const DEFAULT_DAILY_LOG: Omit<DailyLog, 'id' | 'userId' | 'date' | 'createdAt' | 'updatedAt'> = {
  prayers: { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false },
  quranMinutes: 0,
  quranCompleted: false,
  dhikr: { subhanallah: 0, alhamdulillah: 0, allahuakbar: 0 },
  dhikrCompleted: false,
  wuduComplete: false,
  allTasksDone: false,
  streakContinued: false,
  unlockedApps: [],
  unlockHistory: [],
};

export const DEFAULT_BLOCKED_APPS: Omit<BlockedApp, 'id' | 'userId'>[] = [
  { packageName: 'com.instagram.android', appName: 'Instagram', emoji: '📸', isActive: true, dailyUnlockMinutes: 30, todayUnlockedMinutes: 0, lastUnlockDate: '' },
  { packageName: 'com.zhiliaoapp.musically', appName: 'TikTok', emoji: '🎵', isActive: true, dailyUnlockMinutes: 30, todayUnlockedMinutes: 0, lastUnlockDate: '' },
  { packageName: 'com.google.android.youtube', appName: 'YouTube', emoji: '▶️', isActive: true, dailyUnlockMinutes: 30, todayUnlockedMinutes: 0, lastUnlockDate: '' },
  { packageName: 'com.whatsapp', appName: 'WhatsApp', emoji: '💬', isActive: true, dailyUnlockMinutes: 60, todayUnlockedMinutes: 0, lastUnlockDate: '' },
];

export const MILESTONES_CONFIG: { type: MilestoneType; label: string; emoji: string; targetDays: number }[] = [
  { type: '7_days', label: '7 Tage Streak', emoji: '🥉', targetDays: 7 },
  { type: '30_days', label: '30 Tage Streak', emoji: '🥈', targetDays: 30 },
  { type: '100_days', label: '100 Tage Streak', emoji: '🥇', targetDays: 100 },
  { type: '365_days', label: '1 Jahr Barakah', emoji: '👑', targetDays: 365 },
];
