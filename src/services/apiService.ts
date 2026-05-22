import { PrayerTimings } from '../types';

const ALADHAN_BASE = 'https://api.aladhan.com/v1';

interface AladhanResponse {
  code: number;
  status: string;
  data: {
    timings: Record<string, string>;
  };
}

export async function fetchPrayerTimesByCity(
  date: string,
  city: string,
  country: string,
  method: number
): Promise<PrayerTimings> {
  const url = `${ALADHAN_BASE}/timingsByCity/${date}?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Aladhan API error: ${res.status}`);

  const json: AladhanResponse = await res.json();
  if (json.code !== 200) throw new Error(`Aladhan API returned code ${json.code}`);

  const t = json.data.timings;
  return {
    Fajr: stripTimezone(t.Fajr),
    Sunrise: stripTimezone(t.Sunrise),
    Dhuhr: stripTimezone(t.Dhuhr),
    Asr: stripTimezone(t.Asr),
    Maghrib: stripTimezone(t.Maghrib),
    Isha: stripTimezone(t.Isha),
  };
}

function stripTimezone(time: string): string {
  return time.replace(/\s*\(.*\)/, '').trim();
}
