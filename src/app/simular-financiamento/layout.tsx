import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Simulação de Financiamento Solar | DWALT Energia',
    description: 'Solicite a análise de financiamento do seu projeto de energia solar em Rondônia. Preencha seus dados e receba o resultado pelo WhatsApp. Sujeito à análise de crédito.',
    alternates: { canonical: 'https://www.dwalt.net/simular-financiamento' },
    openGraph: {
        title: 'Simulação de Financiamento Solar | DWALT Energia',
        description: 'Solicite sua análise de financiamento solar em Rondônia e receba o resultado pelo WhatsApp.',
        url: 'https://www.dwalt.net/simular-financiamento',
        type: 'website',
        locale: 'pt_BR',
    },
};

export default function FinancingLayout({ children }: { children: React.ReactNode }) {
    return children;
}
