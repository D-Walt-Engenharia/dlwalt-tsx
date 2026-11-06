import Image from 'next/image';
import Link from 'next/link';
import { getAllContent, type PublicProject } from '@/lib/public-content';
import { projectCity, regionalPortfolio, unitInCity } from '@/lib/local-evidence';
import { RegionalIcon } from './RegionalIcons';
import styles from './RegionalPage.module.css';

export async function getRegionalEvidence(city: string) {
    const unit = unitInCity(city);
    let allProjects: PublicProject[] = [];
    try { allProjects = await getAllContent('projects'); } catch { /* Preserve service and contact during a portfolio outage. */ }
    return { unit, ...regionalPortfolio(allProjects, city) };
}
export type RegionalProof = Awaited<ReturnType<typeof getRegionalEvidence>>;

function ProjectCard({ project }: { project: PublicProject }) {
    const city = projectCity(project);
    const photo = project.photos?.find(value => /^https?:\/\//.test(value) || /^\/(?!\/)/.test(value));
    const kwp = Number(project.kwp);
    const location = /cond[.\s]|condom[ií]nio/i.test(project.location) ? project.location : `${city} · RO`;
    const alt = `Foto do projeto ${project.name}, ${location}`;
    const optimized = photo && (/^\/(?!\/)/.test(photo) || photo.startsWith('https://api.dwalt.net/'));
    return <article className={styles.projectCard} data-regional-reveal>
        <Link href={`/projetos/${project.id}`} className={styles.projectLink} aria-label={`Ver projeto ${project.name} em ${city}`}>
            <div className={styles.projectPhoto}>
                {photo ? optimized ? <Image src={photo} alt={alt} fill quality={65} sizes="(max-width: 899px) calc(100vw - 44px), (max-width: 1180px) 50vw, 590px" loading="lazy" /> : <img src={photo} alt={alt} width={960} height={640} loading="lazy" decoding="async" /> : <div className={styles.projectPlaceholder}>Conheça os dados deste projeto no portfólio.</div>}
                <span className={styles.projectCategory}>{project.category}</span>
                {Number.isFinite(kwp) && kwp > 0 && <span className={styles.projectKwp}>{kwp.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} <small>kWp</small></span>}
            </div>
            <div className={styles.projectInfo}>
                <span className={styles.projectPlace}><RegionalIcon name="pin" />{location}</span><h3>{project.name}</h3>
                <p>{project.category.toLocaleLowerCase('pt-BR').includes('residen') ? 'Instalação residencial' : 'Sistema de energia solar'} em {city}, publicado no portfólio da DWalt.</p>
                <div className={styles.projectFoot}><span>{project.panelCount > 0 ? `${project.panelCount.toLocaleString('pt-BR')} painéis solares` : 'Dados no portfólio'}</span><span className={styles.projectOpen}>Ver projeto <RegionalIcon name="arrow" /></span></div>
            </div>
        </Link>
    </article>;
}

export function RegionalEvidence({ city, evidence, serviceSlug }: { city: string; evidence: RegionalProof; serviceSlug: string }) {
    const { projects, isLocal } = evidence;
    if (!projects.length) return <section className={styles.section} id="projetos-locais"><div className={styles.wrap}><p className={styles.eyebrow}>Portfólio DWalt</p><h2>Conheça nossos projetos<br /><span>em Rondônia.</span></h2><Link className={`${styles.textLink} ${styles.portfolioLink}`} href="/projetos">Ver o portfólio completo <RegionalIcon name="arrow" /></Link></div></section>;
    const solar = ['energia-solar', 'energia-solar-residencial'].includes(serviceSlug);
    const featured = projects[0];
    const power = Number(featured.kwp);
    return <section className={`${styles.section} ${styles.projectsSection}`} id="projetos-locais" aria-label={isLocal ? `Projetos da DWalt em ${city}` : 'Projetos da DWalt em Rondônia'}>
        <div className={styles.wrap}>
            <div className={styles.sectionHeading} data-regional-reveal>
                <div><p className={styles.eyebrow}>Projetos reais · Fotos do nosso portfólio</p><h2>{isLocal ? <>{solar ? 'Projetos de energia solar' : 'Projetos da DWalt'}<br /><span>em {city}.</span></> : <>Projetos que levam a DWalt<br /><span>por Rondônia.</span></>}</h2></div>
                <p className={styles.sectionIntro}>{isLocal ? `Conheça ${projects.length === 1 ? 'um projeto' : 'projetos'} da DWalt em ${city}, com fotos e dados publicados no nosso portfólio.` : 'Conheça instalações da DWalt em Rondônia. Cada projeto informa sua cidade de execução e os dados publicados no portfólio.'}</p>
            </div>
            <div className={`${styles.projectGrid} ${projects.length > 2 ? styles.count3 : ''}`}>
                {projects.map(project => <ProjectCard key={project.id} project={project} />)}
                {isLocal && projects.length === 1 && <aside className={styles.projectStory} data-regional-reveal><span className={styles.eyebrow}>Um projeto em {city}</span><h3>Um sistema pensado<br />para o imóvel.</h3><p>O portfólio de {city} apresenta {featured.name}{Number.isFinite(power) && power > 0 ? <> com <strong>{power.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kWp{featured.panelCount > 0 && ` e ${featured.panelCount} painéis`}</strong></> : ''}.</p><p>Para o seu imóvel, o ponto de partida é entender o perfil de consumo e o espaço disponível.</p><Link className={styles.textLink} href={`/projetos/${featured.id}`}>Conhecer esse projeto <RegionalIcon name="arrow" /></Link></aside>}
            </div>
            {!isLocal && <p className={styles.evidenceNote}>As cidades de cada instalação estão identificadas nos cartões. Converse com a equipe sobre o atendimento em {city}.</p>}
            <Link className={`${styles.textLink} ${styles.portfolioLink}`} href="/projetos">Ver o portfólio completo <RegionalIcon name="arrow" /></Link>
        </div>
    </section>;
}
