import { create } from 'zustand';
import { signInAnonymously } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';
import * as Haptics from 'expo-haptics';
import { auth } from '../services/firebase';
import {
  getUser,
  createUser,
  updateUser,
  getOrCreateDailyLog,
  updateDailyLog,
  getDailyLog,
  getBlockedApps,
  initDefaultBlockedApps,
  updateBlockedApp,
  getMilestones,
  initDefaultMilestones,
  checkAndUpdateMilestones,
  getMonthLogs,
  getCachedPrayerTimes,
  cachePrayerTimes,
} from '../services/firestoreService';
import { fetchPrayerTimesByCity } from '../services/apiService';
import {
  User,
  DailyLog,
  BlockedApp,
  Milestone,
  PrayerTimings,
  NextPrayer,
  PrayerName,
  DEFAULT_DAILY_LOG,
} from '../types';
import { getToday, getYesterday, formatDateForApi, isFriday } from '../utils/dateHelpers';
import { getNextPrayer, isIshaTimePassed } from '../utils/prayerCalculator';
import {
  sendMilestoneNotification,
  sendTasksCompleteNotification,
  schedulePrayerReminders,
  scheduleStreakReminder,
} from '../utils/notificationManager';

interface BarakahState {
  user: User | null;
  isLoading: boolean;
  dailyLog: DailyLog | null;
  todayDate: string;
  streak: number;
  longestStreak: number;
  hoursSaved: number;
  successRate: number;
  prayerTimes: PrayerTimings | null;
  nextPrayer: NextPrayer | null;
  blockedApps: BlockedApp[];
  isLocked: boolean;
  milestones: Milestone[];
  calendarMonth: number;
  calendarYear: number;
  monthLogs: DailyLog[];
  showConfetti: boolean;

  // Actions
  initialize: () => Promise<void>;
  togglePrayer: (prayer: PrayerName) => Promise<void>;
  updateQuranMinutes: (minutes: number) => Promise<void>;
  incrementDhikr: (type: 'subhanallah' | 'alhamdulillah' | 'allahuakbar') => Promise<void>;
  completeDhikr: () => Promise<void>;
  toggleWudu: () => Promise<void>;
  unlockApps: () => Promise<void>;
  fetchPrayerTimes: () => Promise<void>;
  refreshNextPrayer: () => void;
  fetchMonthLogs: (month: number, year: number) => Promise<void>;
  checkStreak: () => Promise<void>;
  resetDay: () => Promise<void>;
  setShowConfetti: (v: boolean) => void;
}

