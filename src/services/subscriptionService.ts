import Purchases, {
  PurchasesPackage,
  CustomerInfo,
  LOG_LEVEL,
} from 'react-native-purchases';
import { Platform } from 'react-native';

// ============================================================
// RevenueCat Configuration
// ============================================================
// 1. Create account at https://app.revenuecat.com
// 2. Add your app (iOS) and paste the API key below
// 3. App Store Connect Subscription Products (Gruppe: monthly):
//    - Product ID: bakarahmonatlich  (€4,99/Monat, Apple-ID: 6773070052)
//    - Product ID: jaehrlichbakarah  (€39,99/Jahr, Apple-ID: 6773070452)
// 4. In RevenueCat: create Entitlement "premium"
//    - Attach both products to it
//    - Create Offering "default" with both packages
// ============================================================

const REVENUECAT_API_KEY_IOS = 'test_YaZJGoNXqZYexfOMVByAHJUHCrY';
const REVENUECAT_API_KEY_ANDROID = 'test_YaZJGoNXqZYexfOMVByAHJUHCrY';

const ENTITLEMENT_ID = 'premium';

// App Store Connect Product IDs (Abo-Gruppe: monthly)
export const PRODUCT_IDS = {
  MONTHLY: 'bakarahmonatlich',   // €4,99/Monat – Apple-ID: 6773070052
  YEARLY: 'jaehrlichbakarah',    // €39,99/Jahr – Apple-ID: 6773070452
} as const;

export interface SubscriptionStatus {
  isActive: boolean;
  isTrial: boolean;
  willRenew: boolean;
  expiresAt: string | null;
  productId: string | null;
}

/**
 * Initialize RevenueCat SDK - call once at app startup
 */
export async function initializePurchases(userId?: string): Promise<void> {
  const apiKey = Platform.OS === 'ios'
    ? REVENUECAT_API_KEY_IOS
    : REVENUECAT_API_KEY_ANDROID;

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  await Purchases.configure({ apiKey, appUserID: userId });
}

/**
 * Check if user has active premium subscription or trial
 */
export async function getSubscriptionStatus(): Promise<SubscriptionStatus> {
  try {
    const customerInfo = await Purchases.getCustomerInfo();
    const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];

    if (entitlement) {
      return {
        isActive: true,
        isTrial: entitlement.periodType === 'TRIAL',
        willRenew: entitlement.willRenew,
        expiresAt: entitlement.expirationDate,
        productId: entitlement.productIdentifier,
      };
    }

    return {
      isActive: false,
      isTrial: false,
      willRenew: false,
      expiresAt: null,
      productId: null,
    };
  } catch (error) {
    console.error('Error checking subscription:', error);
    return {
      isActive: false,
      isTrial: false,
      willRenew: false,
      expiresAt: null,
      productId: null,
    };
  }
}

/**
 * Get available subscription packages from RevenueCat
 */
export async function getOfferings(): Promise<{
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
}> {
  try {
    const offerings = await Purchases.getOfferings();
    const current = offerings.current;

    if (!current) {
      return { monthly: null, yearly: null };
    }

    return {
      monthly: current.monthly,
      yearly: current.annual,
    };
  } catch (error) {
    console.error('Error getting offerings:', error);
    return { monthly: null, yearly: null };
  }
}

/**
 * Purchase a subscription package
 * Apple handles the free trial automatically (if configured)
 * After trial: auto-charges €4,99/month or €39,99/year
 */
export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo }> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    const isActive = !!customerInfo.entitlements.active[ENTITLEMENT_ID];

    return { success: isActive, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      // User cancelled - not an error
      return { success: false };
    }
    console.error('Purchase error:', error);
    throw error;
  }
}

/**
 * Restore previous purchases (Apple requires this button)
 */
export async function restorePurchases(): Promise<boolean> {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return !!customerInfo.entitlements.active[ENTITLEMENT_ID];
  } catch (error) {
    console.error('Restore error:', error);
    return false;
  }
}
