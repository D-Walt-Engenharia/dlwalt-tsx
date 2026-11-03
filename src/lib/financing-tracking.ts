/**
 * Track a financing registration only after the application's backend has
 * confirmed that the complete registration was saved and returned its stable ID.
 *
 * This module deliberately does not initialise a tag, change consent, or emit
 * Analytics/Facebook events. The site's existing Google tag and consent setup
 * remain responsible for delivering the queued event.
 */

export type FinancingTrackingStatus =
  | "queued"
  | "duplicate"
  | "not-configured"
  | "invalid-registration"
  | "unavailable"
  | "failed";

type TrackingWindow = {
  gtag?: unknown;
  localStorage: Pick<Storage, "getItem" | "setItem">;
};

const PAGE_VIEW_CONVERSION = "AW-10800412438/n1bVCJ3mm54dEJbuhJ4o";
const STORAGE_KEY = "dwalt.financing-conversions.v1";
const MAX_REMEMBERED_CONVERSIONS = 100;
const MAX_STORED_LENGTH = 64_000;
const dispatched = new Map<string, true>();

function getDestination(): string | null {
  // Keep the literal NEXT_PUBLIC_ reference so Next.js can inline it at build time.
  const destination = process.env.NEXT_PUBLIC_GOOGLE_ADS_FINANCING_CONVERSION?.trim();

  if (
    !destination ||
    destination.length > 180 ||
    !/^AW-\d+\/[A-Za-z0-9_-]+$/.test(destination) ||
    destination === PAGE_VIEW_CONVERSION
  ) {
    return null;
  }

  return destination;
}

function isRegistrationId(value: unknown): value is string {
  // Accept only an opaque server record ID, never form fields or personal data.
  // Google Ads permits at most 64 characters for transaction_id. The stable
  // "financing-" prefix uses 10; reject longer IDs rather than truncating them.
  return (
    typeof value === "string" &&
    value.trim() === value &&
    /^[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(value)
  );
}

function readRemembered(browser: TrackingWindow): string[] {
  try {
    const raw = browser.localStorage.getItem(STORAGE_KEY);
    if (!raw || raw.length > MAX_STORED_LENGTH) return [];

    const saved: unknown = JSON.parse(raw);
    if (!Array.isArray(saved)) return [];

    return saved.slice(-MAX_REMEMBERED_CONVERSIONS).filter(
      (entry): entry is string =>
        typeof entry === "string" &&
        entry.length <= 245 &&
        /^AW-\d+\/[A-Za-z0-9_-]+\|financing-[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(entry),
    );
  } catch {
    // Storage may be disabled, full, or contain invalid data. In-memory
    // deduplication and the Google Ads transaction ID remain available.
    return [];
  }
}

function rememberInMemory(key: string): void {
  dispatched.delete(key);
  dispatched.set(key, true);

  while (dispatched.size > MAX_REMEMBERED_CONVERSIONS) {
    const oldest = dispatched.keys().next().value;
    if (oldest === undefined) break;
    dispatched.delete(oldest);
  }
}

function persistRemembered(browser: TrackingWindow, key: string): void {
  try {
    const saved = readRemembered(browser).filter((entry) => entry !== key);
    saved.push(key);
    browser.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(saved.slice(-MAX_REMEMBERED_CONVERSIONS)),
    );
  } catch {
    // Never turn an already-saved registration into a UI error because optional
    // advertising measurement could not persist a local deduplication marker.
  }
}

/**
 * `queued` means the existing gtag function accepted the command without throwing.
 * It is not a Google receipt, delivery confirmation, or attribution guarantee.
 *
 * The caller must pass the ID from a verified save response, not a client-generated
 * submission token, email, phone number, CPF/CNPJ, or a success-page URL.
 */
export function trackFinancingRegistration(
  registrationId: string,
): FinancingTrackingStatus {
  if (typeof window === "undefined") return "unavailable";
  if (!isRegistrationId(registrationId)) return "invalid-registration";

  const destination = getDestination();
  if (!destination) return "not-configured";

  const browser = window as unknown as TrackingWindow;
  const transactionId = `financing-${registrationId}`;
  const key = `${destination}|${transactionId}`;

  if (dispatched.has(key) || readRemembered(browser).includes(key)) {
    rememberInMemory(key);
    return "duplicate";
  }

  const sendEvent = browser.gtag;
  if (typeof sendEvent !== "function") return "unavailable";

  // Reserve before invoking the tag to prevent a re-entrant call for this record.
  // A synchronous failure releases the reservation so an explicit retry is safe.
  rememberInMemory(key);
  try {
    sendEvent.call(window, "event", "conversion", {
      send_to: destination,
      transaction_id: transactionId,
    });
  } catch {
    dispatched.delete(key);
    return "failed";
  }

  persistRemembered(browser, key);
  return "queued";
}
