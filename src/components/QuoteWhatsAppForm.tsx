'use client';
import { useRef, useState } from 'react';
import { Button } from './ui/button';
import { COMPANY_INFO } from '@/lib/data/company';
import { redirectToWhatsApp, validateQuote, parseQuoteBill } from '@/lib/whatsapp-quote';

export function QuoteWhatsAppForm() {
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const locked = useRef(false);
    const inputClass = 'w-full px-4 py-3 rounded-xl border border-white/10 bg-black/50 text-white focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none placeholder:text-gray-400';
    const labelClass = 'block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2';
    return <form className="space-y-5 relative z-10" onSubmit={event => {
        event.preventDefault();
        if (locked.current) return;
        const data = new FormData(event.currentTarget);
        const name = String(data.get('name') || '').trim();
        const phone = String(data.get('phone') || '').trim();
        const bill = String(data.get('bill') || '').trim();
        const problem = validateQuote(name, phone, bill);
        if (problem) { setError(problem); return; }
        const value = parseQuoteBill(bill)!;
        const message = `Olá! Gostaria de solicitar um orçamento de energia solar.\nNome: ${name}\nConta de energia: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nMeu WhatsApp: ${phone}`;
        locked.current = true; setSending(true); setError('');
        redirectToWhatsApp(`https://wa.me/${COMPANY_INFO.contact.whatsapp}?text=${encodeURIComponent(message)}`, 'formulario_contato');
    }}>
        <div><label htmlFor="quote-bill" className={labelClass}>Valor da conta de energia (R$)</label>
            <input id="quote-bill" name="bill" type="text" inputMode="decimal" placeholder="Ex: 500,00" required maxLength={15} className={inputClass} /></div>
        <div><label htmlFor="quote-name" className={labelClass}>Nome</label>
            <input id="quote-name" name="name" autoComplete="name" placeholder="Digite seu nome" required minLength={2} maxLength={120} className={inputClass} /></div>
        <div><label htmlFor="quote-phone" className={labelClass}>Seu WhatsApp com DDD</label>
            <input id="quote-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="(69) 99999-9999" required maxLength={20} className={inputClass} /></div>
        {error && <p role="alert" className="text-sm text-red-300">{error}</p>}
        <Button type="submit" disabled={sending} size="lg" className="w-full min-h-14 h-auto py-4 text-base sm:text-lg font-bold bg-primary text-black hover:bg-primary/90 rounded-xl shadow-lg shadow-primary/25">
            {sending ? 'Abrindo WhatsApp…' : 'Solicitar orçamento pelo WhatsApp'}
        </Button>
        <p className="text-xs text-center text-gray-400">Você será direcionado ao WhatsApp com seus dados na mensagem. Toque em enviar para falar com nossa equipe. <a href="/politica-de-privacidade" className="underline hover:text-primary">Política de Privacidade</a>.</p>
    </form>;
}
