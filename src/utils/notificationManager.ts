import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { PrayerTimings } from '../types';
import { parseTimeString } from './dateHelpers';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function requestNotificationPermissions(): Promise<boolean> {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
}

export async function scheduleStreakReminder(streak: number): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync('streak_check').catch(() => {});

  await Notifications.scheduleNotificationAsync({
    identifier: 'streak_check',
    content: {
      title: '🔥 Streak-Check',
      body: `Hast du heute schon deine Aufgaben erledigt? Streak: ${streak} Tage!`,
      data: { screen: 'Dashboard' },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 20,
      minute: 0,
    },
  });
}

export async function schedulePrayerReminders(
  timings: PrayerTimings,
  reminderMinutes: number
): Promise<void> {
  const prayers = [
    { id: 'fajr_reminder', name: 'Fajr', time: timings.Fajr },
    { id: 'dhuhr_reminder', name: 'Dhuhr', time: timings.Dhuhr },
    { id: 'asr_reminder', name: 'Asr', time: timings.Asr },
    { id: 'maghrib_reminder', name: 'Maghrib', time: timings.Maghrib },
    { id: 'isha_reminder', name: 'Isha', time: timings.Isha },
  ];

  for (const p of prayers) {
    await Notifications.cancelScheduledNotificationAsync(p.id).catch(() => {});

    const prayerDate = parseTimeString(p.time);
    prayerDate.setMinutes(prayerDate.getMinutes() - reminderMinutes);

    if (prayerDate > new Date()) {
      await Notifications.scheduleNotificationAsync({
        identifier: p.id,
        content: {
          title: `🕌 ${p.name} Zeit`,
          body: `Es ist bald Zeit für ${p.name}. Starte mit Barakah!`,
          data: { screen: 'Dashboard', prayer: p.name },
        },
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.DAILY,
          hour: prayerDate.getHours(),
          minute: prayerDate.getMinutes(),
        },
      });
    }
  }
}

export async function sendMilestoneNotification(type: string): Promise<void> {
  const titles: Record<string, string> = {
    '7_days': '🥉 7 Tage Streak!',
    '30_days': '🥈 30 Tage – Masha\'Allah!',
    '100_days': '🥇 100 Tage – Unglaublich!',
    '365_days': '👑 EIN JAHR BARAKAH!',
  };

  await Notifications.scheduleNotificationAsync({
    content: {
      title: titles[type] || '🎉 Meilenstein erreicht!',
      body: 'Alhamdulillah! Du hast einen wichtigen Meilenstein erreicht. Bleib dran! 💪',
      data: { screen: 'Streak', highlight: type },
    },
    trigger: null,
  });
}

export async function sendTasksCompleteNotification(): Promise<void> {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: '✅ Masha\'Allah!',
      body: 'Alle Aufgaben erledigt! Deine Apps sind jetzt freigeschaltet.',
      data: { screen: 'Dashboard' },
    },
    trigger: null,
  });
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
