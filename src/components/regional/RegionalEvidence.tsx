import Link from 'next/link';
import { getAllContent, type PublicProject } from '@/lib/public-content';
import { projectsInCity, unitInCity } from '@/lib/local-evidence';
import styles from './RegionalPage.module.css';

export async function getRegionalEvidence(city: string) {
    const unit = unitInCity(city);
    let projects: PublicProject[] = [];
    try { projects = projectsInCity(await getAllContent('projects'), city).slice(0, 3); } catch { /* Keep the service available during a portfolio outage. */ }
    return { unit, projects };
}

export function RegionalEvidence({ city, evidence }: { city: string; evidence: Awaited<ReturnType<typeof getRegionalEvidence>> }) {
    const { unit, projects } = evidence;
    if (!unit && !projects.length) return null;

    return <section className={styles.section} id="projetos-locais" aria-label={`Projetos e atendimento em ${city}`}>
        <div className={styles.inner}>
            {projects.length > 0 && <>
                <div className={styles.localIntro} data-regional-reveal>
                    <div><p className={styles.eyebrow}>Presença em {city}</p><h2>Projetos daqui.<br />Confiança de perto.</h2></div>
                    <p>Conheça instalações publicadas no nosso portfólio e converse com a equipe sobre o seu projeto.</p>
                </div>
                {projects.map(project => <Link key={project.id} className={styles.proofRow} href={`/projetos/${project.id}`} data-regional-reveal>
                    <div><span>{project.category.toLocaleUpperCase('pt-BR')} · {city.toLocaleUpperCase('pt-BR')}</span><h3>{project.name}</h3></div>
                    <div><strong>{Number.isFinite(Number(project.kwp)) ? Number(project.kwp).toLocaleString('pt-BR', { maximumFractionDigits: 2 }) : project.kwp} kWp</strong><br /><small>Potência instalada</small></div>
                    <span className={styles.arrow} aria-hidden="true">↗</span>
                </Link>)}
            </>}
            {unit && <div className={`${styles.unit} ${!projects.length ? styles.unitOnly : ''}`} data-regional-reveal>
                <div><h2>Nossa unidade em {city}</h2><p>{unit.address}</p></div>
                <a href={`https://wa.me/${unit.whatsapp}`} target="_blank" rel="noopener noreferrer">Fale com a equipe <span aria-hidden="true">↗</span></a>
            </div>}
        </div>
    </section>;
}
