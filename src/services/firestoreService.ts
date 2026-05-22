import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  onSnapshot,
  Timestamp,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import {
  User,
  DailyLog,
  BlockedApp,
  Milestone,
  PrayerTimesCache,
  PrayerTimings,
  DEFAULT_USER,
  DEFAULT_DAILY_LOG,
  DEFAULT_BLOCKED_APPS,
  MILESTONES_CONFIG,
} from '../types';

// ─── USER ───────────────────────────────────────────

export async function getUser(userId: string): Promise<User | null> {
  const snap = await getDoc(doc(db, 'users', userId));
  return snap.exists() ? (snap.data() as User) : null;
}

export async function createUser(userId: string, email: string | null, displayName: string): Promise<User> {
  const userData: User = {
    ...(DEFAULT_USER as User),
    userId,
    email,
    displayName,
    createdAt: Timestamp.now(),
  };
  await setDoc(doc(db, 'users', userId), userData);
  return userData;
}

export async function updateUser(userId: string, data: Partial<User>): Promise<void> {
  await updateDoc(doc(db, 'users', userId), data as Record<string, unknown>);
}

export function subscribeToUser(userId: string, callback: (user: User) => void): Unsubscribe {
  return onSnapshot(doc(db, 'users', userId), (snap) => {
    if (snap.exists()) callback(snap.data() as User);
  });
}

// ─── DAILY LOG ──────────────────────────────────────

function dailyLogId(userId: string, date: string): string {
  return `${userId}_${date}`;
}

export async function getDailyLog(userId: string, date: string): Promise<DailyLog | null> {
  const id = dailyLogId(userId, date);
  const snap = await getDoc(doc(db, 'daily_logs', id));
  return snap.exists() ? (snap.data() as DailyLog) : null;
}

export async function getOrCreateDailyLog(userId: string, date: string): Promise<DailyLog> {
  const existing = await getDailyLog(userId, date);
  if (existing) return existing;

  const now = Timestamp.now();
  const log: DailyLog = {
    ...DEFAULT_DAILY_LOG,
    id: dailyLogId(userId, date),
    userId,
    date,
    createdAt: now,
    updatedAt: now,
  };
  await setDoc(doc(db, 'daily_logs', log.id), log);
  return log;
}

export async function updateDailyLog(userId: string, date: string, data: Partial<DailyLog>): Promise<void> {
  const id = dailyLogId(userId, date);
  await updateDoc(doc(db, 'daily_logs', id), {
    ...data,
    updatedAt: Timestamp.now(),
  } as Record<string, unknown>);
}

export function subscribeToDailyLog(userId: string, date: string, callback: (log: DailyLog) => void): Unsubscribe {
  const id = dailyLogId(userId, date);
  return onSnapshot(doc(db, 'daily_logs', id), (snap) => {
    if (snap.exists()) callback(snap.data() as DailyLog);
  });
}

export async function getMonthLogs(userId: string, year: number, month: number): Promise<DailyLog[]> {
  const prefix = `${userId}_${year}-${String(month).padStart(2, '0')}`;
  const q = query(
    collection(db, 'daily_logs'),
    where('userId', '==', userId),
    where('date', '>=', `${year}-${String(month).padStart(2, '0')}-01`),
    where('date', '<=', `${year}-${String(month).padStart(2, '0')}-31`)
  );
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as DailyLog);
}

// ─── BLOCKED APPS ───────────────────────────────────

export async function getBlockedApps(userId: string): Promise<BlockedApp[]> {
  const q = query(collection(db, 'blocked_apps'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as BlockedApp);
}

export async function initDefaultBlockedApps(userId: string): Promise<BlockedApp[]> {
  const apps: BlockedApp[] = [];
  for (const def of DEFAULT_BLOCKED_APPS) {
    const id = `${userId}_${def.packageName}`;
    const app: BlockedApp = { ...def, id, userId };
    await setDoc(doc(db, 'blocked_apps', id), app);
    apps.push(app);
  }
  return apps;
}

export async function updateBlockedApp(id: string, data: Partial<BlockedApp>): Promise<void> {
  await updateDoc(doc(db, 'blocked_apps', id), data as Record<string, unknown>);
}

// ─── MILESTONES ─────────────────────────────────────

export async function getMilestones(userId: string): Promise<Milestone[]> {
  const q = query(collection(db, 'milestones'), where('userId', '==', userId));
  const snap = await getDocs(q);
  return snap.docs.map((d) => d.data() as Milestone);
}

export async function initDefaultMilestones(userId: string): Promise<Milestone[]> {
  const milestones: Milestone[] = [];
  for (const cfg of MILESTONES_CONFIG) {
    const id = `${userId}_${cfg.type}`;
    const m: Milestone = {
      id,
      userId,
      type: cfg.type,
      label: cfg.label,
      emoji: cfg.emoji,
      targetDays: cfg.targetDays,
      progress: 0,
      isAchieved: false,
      achievedAt: null,
      celebrated: false,
    };
    await setDoc(doc(db, 'milestones', id), m);
    milestones.push(m);
  }
  return milestones;
}

export async function checkAndUpdateMilestones(userId: string, currentStreak: number): Promise<Milestone | null> {
  const milestones = await getMilestones(userId);
  let newlyAchieved: Milestone | null = null;

  for (const m of milestones) {
    const progress = Math.min(100, Math.round((currentStreak / m.targetDays) * 100));
    const justAchieved = !m.isAchieved && currentStreak >= m.targetDays;

    await updateDoc(doc(db, 'milestones', m.id), {
      progress,
      isAchieved: m.isAchieved || justAchieved,
      achievedAt: justAchieved ? Timestamp.now() : m.achievedAt,
    });

    if (justAchieved) newlyAchieved = { ...m, progress: 100, isAchieved: true };
  }

  return newlyAchieved;
}

// ─── PRAYER TIMES CACHE ─────────────────────────────

export async function getCachedPrayerTimes(userId: string, date: string): Promise<PrayerTimings | null> {
  const id = `${userId}_${date}`;
  const snap = await getDoc(doc(db, 'prayer_times_cache', id));
  if (!snap.exists()) return null;
  const data = snap.data() as PrayerTimesCache;
  const age = Date.now() - data.fetchedAt.toMillis();
  if (age > 24 * 60 * 60 * 1000) return null;
  return data.timings;
}

export async function cachePrayerTimes(
  userId: string,
  date: string,
  timings: PrayerTimings,
  city: string,
  method: number
): Promise<void> {
  const id = `${userId}_${date}`;
  await setDoc(doc(db, 'prayer_times_cache', id), {
    userId,
    date,
    timings,
    fetchedAt: Timestamp.now(),
    city,
    method,
  });
}
