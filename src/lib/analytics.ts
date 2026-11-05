/** Existing connected DWalt property; verified in the GA4 interface on 2026-11-05. */
export const GA4_MEASUREMENT_ID = 'G-B5TF6XMTWD';
const STORAGE_KEY = 'dwalt.ga4.confirmed-financing.v1';
const sent = new Set<string>();

/** Called only with the ID returned by the successful save, never form values. */
export function trackConfirmedAnalyticsLead(registrationId: string): 'queued' | 'duplicate' | 'invalid' | 'unavailable' {
    if (typeof window === 'undefined') return 'unavailable';
    if (!/^[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(registrationId)) return 'invalid';
    let saved: string[] = [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        const parsed: unknown = raw && raw.length < 16000 ? JSON.parse(raw) : [];
        if (Array.isArray(parsed)) saved = parsed.filter((id): id is string => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(id)).slice(-100);
    } catch { /* Optional storage must not block a confirmed registration. */ }
    if (sent.has(registrationId) || saved.includes(registrationId)) return 'duplicate';
    const browser = window as Window & { gtag?: (...args: unknown[]) => void };
    if (typeof browser.gtag !== 'function') return 'unavailable';
    sent.add(registrationId);
    try {
        browser.gtag('event', 'generate_lead', {
            send_to: GA4_MEASUREMENT_ID,
            event_id: `financing-${registrationId}`,
            lead_source: 'simular_financiamento',
        });
    } catch {
        sent.delete(registrationId);
        return 'unavailable';
    }
    if (sent.size > 100) sent.delete(sent.values().next().value!);
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...saved, registrationId].slice(-100))); } catch { /* Memory still deduplicates this page session. */ }
    return 'queued';
}
