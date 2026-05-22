import { PrayerTimings, NextPrayer } from '../types';
import { parseTimeString } from './dateHelpers';
import { addDays } from 'date-fns';

const PRAYER_ORDER_DISPLAY = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'] as const;

export function getNextPrayer(timings: PrayerTimings, currentTime: Date = new Date()): NextPrayer {
  for (const name of PRAYER_ORDER_DISPLAY) {
    const prayerTime = parseTimeString(timings[name]);
    if (prayerTime > currentTime) {
      const minutes = Math.round((prayerTime.getTime() - currentTime.getTime()) / 60000);
      return { name, time: timings[name], minutesUntil: minutes };
    }
  }

  // All prayers done for today -> next day Fajr
  const nextFajr = parseTimeString(timings.Fajr);
  nextFajr.setDate(nextFajr.getDate() + 1);
  const minutes = Math.round((nextFajr.getTime() - currentTime.getTime()) / 60000);
  return { name: 'Fajr (morgen)', time: timings.Fajr, minutesUntil: minutes };
}

export function isPrayerTimePassed(timings: PrayerTimings, prayer: string): boolean {
  const key = prayer.charAt(0).toUpperCase() + prayer.slice(1);
  const time = timings[key as keyof PrayerTimings];
  if (!time) return false;
  return parseTimeString(time) < new Date();
}

export function isIshaTimePassed(timings: PrayerTimings): boolean {
  return isPrayerTimePassed(timings, 'isha');
}

export function getPrayerEmoji(name: string): string {
  const emojiMap: Record<string, string> = {
    Fajr: '🌅',
    Dhuhr: '☀️',
    Asr: '🌤️',
    Maghrib: '🌅',
    Isha: '🌙',
  };
  return emojiMap[name] || '🕌';
}
