import * as StoreReview from 'expo-store-review';
import AsyncStorage from '@react-native-async-storage/async-storage';

const REVIEW_REQUESTED_KEY = 'hasRequestedReview';
const REVIEW_REQUEST_DATE_KEY = 'reviewRequestDate';

/**
 * Apple Native In-App Review Popup
 * Apple limits this to max 3x/year per user automatically.
 * Best practice: call after positive interaction (onboarding done, first session).
 */
export async function maybeRequestReview(delayMs: number = 2500): Promise<void> {
  try {
    // Already requested? Skip
    const alreadyRequested = await AsyncStorage.getItem(REVIEW_REQUESTED_KEY);
    if (alreadyRequested === 'true') return;

    // Check device support
    const isAvailable = await StoreReview.isAvailableAsync();
    if (!isAvailable) return;

    const hasAction = await StoreReview.hasAction();
    if (!hasAction) return;

    // Slight delay so it doesn't pop right when screen loads
    setTimeout(async () => {
      try {
        await StoreReview.requestReview();
        await AsyncStorage.setItem(REVIEW_REQUESTED_KEY, 'true');
        await AsyncStorage.setItem(REVIEW_REQUEST_DATE_KEY, new Date().toISOString());
      } catch (e) {
        console.log('Review request failed:', e);
      }
    }, delayMs);
  } catch (e) {
    console.log('maybeRequestReview error:', e);
  }
}

/**
 * Reset (for testing)
 */
export async function resetReviewRequest(): Promise<void> {
  await AsyncStorage.removeItem(REVIEW_REQUESTED_KEY);
  await AsyncStorage.removeItem(REVIEW_REQUEST_DATE_KEY);
}
