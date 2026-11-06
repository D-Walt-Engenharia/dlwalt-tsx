import Link from 'next/link';
import { Fragment } from 'react';
import { COMPANY_INFO } from '@/lib/data/company';
import { SOLAR_SERVICES, type ServiceContent } from '@/lib/constants/services';
import { regionalSlug } from '@/lib/regional-pages';
import { regionalHeroIntro, regionalLocalCopy } from '@/lib/regional-local-content';
import { getRegionalEvidence, RegionalEvidence } from './RegionalEvidence';
import { localPageContent, localPageQuestions } from './local-page-content';
import { RegionalIcon, WhatsAppIcon } from './RegionalIcons';
import { RegionalMotion } from './RegionalMotion';
import styles from './RegionalPage.module.css';

const Arrow = () => <RegionalIcon name="arrow" />;

function addressLines(address: string) {
    const value = address.replace(/^R\. Mte\. Gabriel/, 'Rua Mestre Gabriel').replace(/,?\s*\d{5}-\d{3}/, '');
    const match = value.match(/^(.+?,\s*\d+)\s*(?:\(([^)]+)\))?\s*(?:[,-]\s*)?(.*)$/);
    if (match) return { main: match[1], detail: [match[2], match[3]].filter(Boolean) };
    const [main, ...detail] = value.split(' - ');
    return { main, detail };
}

