import { trackWhatsAppQuote } from './whatsapp-quote';

/**
 * Centralized tracking utility for Google Tag Manager (gtag) and Facebook Pixel (fbq)
 */

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
    fbq: (...args: any[]) => void;
  }
}

/**
 * Ensures window.gtag and window.dataLayer exist even before external script finishes loading
 */
function ensureGtag() {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function () {
      window.dataLayer.push(arguments);
    };
  }
}

/**
 * Sends a custom event to Google Ads/Analytics and Facebook Pixel
 */
export const trackEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;

  ensureGtag();
  try {
    window.gtag("event", eventName, params);
  } catch (e) {
    console.error("Error dispatching gtag event:", e);
  }

  // Facebook Pixel
  if (window.fbq) {
    try {
      window.fbq("trackCustom", eventName, params);
    } catch (e) {
      console.error("Error dispatching fbq event:", e);
    }
  }
};

/**
 * Sends a Google Ads conversion event (e.g. send_to: 'AW-10800412438/n1bVCJ3mm54dEJbuhJ4o')
 */
export const trackGoogleConversion = (sendTo: string, params: Record<string, any> = {}) => {
  if (typeof window === "undefined") return;

  ensureGtag();
  try {
    window.gtag("event", "conversion", {
      send_to: sendTo,
      ...params,
    });
  } catch (e) {
    console.error("Error dispatching Google Ads conversion:", e);
  }
};

/**
 * Special handling for Facebook Standard Events
 */
export const trackPixelEvent = (eventName: string, params: Record<string, any> = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    try {
      window.fbq("track", eventName, params);
    } catch (e) {
      console.error("Error dispatching pixel event:", e);
    }
  }
};

/**
 * Tracking for Contact (e.g. clicking WhatsApp, Email or Form Submission)
 */
export const trackContact = (metodo: string, params: Record<string, any> = {}) => {
  if (["whatsapp", "widget_whatsapp", "calculadora_whatsapp", "unidade_whatsapp"].includes(metodo)) trackWhatsAppQuote(metodo);
  trackPixelEvent("Contact", { metodo, ...params });
  trackEvent("contato", { metodo, ...params });
};
