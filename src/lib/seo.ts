import type { Metadata } from 'next';
import { COMPANY_INFO } from './data/company';

export const SITE_URL = 'https://www.dwalt.net';
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export function plainText(value: string = ''): string {
    return value.replace(/<[^>]*>/g, ' ').replace(/&nbsp;|&#160;/g, ' ')
        .replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'")
        .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/\s+/g, ' ').trim();
}

export function pageMetadata(title: string, description: string, path: string): Metadata {
    const url = `${SITE_URL}${path}`;
    const text = plainText(description).slice(0, 170);
    return {
        title, description: text, alternates: { canonical: url },
        openGraph: { title, description: text, url, siteName: COMPANY_INFO.name, type: 'website', locale: 'pt_BR' },
    };
}

export function organizationSchema() {
    return {
        '@context': 'https://schema.org', '@type': 'Organization', '@id': ORGANIZATION_ID,
        name: COMPANY_INFO.name, url: `${SITE_URL}/`, logo: `${SITE_URL}/logo-branca.svg`,
        sameAs: Object.values(COMPANY_INFO.social),
        contactPoint: { '@type': 'ContactPoint', telephone: `+${COMPANY_INFO.contact.whatsapp}`, contactType: 'sales', areaServed: 'BR-RO', availableLanguage: 'pt-BR' },
    };
}