export async function RegionalLanding({ city, service }: { city: string; service: ServiceContent }) {
    const copy = localPageContent(city, service.slug);
    const local = regionalLocalCopy(city);
    const evidence = await getRegionalEvidence(city);
    const questions = localPageQuestions(city, service.slug, evidence);
    const displayTitle = service.title.charAt(0) + service.title.slice(1).toLocaleLowerCase('pt-BR');
    const destination = service.ctaUrl || '/solicitar-orcamento';
    const external = service.ctaUrl ? { target: '_blank', rel: 'noopener noreferrer' } : {};
    const affiliate = service.slug === 'afiliados';
    const whatsapp = `https://wa.me/${COMPANY_INFO.contact.whatsapp}?text=${encodeURIComponent(`Olá! Quero conversar sobre ${service.title.toLocaleLowerCase('pt-BR')} em ${city}.`)}`;
    const contactUnit = evidence.unit || COMPANY_INFO.units[0];
    const contactTitle = evidence.unit ? `${contactUnit.id === 'matriz' ? 'Matriz' : 'Unidade'} · ${city}` : 'Contato da matriz · Ariquemes';
    const address = addressLines(contactUnit.address);
    const confirmLocation = contactUnit.id === 'rolim-de-moura';
    const map = confirmLocation ? whatsapp : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${address.main}, ${contactUnit.city} - RO`)}`;
    const navigation = <><a href="#projetos-locais">Projetos</a><a href="#atendimento-local">Atendimento local</a><a href="#duvidas-regionais">Dúvidas</a><Link className={styles.smallCta} href={destination} {...external}>{affiliate ? 'Conhecer o programa' : 'Solicitar orçamento'} <Arrow /></Link></>;
    const energy = ['energia-solar', 'energia-solar-residencial'].includes(service.slug);
    return <div className={styles.page} id="regional-page" data-regional-model="premium-local">
        <RegionalMotion key={`${service.slug}:${city}`} />
        <header className={styles.siteHeader} id="inicio-regional"><div className={`${styles.wrap} ${styles.headerInner}`}>
            <Link href="/" aria-label="DWalt Energia"><img className={styles.brand} src="/logo-branca.svg" alt="DWalt Energia" width={148} height={38} /></Link>
            <nav className={styles.desktopNav} aria-label="Navegação da página regional">{navigation}</nav>
            <details className={styles.mobileMenu} data-regional-menu><summary aria-label="Abrir menu da página regional"><span /><span /></summary><nav aria-label="Menu móvel da página regional">{navigation}</nav></details>
        </div></header>
        <main>
            <section className={styles.hero} aria-labelledby="regional-title">
                <figure className={styles.heroImage}><picture><source media="(max-width: 899px)" srcSet="/regional-casa-modelo01-700.webp" /><img src="/regional-casa-modelo01.webp" alt="Casa com painéis solares ao entardecer; imagem ilustrativa" width={1400} height={788} fetchPriority="high" decoding="async" /></picture><figcaption>Imagem ilustrativa</figcaption></figure>
                <div className={`${styles.wrap} ${styles.heroWrap}`}><div className={styles.heroCopy}>
                    <div className={styles.cityBadge}><RegionalIcon name="pin" />{city} · Rondônia</div>
                    <p className={`${styles.eyebrow} ${styles.heroEyebrow}`}>Energia que vem do alto.</p>
                    <h1 id="regional-title">{displayTitle}<br />em <span>{city}.</span></h1>
                    <p className={styles.heroPromise}>{copy.promise[0]}<br />{copy.promise[1]}</p>
                    <p className={styles.heroDescription}>{regionalHeroIntro(city, service.slug)}</p>
                    <div className={styles.heroActions}><Link className={`${styles.button} ${styles.primary}`} href={destination} {...external}>{copy.cta}<Arrow /></Link><a className={styles.heroSecondary} href="#projetos-locais">Ver projetos com fotos <span aria-hidden="true">↓</span></a></div>
                    <p className={styles.heroNote}>{affiliate ? 'Consulte as regras e condições de participação no portal.' : energy ? 'Para sua casa, sua empresa e seu imóvel rural.' : 'Avaliação e proposta de acordo com a sua necessidade.'}</p>
                </div></div>
            </section>
            <div className={styles.trustStrip}><div className={`${styles.wrap} ${styles.trustInner}`}><span><RegionalIcon name="shield" />Engenharia própria</span><span><RegionalIcon name="sun" />Desde 2016</span><span><RegionalIcon name="phone" />Atendimento DWalt</span></div></div>
            <RegionalEvidence city={city} evidence={evidence} serviceSlug={service.slug} />
            <section className={`${styles.section} ${styles.localSection}`} id="atendimento-local"><div className={`${styles.wrap} ${styles.localGrid}`}>
                <div className={styles.localCopy} data-regional-reveal>
                    <p className={styles.eyebrow}>{local.kicker}</p><h2>{affiliate ? `Conecte oportunidades em ${city}.` : local.title}</h2>
                    <p>{affiliate ? `Para conhecer o programa e tirar dúvidas sobre indicações em ${city}, converse com a equipe da DWalt. As regras e as condições de participação estão disponíveis no portal de afiliados.` : local.text}</p>
                    <div className={styles.localChips} aria-label="Referências locais">{(affiliate ? [city, 'Rondônia'] : local.references).map(reference => <span key={reference}>{reference}</span>)}</div>
                    <p className={styles.localDetail}>{affiliate ? 'O cadastro e o acompanhamento das indicações são realizados no portal. Confirme os critérios do programa antes de participar.' : local.detail}</p>
                    <a className={styles.textLink} href={whatsapp} target="_blank" rel="noopener noreferrer">Conversar sobre atendimento em {city} <Arrow /></a>
                </div>
                <aside className={styles.addressCard} data-regional-reveal>
                    <div className={styles.addressTop}><span className={styles.pinTile}><RegionalIcon name="pin" /></span><span className={styles.eyebrow}>Ponto de atendimento</span></div>
                    <h3>{contactTitle}</h3><address><strong>{address.main}</strong><span>{address.detail.map((line, index) => <Fragment key={line}>{index > 0 && <br />}{line}</Fragment>)}</span>{!evidence.unit && <span>Atendimento em {city} sob agendamento</span>}</address>
                    <a className={styles.mapLink} href={map} target="_blank" rel="noopener noreferrer">{confirmLocation ? 'Confirmar localização com a equipe' : 'Ver endereço no mapa'} <Arrow /></a>
                    <div className={styles.addressPhone}><span>Fale com a equipe</span><a href={`tel:+${COMPANY_INFO.contact.whatsapp}`}>{COMPANY_INFO.contact.phone}</a></div>
                </aside>
            </div></section>
            <section className={`${styles.section} ${styles.solutionsSection}`} id="beneficios-regionais"><div className={styles.wrap}>
                <div className={styles.sectionHeading} data-regional-reveal><div><p className={styles.eyebrow}>{affiliate ? 'Conheça as etapas do programa' : 'O seu consumo é o ponto de partida'}</p><h2>{copy.benefitTitle[0]}<br /><span>{copy.benefitTitle[1]}</span></h2></div><p className={styles.sectionIntro}>{copy.benefitIntro}</p></div>
                <div className={styles.solutionsGrid}>{copy.solutions.map(solution => <article className={styles.solution} key={solution.title} data-regional-reveal><RegionalIcon name={solution.icon} /><h3>{solution.title}</h3><p>{solution.text}</p></article>)}</div>
                <div className={styles.journey} data-regional-reveal>{copy.journey.map(([title, text], index) => <div key={title}><span>0{index + 1}</span><p><strong>{title}</strong>{text}</p></div>)}</div>
            </div></section>
            <section className={`${styles.section} ${styles.faqSection}`} id="duvidas-regionais"><div className={`${styles.wrap} ${styles.faqGrid}`}>
                <div data-regional-reveal><p className={styles.eyebrow}>Respostas para decidir melhor</p><h2>{displayTitle}<br />em {city}:<br /> <span>suas dúvidas.</span></h2><p>Uma conversa clara vem antes de qualquer proposta.</p></div>
                <div className={styles.faqs} data-regional-reveal>{questions.map(item => <details key={item.question}><summary>{item.question}<span aria-hidden="true">+</span></summary><p>{item.answer}</p></details>)}</div>
            </div></section>
            <section className={styles.closing} id="comece-seu-projeto"><div className={`${styles.wrap} ${styles.closingInner}`} data-regional-reveal>
                <div><p className={styles.eyebrow}>{affiliate ? 'Conheça as condições para participar' : 'O próximo projeto pode ser o seu'}</p><h2>{affiliate ? <>Sua próxima indicação<br />pode começar aqui.</> : service.slug === 'manutencao-e-limpeza' ? <>Vamos cuidar da energia<br />que o seu sistema produz?</> : service.slug === 'engenharia-eletrica' ? <>Vamos conversar sobre<br />o seu projeto elétrico?</> : <>Vamos olhar para a<br />sua conta de energia?</>}</h2><p>Converse com a DWalt sobre {affiliate ? 'o programa de afiliados' : 'o seu imóvel'} em {city}.</p></div>
                <div className={styles.closingActions}><Link className={`${styles.button} ${styles.primary}`} href={destination} {...external}>{affiliate ? 'Acessar o portal de afiliados' : service.slug === 'manutencao-e-limpeza' ? 'Solicitar uma avaliação' : 'Solicitar meu orçamento'} <Arrow /></Link><a className={`${styles.button} ${styles.outline}`} href={whatsapp} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Falar pelo WhatsApp</a></div>
            </div></section>
        </main>
        <footer className={styles.siteFooter}><div className={styles.wrap}>
            <div className={styles.footerMain}>
                <div><Link href="/" aria-label="DWalt Energia"><img className={styles.brand} src="/logo-branca.svg" alt="DWalt Energia" width={148} height={38} loading="lazy" /></Link><p>Energia que vem do alto.</p></div>
                <div className={styles.footerContact}><strong>{contactTitle}</strong><p>{address.main}<br />{address.detail.join(' · ')}{!evidence.unit && <><br />Atendimento em {city} sob agendamento</>}</p><a href={`tel:+${COMPANY_INFO.contact.whatsapp}`}>{COMPANY_INFO.contact.phone}</a></div>
                <nav aria-label="Mais informações"><Link href="/projetos">Projetos</Link><Link href="/areas-de-atendimento">Cidades atendidas</Link><Link href="/unidades">Nossas unidades</Link><Link href="/blog">Conteúdo sobre energia</Link></nav>
            </div>
            <nav className={styles.breadcrumbs} aria-label="Navegação por cidade"><Link href="/">Início</Link><span aria-hidden="true">›</span><Link href="/areas-de-atendimento">Cidades atendidas</Link><span aria-hidden="true">›</span><span>{service.title} em {city}</span></nav>
            <details className={styles.moreServices}><summary>Outras soluções em {city}</summary><nav aria-label={`Serviços em ${city}`}>{SOLAR_SERVICES.filter(other => other.slug !== service.slug).map(other => <Link key={other.slug} href={`/${regionalSlug(other.slug, city)}`}>{other.title} em {city}</Link>)}</nav></details>
            <div className={styles.footerBottom}><span>© 2026 DWalt Energia · {city}, RO</span><span>Ariquemes · Porto Velho · Rolim de Moura</span></div>
        </div></footer>
        <a id="regional-whatsapp" className={styles.floatingWhatsapp} href={whatsapp} target="_blank" rel="noopener noreferrer" aria-label={`Falar com a DWalt pelo WhatsApp sobre ${service.title} em ${city}`}><span className={styles.whatsappTooltip}>Fale com a DWalt</span><WhatsAppIcon /></a>
    </div>;
}