export const useBarakahStore = create<BarakahState>((set, get) => ({
  user: null,
  isLoading: true,
  dailyLog: null,
  todayDate: getToday(),
  streak: 0,
  longestStreak: 0,
  hoursSaved: 0,
  successRate: 0,
  prayerTimes: null,
  nextPrayer: null,
  blockedApps: [],
  isLocked: true,
  milestones: [],
  calendarMonth: new Date().getMonth() + 1,
  calendarYear: new Date().getFullYear(),
  monthLogs: [],
  showConfetti: false,

  initialize: async () => {
    try {
      let firebaseUser = auth.currentUser;
      if (!firebaseUser) {
        const cred = await signInAnonymously(auth);
        firebaseUser = cred.user;
      }

      const userId = firebaseUser.uid;
      let user = await getUser(userId);
      if (!user) {
        user = await createUser(userId, firebaseUser.email, firebaseUser.displayName || 'Benutzer');
        await initDefaultBlockedApps(userId);
        await initDefaultMilestones(userId);
      }

      const today = getToday();
      const dailyLog = await getOrCreateDailyLog(userId, today);

      // Friday auto-check
      if (isFriday(new Date()) && !dailyLog.prayers.dhuhr) {
        dailyLog.prayers.dhuhr = true;
        await updateDailyLog(userId, today, { prayers: dailyLog.prayers });
      }

      const blockedApps = await getBlockedApps(userId);
      const milestones = await getMilestones(userId);
      const isLocked = !dailyLog.allTasksDone;

      const daysSinceStart = Math.max(
        1,
        Math.floor((Date.now() - user.createdAt.toMillis()) / (1000 * 60 * 60 * 24))
      );
      const successRate = user.totalDaysCompleted > 0
        ? Math.round((user.totalDaysCompleted / daysSinceStart) * 100)
        : 0;

      set({
        user,
        dailyLog,
        todayDate: today,
        streak: user.streak,
        longestStreak: user.longestStreak,
        hoursSaved: user.totalHoursSaved,
        successRate,
        blockedApps,
        milestones,
        isLocked,
        isLoading: false,
      });

      // Fetch prayer times after initial render
      get().fetchPrayerTimes();
      get().fetchMonthLogs(new Date().getMonth() + 1, new Date().getFullYear());
    } catch (error) {
      console.error('Init error:', error);
      set({ isLoading: false });
    }
  },

  togglePrayer: async (prayer: PrayerName) => {
    const { user, dailyLog, todayDate } = get();
    if (!user || !dailyLog) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newPrayers = { ...dailyLog.prayers, [prayer]: !dailyLog.prayers[prayer] };
    const prayersDone = newPrayers.fajr && newPrayers.dhuhr && newPrayers.asr && newPrayers.maghrib && newPrayers.isha;
    const allTasksDone = prayersDone && dailyLog.quranCompleted && dailyLog.dhikrCompleted;

    const updated: Partial<DailyLog> = { prayers: newPrayers, allTasksDone };
    set({
      dailyLog: { ...dailyLog, ...updated },
      isLocked: !allTasksDone,
    });

    await updateDailyLog(user.userId, todayDate, updated);

    if (allTasksDone && !dailyLog.allTasksDone) get().unlockApps();
  },

  updateQuranMinutes: async (minutes: number) => {
    const { user, dailyLog, todayDate } = get();
    if (!user || !dailyLog) return;

    const quranCompleted = minutes >= user.dailyGoalQuranMinutes;
    const prayersDone = dailyLog.prayers.fajr && dailyLog.prayers.dhuhr && dailyLog.prayers.asr && dailyLog.prayers.maghrib && dailyLog.prayers.isha;
    const allTasksDone = prayersDone && quranCompleted && dailyLog.dhikrCompleted;

    const updated: Partial<DailyLog> = { quranMinutes: minutes, quranCompleted, allTasksDone };
    set({
      dailyLog: { ...dailyLog, ...updated },
      isLocked: !allTasksDone,
    });

    await updateDailyLog(user.userId, todayDate, updated);
    if (allTasksDone && !dailyLog.allTasksDone) get().unlockApps();
  },

  incrementDhikr: async (type) => {
    const { user, dailyLog, todayDate } = get();
    if (!user || !dailyLog) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const newDhikr = { ...dailyLog.dhikr, [type]: dailyLog.dhikr[type] + 1 };
    const dhikrCompleted =
      newDhikr.subhanallah >= user.dailyGoalDhikrSubhanallah &&
      newDhikr.alhamdulillah >= user.dailyGoalDhikrAlhamdulillah &&
      newDhikr.allahuakbar >= user.dailyGoalDhikrAllahuakbar;

    const prayersDone = dailyLog.prayers.fajr && dailyLog.prayers.dhuhr && dailyLog.prayers.asr && dailyLog.prayers.maghrib && dailyLog.prayers.isha;
    const allTasksDone = prayersDone && dailyLog.quranCompleted && dhikrCompleted;

    const updated: Partial<DailyLog> = { dhikr: newDhikr, dhikrCompleted, allTasksDone };
    set({
      dailyLog: { ...dailyLog, ...updated },
      isLocked: !allTasksDone,
    });

    await updateDailyLog(user.userId, todayDate, updated);
    if (allTasksDone && !dailyLog.allTasksDone) get().unlockApps();
  },

  completeDhikr: async () => {
    const { user, dailyLog, todayDate } = get();
    if (!user || !dailyLog || dailyLog.dhikrCompleted) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    const newDhikr = {
      subhanallah: user.dailyGoalDhikrSubhanallah,
      alhamdulillah: user.dailyGoalDhikrAlhamdulillah,
      allahuakbar: user.dailyGoalDhikrAllahuakbar,
    };
    const prayersDone = dailyLog.prayers.fajr && dailyLog.prayers.dhuhr && dailyLog.prayers.asr && dailyLog.prayers.maghrib && dailyLog.prayers.isha;
    const allTasksDone = prayersDone && dailyLog.quranCompleted;

    const updated: Partial<DailyLog> = { dhikr: newDhikr, dhikrCompleted: true, allTasksDone };
    set({
      dailyLog: { ...dailyLog, ...updated },
      isLocked: !allTasksDone,
    });

    await updateDailyLog(user.userId, todayDate, updated);
    if (allTasksDone && !dailyLog.allTasksDone) get().unlockApps();
  },

  toggleWudu: async () => {
    const { user, dailyLog, todayDate } = get();
    if (!user || !dailyLog) return;

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const wuduComplete = !dailyLog.wuduComplete;
    const updated: Partial<DailyLog> = { wuduComplete };
    set({ dailyLog: { ...dailyLog, ...updated } });

    await updateDailyLog(user.userId, todayDate, updated);
  },

  unlockApps: async () => {
    const { user, dailyLog, todayDate, streak } = get();
    if (!user || !dailyLog) return;

    // Guard: Streak darf pro Tag nur EINMAL hochgezählt werden
    if (dailyLog.streakContinued) {
      set({ isLocked: false });
      return;
    }

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newStreak = streak + 1;
    const newLongest = Math.max(newStreak, get().longestStreak);
    const newTotal = user.totalDaysCompleted + 1;
    const newHours = newTotal * 2;

    set({
      isLocked: false,
      streak: newStreak,
      longestStreak: newLongest,
      hoursSaved: newHours,
      showConfetti: true,
      dailyLog: { ...dailyLog, allTasksDone: true, streakContinued: true },
    });

    await updateDailyLog(user.userId, todayDate, {
      allTasksDone: true,
      streakContinued: true,
    });

    await updateUser(user.userId, {
      streak: newStreak,
      longestStreak: newLongest,
      totalDaysCompleted: newTotal,
      totalHoursSaved: newHours,
    });

    set({ user: { ...user, streak: newStreak, longestStreak: newLongest, totalDaysCompleted: newTotal, totalHoursSaved: newHours } });

    sendTasksCompleteNotification();

    const milestone = await checkAndUpdateMilestones(user.userId, newStreak);
    if (milestone) {
      sendMilestoneNotification(milestone.type);
      const updatedMilestones = await getMilestones(user.userId);
      set({ milestones: updatedMilestones });
    }

    scheduleStreakReminder(newStreak);
  },

  fetchPrayerTimes: async () => {
    const { user, todayDate } = get();
    if (!user) return;

    try {
      let timings = await getCachedPrayerTimes(user.userId, todayDate);

      if (!timings) {
        timings = await fetchPrayerTimesByCity(
          formatDateForApi(new Date()),
          user.city,
          user.country,
          user.calculationMethod
        );
        await cachePrayerTimes(user.userId, todayDate, timings, user.city, user.calculationMethod);
      }

      const next = getNextPrayer(timings);
      set({ prayerTimes: timings, nextPrayer: next });

      if (user.notificationPreferences.prayerReminders) {
        schedulePrayerReminders(timings, user.notificationPreferences.reminderMinutes);
      }
    } catch (error) {
      console.error('Prayer times fetch error:', error);
    }
  },

  refreshNextPrayer: () => {
    const { prayerTimes } = get();
    if (!prayerTimes) return;
    set({ nextPrayer: getNextPrayer(prayerTimes) });
  },

  fetchMonthLogs: async (month: number, year: number) => {
    const { user } = get();
    if (!user) return;

    const logs = await getMonthLogs(user.userId, year, month);
    set({ monthLogs: logs, calendarMonth: month, calendarYear: year });
  },

  checkStreak: async () => {
    const { user, todayDate } = get();
    if (!user) return;

    const yesterday = getYesterday();
    const yesterdayLog = await getDailyLog(user.userId, yesterday);
    const todayLog = await getDailyLog(user.userId, todayDate);

    let currentStreak = user.streak;

    if (yesterdayLog && !yesterdayLog.allTasksDone) {
      const { prayerTimes } = get();
      if (prayerTimes && isIshaTimePassed(prayerTimes)) {
        currentStreak = 0;
      }
    } else if (!yesterdayLog) {
      if (todayLog?.allTasksDone) {
        currentStreak = 1;
      } else {
        currentStreak = 0;
      }
    }

    if (currentStreak !== user.streak) {
      await updateUser(user.userId, {
        streak: currentStreak,
        longestStreak: Math.max(currentStreak, user.longestStreak),
      });
      set({
        streak: currentStreak,
        longestStreak: Math.max(currentStreak, user.longestStreak),
        user: { ...user, streak: currentStreak },
      });
    }
  },

  resetDay: async () => {
    const { user } = get();
    if (!user) return;

    const today = getToday();
    const dailyLog = await getOrCreateDailyLog(user.userId, today);

    if (isFriday(new Date()) && !dailyLog.prayers.dhuhr) {
      dailyLog.prayers.dhuhr = true;
      await updateDailyLog(user.userId, today, { prayers: dailyLog.prayers });
    }

    set({
      todayDate: today,
      dailyLog,
      isLocked: !dailyLog.allTasksDone,
    });

    get().checkStreak();
    get().fetchPrayerTimes();
  },

  setShowConfetti: (v: boolean) => set({ showConfetti: v }),
}));
