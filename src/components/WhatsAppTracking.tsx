'use client';
import { useEffect } from 'react';
import { trackWhatsAppQuote, redirectToWhatsApp } from '@/lib/whatsapp-quote';
export function WhatsAppTracking() {
    useEffect(() => {
        const handleClick = (event: MouseEvent) => {
            if (window.location.pathname.startsWith('/admin') || window.location.pathname.startsWith('/simular-financiamento')) return;
            const link = event.target instanceof Element ? event.target.closest('a[href]') : null;
            if (!link) return;
            try {
                const url = new URL(link.getAttribute('href') || '', window.location.href);
                if (url.protocol === 'https:' && ['wa.me', 'api.whatsapp.com'].includes(url.hostname)) {
                    if (link.getAttribute('target') !== '_blank' && event.button === 0 && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey) {
                        event.preventDefault(); redirectToWhatsApp(url.href, 'link_site');
                    } else trackWhatsAppQuote('link_site');
                }
            } catch { /* Ignore malformed links. */ }
        };
        document.addEventListener('click', handleClick, true);
        return () => document.removeEventListener('click', handleClick, true);
    }, []);
    return null;
}
