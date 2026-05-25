// ============================================================
// Notification Manager - STUB (Push Notifications deaktiviert)
// expo-notifications wurde temporaer entfernt um den iOS Build
// ohne Push Notifications Provisioning Profile zu ermoglichen.
// Alle Funktionen sind No-Ops die nichts tun aber keine Fehler werfen.
// TODO: Reaktivieren wenn APNs + Provisioning Profile konfiguriert sind.
// ============================================================

import { PrayerTimings } from '../types';

export async function requestNotificationPermissions(): Promise<boolean> {
  console.log('[Notifications] Stub: Push Notifications sind deaktiviert');
  return false;
}

export async function scheduleStreakReminder(_streak: number): Promise<void> {
  // No-op
}

export async function schedulePrayerReminders(
  _timings: PrayerTimings,
  _reminderMinutes: number
): Promise<void> {
  // No-op
}

export async function sendMilestoneNotification(_type: string): Promise<void> {
  // No-op
}

export async function sendTasksCompleteNotification(): Promise<void> {
  // No-op
}

export async function cancelAllNotifications(): Promise<void> {
  // No-op
}
