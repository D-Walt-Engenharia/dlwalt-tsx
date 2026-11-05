'use client';

import Image from 'next/image';
import { Mail, MapPin, Phone, Instagram, Facebook, Youtube } from 'lucide-react';
import { QuoteWhatsAppForm } from './QuoteWhatsAppForm';
import { COMPANY_INFO } from '@/lib/data/company';
import { trackContact } from '@/lib/tracking';
import styles from './QuoteExperience.module.css';

export function Contact() {
    return <section id="contact" className={styles.section} aria-labelledby="quote-heading">
        <div className={styles.layout}>
            <div className={styles.experience}>
                <div className={styles.brandRow}>
                    <Image src="/logo-branca.svg" width={142} height={38} alt="DWalt Energia" className={styles.logo} />
                    <span>DESDE 2016</span>
                </div>
                <div className={styles.photo}>
                    <Image unoptimized src="/orcamento-instalacao.webp" alt="Instalação de painéis solares do portfólio da DWALT Energia" fill sizes="(min-width: 1024px) 620px, 100vw" quality={65} className={styles.photoImage} />
                </div>
                <div className={styles.content}>
                    <p className={styles.eyebrow}>ENERGIA SOLAR PARA SEU IMÓVEL</p>
                    <h2 id="quote-heading" className={styles.headline}>Sua próxima conta<br />pode ser <span>mais leve.</span></h2>
                    <p className={styles.intro}>Peça uma proposta personalizada para sua casa ou empresa.</p>
                    <p className={styles.trust}>10 anos de história <span aria-hidden="true">·</span> Atendimento em Rondônia</p>
                    <QuoteWhatsAppForm />
                    <p className={styles.signature}>Energia que vem do alto.</p>
                </div>
            </div>
            <aside className={styles.contacts} aria-label="Contatos e endereço da DWALT">
                <p className={styles.eyebrow}>PERTO DE VOCÊ</p>
                <h3>Uma equipe de verdade.<br /><span>Do projeto ao pós-venda.</span></h3>
                <p className={styles.contactIntro}>Converse com a DWALT e encontre a solução de energia solar para o seu imóvel.</p>
                <div className={styles.contactItem}><Phone aria-hidden="true" size={21} /><div><p>Telefone / WhatsApp</p><a href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}`} target="_blank" rel="noopener noreferrer" onClick={() => trackContact('whatsapp')}>{COMPANY_INFO.contact.phone}</a></div></div>
                <div className={styles.contactItem}><Mail aria-hidden="true" size={21} /><div><p>E-mail</p><a href={`mailto:${COMPANY_INFO.contact.email}`} onClick={() => trackContact('email')}>{COMPANY_INFO.contact.email}</a></div></div>
                <div className={styles.contactItem}><MapPin aria-hidden="true" size={21} /><div><p>Matriz · Ariquemes</p><span>{COMPANY_INFO.units[0].address}</span></div></div>
                <div className={styles.socials}>
                    <a href={COMPANY_INFO.social.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram da DWALT"><Instagram size={20} /></a>
                    <a href={COMPANY_INFO.social.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook da DWALT"><Facebook size={20} /></a>
                    <a href={COMPANY_INFO.social.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube da DWALT"><Youtube size={20} /></a>
                </div>
            </aside>
        </div>
    </section>;
}
