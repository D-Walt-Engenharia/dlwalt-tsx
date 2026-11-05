'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, LockKeyhole, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/company';
import { redirectToWhatsApp, validateQuote, parseQuoteBill } from '@/lib/whatsapp-quote';
import styles from './QuoteExperience.module.css';

const questions = [
    { label: 'Qual o valor da sua conta de energia?', hint: 'Informe sua média mensal.', name: 'bill', placeholder: '500,00' },
    { label: 'Qual é o seu nome?', hint: 'Queremos conhecer você.', name: 'name', placeholder: 'Digite seu nome' },
    { label: 'Qual é o seu WhatsApp?', hint: 'Informe seu número com DDD.', name: 'phone', placeholder: '(69) 99999-9999' },
] as const;

export function QuoteWhatsAppForm() {
    const [step, setStep] = useState(0);
    const [values, setValues] = useState({ bill: '', name: '', phone: '' });
    const [error, setError] = useState('');
    const [sending, setSending] = useState(false);
    const locked = useRef(false);
    const input = useRef<HTMLInputElement>(null);
    const focusPending = useRef(false);
    const question = questions[step];

    useEffect(() => {
        if (focusPending.current) { input.current?.focus({ preventScroll: true }); focusPending.current = false; }
    }, [step]);
    useEffect(() => {
        // A visitor returning from WhatsApp can use the form again. Tracking still deduplicates the session.
        const reset = () => { locked.current = false; setSending(false); };
        window.addEventListener('pageshow', reset);
        return () => window.removeEventListener('pageshow', reset);
    }, []);

    const move = (next: number) => { setError(''); focusPending.current = true; setStep(next); };

    return <form className={styles.form} aria-label="Solicitar orçamento de energia solar" noValidate onSubmit={event => {
        event.preventDefault();
        if (locked.current) return;
        const problem = step === 0
            ? (parseQuoteBill(values.bill) === null ? 'Informe o valor da conta de energia, maior que zero.' : null)
            : step === 1
                ? validateQuote(values.name, '(69) 99999-9999', values.bill)
                : validateQuote(values.name, values.phone, values.bill);
        if (problem) { setError(problem); input.current?.focus(); return; }
        if (step < 2) { move(step + 1); return; }
        const value = parseQuoteBill(values.bill)!;
        const message = `Olá! Gostaria de solicitar um orçamento de energia solar.\nNome: ${values.name.trim()}\nConta de energia: ${value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}\nMeu WhatsApp: ${values.phone.trim()}`;
        locked.current = true; setSending(true); setError('');
        redirectToWhatsApp(`https://wa.me/${COMPANY_INFO.contact.whatsapp}?text=${encodeURIComponent(message)}`, 'formulario_contato');
    }}>
        <div className={styles.progressRow}>
            <span aria-live="polite" aria-atomic="true">0{step + 1} <span className={styles.stepTotal}>/ 03</span></span>
            <div className={styles.progress} role="progressbar" aria-label="Etapas do pedido" aria-valuemin={1} aria-valuemax={3} aria-valuenow={step + 1}>
                {questions.map((_, index) => <span key={index} className={index <= step ? styles.completed : undefined} />)}
            </div>
        </div>
        <div className={styles.field}>
            <label htmlFor={`quote-${question.name}`} className={styles.question}>{question.label}</label>
            <p id="quote-hint" className={styles.hint}>{question.hint}</p>
            <div className={styles.inputWrap}>
                {step === 0 && <span className={styles.currency} aria-hidden="true">R$</span>}
                <input ref={input} key={question.name} id={`quote-${question.name}`} name={question.name}
                    aria-label={step === 0 ? `${question.label} Em reais` : question.label}
                    type={step === 2 ? 'tel' : 'text'} inputMode={step === 0 ? 'decimal' : step === 2 ? 'tel' : 'text'}
                    autoComplete={step === 1 ? 'name' : step === 2 ? 'tel' : 'off'}
                    placeholder={question.placeholder} value={values[question.name]} required
                    maxLength={step === 0 ? 15 : step === 1 ? 120 : 20}
                    aria-describedby={`quote-hint${error ? ' quote-error' : ''}`} aria-invalid={Boolean(error)}
                    onChange={event => { setValues(previous => ({ ...previous, [question.name]: event.target.value })); setError(''); }}
                    className={styles.input} disabled={sending} />
            </div>
            <div className={styles.errorSlot}>{error && <p id="quote-error" role="alert">{error}</p>}</div>
        </div>
        <button type="submit" disabled={sending} className={styles.cta}>
            {step === 2 && <MessageCircle size={21} aria-hidden="true" />}
            {sending ? 'Abrindo WhatsApp…' : step === 2 ? 'Solicitar meu orçamento' : 'Continuar'}
            {step < 2 && <ArrowRight size={20} aria-hidden="true" />}
        </button>
        {step === 0 && <p className={styles.reassurance}><LockKeyhole size={14} aria-hidden="true" /> Grátis e sem compromisso</p>}
        {step === 2 && <p className={styles.disclosure}>Você será direcionado ao WhatsApp. Toque em Enviar para falar com nossa equipe.</p>}
        {step > 0 && <div className={styles.formFooter}>
            <button type="button" onClick={() => move(step - 1)} disabled={sending} className={styles.back}><ArrowLeft size={16} aria-hidden="true" /> Voltar</button>
            <Link href="/politica-de-privacidade" className={styles.privacy}>Privacidade</Link>
        </div>}
    </form>;
}
