import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { QuoteWhatsAppForm } from '@/components/QuoteWhatsAppForm';
import styles from '@/components/QuoteExperience.module.css';

export const metadata: Metadata = {
    title: 'Solicite seu Orçamento de Energia Solar | DWALT Energia',
    description: 'Peça uma proposta de energia solar para sua casa ou empresa em Rondônia. Informe o valor da conta, seu nome e WhatsApp. Grátis e sem compromisso.',
    alternates: { canonical: 'https://www.dwalt.net/solicitar-orcamento' },
    openGraph: {
        title: 'Sua próxima conta pode ser mais leve | DWALT Energia',
        description: 'Solicite uma proposta personalizada de energia solar pelo WhatsApp.',
        url: 'https://www.dwalt.net/solicitar-orcamento',
        type: 'website',
        locale: 'pt_BR',
    },
};

export default function SolarQuotePage() {
    return <main className={styles.landing} aria-labelledby="quote-heading">
        <div className={styles.landingCard}>
            <header className={styles.brandRow}>
                <Image src="/logo-branca.svg" width={142} height={38} alt="DWalt Energia" className={styles.logo} />
                <span>DESDE 2016</span>
            </header>
            <div className={styles.housePhoto}>
                <Image unoptimized src="/orcamento-casa.webp" alt="Casa com painéis solares ao pôr do sol" fill sizes="(min-width: 600px) 560px, 100vw" preload className={styles.houseImage} />
            </div>
            <div className={styles.landingContent}>
                <p className={styles.eyebrow}>ENERGIA SOLAR PARA SEU IMÓVEL</p>
                <h1 id="quote-heading" className={styles.headline}>Sua próxima conta<br />pode ser <span>mais leve.</span></h1>
                <p className={styles.intro}>Peça uma proposta personalizada para sua casa ou empresa.</p>
                <p className={styles.trust}>10 anos de história <span aria-hidden="true">·</span> Atendimento em Rondônia</p>
                <QuoteWhatsAppForm />
                <footer className={styles.landingFooter}>
                    <p className={styles.signature}>Energia que vem do alto.</p>
                    <Link href="/politica-de-privacidade">Política de Privacidade</Link>
                </footer>
            </div>
        </div>
    </main>;
}
