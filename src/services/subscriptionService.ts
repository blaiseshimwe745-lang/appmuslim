import AsyncStorage from '@react-native-async-storage/async-storage';

const TRIAL_START_KEY = 'trial_start_date';
const SUBSCRIPTION_KEY = 'subscription_status';
const TRIAL_DAYS = 3;

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  trialDaysLeft: number;
  plan: 'none' | 'trial' | 'monthly' | 'yearly';
  expiresAt: string | null;
}

/**
 * Start free trial (called after onboarding)
 */
export async function startFreeTrial(): Promise<void> {
  const existing = await AsyncStorage.getItem(TRIAL_START_KEY);
  if (!existing) {
    await AsyncStorage.setItem(TRIAL_START_KEY, new Date().toISOString());
    await AsyncStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify({ plan: 'trial' }));
  }
}

/**
 * Check current subscription status
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  const subData = await AsyncStorage.getItem(SUBSCRIPTION_KEY);

  if (subData) {
    const parsed = JSON.parse(subData);

    // Paid subscription
    if (parsed.plan === 'monthly' || parsed.plan === 'yearly') {
      return {
        isActive: true,
        isTrial: false,
        trialDaysLeft: 0,
        plan: parsed.plan,
        expiresAt: parsed.expiresAt || null,
      };
    }
  }

  // Check trial
  const trialStart = await AsyncStorage.getItem(TRIAL_START_KEY);
  if (!trialStart) {
    return {
      isActive: false,
      isTrial: false,
      trialDaysLeft: 0,
      plan: 'none',
      expiresAt: null,
    };
  }

  const start = new Date(trialStart);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const daysLeft = Math.max(0, TRIAL_DAYS - diffDays);

  if (daysLeft > 0) {
    return {
      isActive: true,
      isTrial: true,
      trialDaysLeft: daysLeft,
      plan: 'trial',
      expiresAt: new Date(start.getTime() + TRIAL_DAYS * 24 * 60 * 60 * 1000).toISOString(),
    };
  }

  // Trial expired
  return {
    isActive: false,
    isTrial: false,
    trialDaysLeft: 0,
    plan: 'none',
    expiresAt: null,
  };
}

/**
 * Activate paid subscription
 * In production: verify with Apple/Google receipt
 */
export async function activateSubscription(
  plan: 'monthly' | 'yearly',
  receiptData?: string
): Promise<void> {
  // TODO: In production, verify receipt with Apple App Store / Google Play
  // For now, store locally. In real app, use RevenueCat or Expo IAP.

  const expiresAt = new Date();
  if (plan === 'monthly') {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  await AsyncStorage.setItem(
    SUBSCRIPTION_KEY,
    JSON.stringify({
      plan,
      activatedAt: new Date().toISOString(),
      expiresAt: expiresAt.toISOString(),
      receiptData: receiptData || null,
    })
  );
}

/**
 * Restore purchases (for App Store compliance)
 */
export async function restorePurchases(): Promise<boolean> {
  // TODO: In production, query Apple/Google for existing purchases
  // For now, check local storage
  const subData = await AsyncStorage.getItem(SUBSCRIPTION_KEY);
  if (subData) {
    const parsed = JSON.parse(subData);
    return parsed.plan === 'monthly' || parsed.plan === 'yearly';
  }
  return false;
}
