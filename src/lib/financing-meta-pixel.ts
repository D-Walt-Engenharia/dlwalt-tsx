/**
 * Meta measurement for the financing page. Only pass the opaque record ID from
 * a confirmed backend receipt. Never pass CPF, income or other form fields.
 */
export const FINANCING_PIXEL_ID = '25094130833530947';

type Pixel = ((...args: unknown[]) => void) & {
    callMethod?: (...args: unknown[]) => void;
    queue?: unknown[][];
    push?: Pixel;
    loaded?: boolean;
    version?: string;
    getState?: () => { pixels?: Array<{ id: string }> };
};
type PixelWindow = Window & {
    fbq?: Pixel;
    _fbq?: Pixel;
    dwaltFinancingPixelReady?: boolean;
};
const STORAGE_KEY = 'dwalt.meta.financing-leads.v1';
const remembered = new Set<string>();

/** Initialise only on the financing page; reuse an existing Meta runtime. */
export function initializeFinancingPixel(): boolean {
    if (typeof window === 'undefined') return false;
    const browser = window as PixelWindow;
    if (browser.dwaltFinancingPixelReady) return true;
    try {
        if (typeof browser.fbq !== 'function') {
            const pixel: Pixel = function (...args: unknown[]) {
                if (pixel.callMethod) pixel.callMethod(...args);
                else pixel.queue!.push(args);
            };
            pixel.queue = [];
            pixel.push = pixel;
            pixel.loaded = true;
            pixel.version = '2.0';
            browser.fbq = pixel;
            browser._fbq = browser._fbq || pixel;
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://connect.facebook.net/en_US/fbevents.js';
            document.head.appendChild(script);
        }
        const pixel = browser.fbq;
        // Manual events only on this credit application page.
        pixel('set', 'autoConfig', false, FINANCING_PIXEL_ID);
        const alreadyInitialized = pixel.getState?.().pixels?.some(
            entry => String(entry.id) === FINANCING_PIXEL_ID,
        ) || pixel.queue?.some(args => args[0] === 'init' && args[1] === FINANCING_PIXEL_ID);
        if (!alreadyInitialized) pixel('init', FINANCING_PIXEL_ID);
        pixel('trackSingle', FINANCING_PIXEL_ID, 'PageView');
        browser.dwaltFinancingPixelReady = true;
        return true;
    } catch {
        // Optional analytics must never block the credit application.
        return false;
    }
}

function savedIds(): string[] {
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw || raw.length > 16000) return [];
        const ids: unknown = JSON.parse(raw);
        return Array.isArray(ids) ? ids.filter(
            (id): id is string => typeof id === 'string' && /^financing-[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(id),
        ).slice(-100) : [];
    } catch { return []; }
}

/** Queued is a browser command, not confirmation of receipt from Meta. */
export function trackFinancingLead(registrationId: string): 'queued' | 'duplicate' | 'invalid' | 'unavailable' {
    if (typeof window === 'undefined') return 'unavailable';
    if (typeof registrationId !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9_-]{0,53}$/.test(registrationId)) return 'invalid';
    const eventId = `financing-${registrationId}`;
    if (remembered.has(eventId) || savedIds().includes(eventId)) return 'duplicate';
    if (!initializeFinancingPixel()) return 'unavailable';
    remembered.add(eventId);
    try {
        (window as PixelWindow).fbq!('trackSingle', FINANCING_PIXEL_ID, 'Lead',
            { content_name: 'Simulacao de financiamento solar' }, { eventID: eventId });
    } catch {
        remembered.delete(eventId);
        return 'unavailable';
    }
    if (remembered.size > 100) remembered.delete(remembered.values().next().value!);
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds(), eventId].slice(-100)));
    } catch { /* Memory and eventID still provide deduplication. */ }
    return 'queued';
}
