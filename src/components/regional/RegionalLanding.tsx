import Link from 'next/link';
import { COMPANY_INFO } from '@/lib/data/company';
import { SOLAR_SERVICES, type ServiceContent } from '@/lib/constants/services';
import { regionalSlug } from '@/lib/regional-pages';
import { regionalCopy } from './content';
import { getRegionalEvidence, RegionalEvidence } from './RegionalEvidence';
import { RegionalMotion } from './RegionalMotion';
import styles from './RegionalPage.module.css';

const Arrow = () => <span className={styles.arrow} aria-hidden="true">↗</span>;

export async function RegionalLanding({ city, service }: { city: string; service: ServiceContent }) {
    const copy = regionalCopy(service.slug);
    const displayTitle = service.title.charAt(0) + service.title.slice(1).toLocaleLowerCase('pt-BR');
    const destination = service.ctaUrl || '/solicitar-orcamento';
    const external = service.ctaUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    const whatsapp = `https://wa.me/${COMPANY_INFO.contact.whatsapp}?text=${encodeURIComponent(`Olá! Tenho interesse em ${service.title} em ${city}.`)}`;
    const evidence = service.slug === 'afiliados' ? null : await getRegionalEvidence(city);
    const closeTitle = copy.closing?.title || ['Sua próxima conquista', 'pode começar no telhado.'];
    const links = <><a href="#beneficios-regionais">{service.slug === 'afiliados' ? 'Como participar' : 'Por que energia solar'}</a><Link href={service.slug === 'afiliados' ? '/areas-de-atendimento' : evidence?.projects.length ? '#projetos-locais' : '/projetos'}>{service.slug === 'afiliados' ? 'Cidades atendidas' : evidence?.projects.length ? 'Projetos na cidade' : 'Projetos realizados'}</Link><a className={styles.navCta} href="#comece-seu-projeto">Seu projeto começa aqui <Arrow /></a></>;

    return <div className={styles.page} id="regional-page" data-regional-model="01">
        <RegionalMotion key={`${service.slug}:${city}`} />
        <header className={styles.inner} id="inicio-regional">
            <nav className={styles.siteNav} aria-label="Navegação da página regional">
                <Link href="/" aria-label="DWalt Energia"><img className={styles.logo} src="/logo-branca.svg" alt="DWalt Energia" width={139} height={35} /></Link>
                <div className={styles.navLinks}>{links}</div>
                <details className={styles.mobileMenu} data-regional-menu>
                    <summary aria-label="Abrir menu da página regional"><span /><span /></summary>
                    <nav className={styles.mobileNav} aria-label="Menu móvel da página regional">{links}</nav>
                </details>
            </nav>
        </header>
        <main>
            <section className={styles.hero}>
                <div className={styles.inner}>
                    <p className={styles.eyebrow}><span className={styles.dot} aria-hidden="true" />Energia que vem do alto</p>
                    <h1 className={styles.heroTitle}><span className={styles.place}>{displayTitle} em {city}.</span>{copy.headline[0]}<br /><em>{copy.headline[1]}</em></h1>
                    <p className={styles.lede}>{copy.lead}</p>
                    <div className={styles.actions}>
                        <Link className={styles.button} href={destination} {...external}>{copy.cta}<Arrow /></Link>
                        <a className={`${styles.button} ${styles.secondary}`} href={whatsapp} target="_blank" rel="noopener noreferrer">Conversar com a DWalt</a>
                    </div>
                    <p className={styles.microcopy}>{service.slug === 'afiliados' ? 'Consulte as regras e condições de participação no portal.' : 'Proposta personalizada para o seu consumo e o seu imóvel.'}</p>
                </div>
            </section>
            <div className={styles.inner}><div className={styles.trustLine}>
                <div><b>Engenharia própria</b><small>Do dimensionamento à instalação.</small></div>
                <div><b>Atendimento local</b><small>Uma equipe para conversar com você.</small></div>
                <div><b>Desde 2016</b><small>Experiência em energia solar.</small></div>
            </div></div>
            <section className={styles.section} id="beneficios-regionais">
                <div className={styles.inner}>
                    <div className={styles.sectionTop} data-regional-reveal><div><p className={styles.eyebrow}>{service.slug === 'afiliados' ? 'Uma oportunidade para conhecer' : 'Pensado para o seu imóvel'}</p><h2>{copy.benefitTitle[0]}<br />{copy.benefitTitle[1]}</h2></div><p>{copy.benefitIntro}</p></div>
                    <div className={styles.trio}>{copy.benefits.map((benefit, index) => <div className={styles.benefit} key={benefit.title} data-regional-reveal style={{ transitionDelay: `${index * 70}ms` }}><span className={styles.number}>0{index + 1}</span><h3>{benefit.title}</h3><p>{benefit.description}</p></div>)}</div>
                </div>
            </section>
            {evidence && <RegionalEvidence city={city} evidence={evidence} />}
            <section className={styles.section}><div className={`${styles.inner} ${styles.faq}`}>
                <div data-regional-reveal><p className={styles.eyebrow}>Uma decisão bem informada</p><h2>Antes de começar,<br />vamos conversar.</h2></div>
                <div data-regional-reveal>{copy.faq.map(item => <details key={item.question}><summary>{item.question}</summary><p>{item.answer}</p></details>)}</div>
            </div></section>
            <section className={styles.close} id="comece-seu-projeto" aria-label="Comece seu projeto solar">
                <div className={styles.house}><img src="/regional-casa-modelo01.webp" alt="Imagem ilustrativa de uma casa com painéis solares ao pôr do sol" width={1400} height={792} loading="lazy" decoding="async" /><span className={styles.illustration}>Imagem ilustrativa</span></div>
                <div className={styles.closeContent}><div className={styles.inner}>
                    <p className={styles.eyebrow} data-regional-reveal>Seu projeto começa aqui</p>
                    <h2 data-regional-reveal>{closeTitle[0]}<br />{closeTitle[1]}</h2>
                    <p className={styles.closeCopy} data-regional-reveal>{copy.closing?.text || 'Comece pela sua conta de energia. A DWalt ajuda você a entender as possibilidades para o seu imóvel.'}</p>
                    <div className={styles.actions} data-regional-reveal><Link className={styles.button} href={destination} {...external}>{copy.closing?.cta || 'Solicitar meu orçamento'}<Arrow /></Link></div>
                    <p className={styles.microcopy}>Atendimento humano para orientar sua decisão.</p>
                </div></div>
            </section>
        </main>
        <footer className={styles.siteFooter}><div className={styles.inner}>
            <div className={styles.footerTop}><div><p className={styles.footerName}>DWALT ENERGIA</p><p className={styles.footerSlogan}>Energia que vem do alto.</p></div><div className={styles.footerContact}><strong>{COMPANY_INFO.contact.phone}</strong><a href={whatsapp} target="_blank" rel="noopener noreferrer">Converse pelo WhatsApp</a><br />Ariquemes · Rondônia</div></div>
            <div className={styles.footerBottom}><span>© 2026 DWalt Energia</span><span>Ariquemes · Porto Velho · Rolim de Moura</span><a href="#inicio-regional">Voltar ao início ↑</a></div>
            <nav className={styles.footerLinks} aria-label="Mais informações"><Link href="/areas-de-atendimento">Cidades atendidas</Link><Link href="/projetos">Portfólio</Link><Link href="/unidades">Nossas unidades</Link><Link href="/blog">Conteúdo</Link></nav>
            <details className={styles.related}><summary>Outras soluções em {city}</summary><ul>{SOLAR_SERVICES.filter(item => item.slug !== service.slug).map(item => <li key={item.slug}><Link href={`/${regionalSlug(item.slug, city)}`}>{item.title} em {city}</Link></li>)}</ul></details>
        </div></footer>
    </div>;
}
