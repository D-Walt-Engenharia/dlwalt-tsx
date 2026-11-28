import Link from 'next/link';
import styles from './RegionalPage.module.css';

export function RegionalProjectOptions({ city }: { city: string }) {
    return <nav className={`${styles.journey} ${styles.projectOptions}`} aria-label={`Planejar energia solar em ${city}`} data-regional-reveal>
        <div id="orcamento-solar">
            <h3>Orçamento de energia solar em {city}</h3>
            <p>Informe o valor da conta de luz, seu nome e seu WhatsApp para pedir uma proposta para o imóvel.</p>
            <Link className={styles.textLink} href="/solicitar-orcamento">Pedir meu orçamento</Link>
        </div>
        <div id="simulacao-solar">
            <h3>Simulação de energia solar</h3>
            <p>Use o consumo mensal em kWh que aparece na sua fatura para estimar a potência do sistema e a quantidade de placas.</p>
            <Link className={styles.textLink} href="/calculadora-solar">Calcular meu sistema</Link>
        </div>
        <div id="financiamento-solar">
            <h3>Financiamento para energia solar</h3>
            <p>Solicite uma análise para financiar o projeto. A instituição financeira avalia o crédito e confirma as taxas, os prazos e as parcelas.</p>
            <Link className={styles.textLink} href="/simular-financiamento">Analisar meu financiamento</Link>
        </div>
    </nav>;
}
