import { moneyDraftToApiValue } from './financing';

const DESTINATION = 'AW-10800412438/MdA4CKTYnrsZEJbuhJ4o';
const KEY = 'dwalt.whatsapp-quote.v1';
let memory: { id: string; sent: boolean } | undefined;

export function trackWhatsAppQuote(source: string, onDone?: () => void): void {
    if (typeof window === 'undefined') return;
    let done = false;
    const finish = () => { if (!done) { done = true; onDone?.(); } };
    try {
        if (!memory) {
            try {
                const saved = JSON.parse(window.sessionStorage.getItem(KEY) || 'null');
                if (saved && /^wa-[a-zA-Z0-9-]{8,80}$/.test(saved.id) && typeof saved.sent === 'boolean') memory = saved;
            } catch { /* Storage is optional. */ }
            memory ||= { id: `wa-${window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`, sent: false };
        }
        if (memory.sent || typeof window.gtag !== 'function') { finish(); return; }
        memory.sent = true;
        const timer = onDone ? window.setTimeout(finish, 800) : undefined;
        window.gtag('event', 'conversion', {
            send_to: DESTINATION, transaction_id: memory.id,
            event_callback: () => { if (timer !== undefined) window.clearTimeout(timer); finish(); },
            event_timeout: 800,
        });
        window.gtag('event', 'solicitacao_orcamento_whatsapp', { origem: source });
        try { window.sessionStorage.setItem(KEY, JSON.stringify(memory)); } catch { /* Keep memory dedup. */ }
    } catch { if (memory) memory.sent = false; finish(); }
}

export function redirectToWhatsApp(url: string, source: string): void {
    const target = new URL(url);
    if (target.protocol !== 'https:' || !['wa.me', 'api.whatsapp.com'].includes(target.hostname)) return;
    trackWhatsAppQuote(source, () => window.location.assign(target.href));
}

export function validateQuote(name: string, phone: string, bill: string): string | null {
    if (!name.trim() || name.trim().length < 2 || name.trim().length > 120) return 'Informe seu nome.';
    let digits = phone.replace(/\D/g, '');
    if (digits.startsWith('55') && digits.length > 11) digits = digits.slice(2);
    if (!/^[1-9]{2}[2-9]\d{7,8}$/.test(digits) || /^(\d)\1+$/.test(digits)) return 'Informe seu WhatsApp com DDD.';
    const value = parseQuoteBill(bill);
    if (value === null) return 'Informe o valor da conta de energia, maior que zero.';
    return null;
}

export function parseQuoteBill(bill: string): number | null {
    const text = bill.trim();
    if (!/^(?:\d+(?:[.,]\d{1,2})?|\d{1,3}(?:\.\d{3})+(?:,\d{1,2})?)$/.test(text)) return null;
    const value = Number(moneyDraftToApiValue(text));
    return Number.isFinite(value) && value > 0 && value <= 10000000 ? value : null;
}
