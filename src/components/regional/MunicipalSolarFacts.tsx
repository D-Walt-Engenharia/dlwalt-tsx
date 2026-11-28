import { municipalDataDownload, municipalRecords, solarDataLicense, solarDataSource, solarReferenceMonth } from '@/lib/regional-municipalities';
import styles from './RegionalPage.module.css';

const classesByService: Record<string, string[]> = {
    'energia-solar': ['Residencial', 'Comercial', 'Rural'],
    'energia-solar-residencial': ['Residencial'],
    'energia-solar-empresarial': ['Comercial'],
    'energia-solar-industrial': ['Industrial'],
};

export function MunicipalSolarFacts({ city, serviceSlug }: { city: string; serviceSlug: string }) {
    const record = municipalRecords[city];
    const classes = classesByService[serviceSlug];
    if (!record || !classes) return null;
    const counts = [['Total no município', record.total] as const,
        ...classes.map(label => [label, record.classes[label] ?? 0] as const)];
    return <section className={styles.solarFacts} data-regional-reveal aria-labelledby="mercado-solar">
        <h3 id="mercado-solar">Quantos sistemas solares existem em {city}?</h3>
        <p>Micro e minigeração fotovoltaica cadastrada na ANEEL até {solarReferenceMonth}. Os números incluem sistemas de todas as instaladoras.</p>
        <dl>{counts.map(([label, count]) => <div key={label}><dt>{label}</dt><dd>{count.toLocaleString('pt-BR')}</dd></div>)}</dl>
        <div className={styles.dataSources}><a href={solarDataSource}>Cadastro da ANEEL</a><a href={municipalDataDownload} download>Baixar dados de Rondônia</a><a href={solarDataLicense}>Licença ODbL</a></div>
    </section>;
}
