import { Home, Building2, Zap, Wrench } from 'lucide-react';
import styles from './HomePremium.module.css';

export function HomeAbout() {
  return <section id="about" className={styles.about}>
    <div className={styles.editorial}>
      <div className={styles.aboutCopy}>
        <p className={styles.eyebrow}>Sobre a DWalt <span aria-hidden="true" /></p>
        <h2>Energia que vem<br />do alto.</h2>
        <p className={styles.aboutIntro}>Projetos personalizados.<br />Cuidado em cada etapa.</p>
      </div>
      <div className={styles.aboutPhoto} role="img" aria-label="Usina solar, imagem ilustrativa" />
      <details className={styles.history}>
        <summary>Conheça nossa história e nossa equipe <span aria-hidden="true">+</span></summary>
        <p>Somos especialistas em transformar a maneira como você consome energia. Com mais de 2000 projetos executados, levamos economia, sustentabilidade e inovação para lares e empresas em todo o estado.</p>
        <p>Nossa missão é democratizar o acesso à energia solar com soluções técnicas de excelência e viabilidade financeira.</p>
        <ul>{['Equipe Técnica Certificada', 'Garantia de até 25 anos', 'Projetos Personalizados', 'Suporte Pós-venda', 'Financiamento Facilitado', 'Homologação Agilizada'].map(item => <li key={item}>{item}</li>)}</ul>
      </details>
    </div>
  </section>;
}
const services = [
  { title: 'Residencial', icon: Home, position: 'left', description: 'Reduza a conta de luz da sua casa e valorize seu imóvel com energia limpa.' },
  { title: 'Comercial', icon: Building2, position: 'center', description: 'Aumente a competitividade da sua empresa reduzindo custos fixos.' },
  { title: 'Usinas solares', icon: Zap, position: 'right', description: 'Grandes projetos para investidores e alto consumo energético.' },
];
export function HomeServices() {
  return <section id="services" className={styles.services}>
    <div className={styles.editorial}>
      <div className={styles.sectionTitle}><h2>Serviços</h2><span aria-hidden="true" /></div>
      <div className={styles.serviceGrid}>{services.map(service => <article key={service.title} className={styles.serviceCard} data-home-card>
        <div className={styles.servicePhoto} style={{backgroundPosition: service.position}} role="img" aria-label={`${service.title}: energia solar, imagem ilustrativa`} />
        <h3><service.icon aria-hidden="true" />{service.title}</h3>
        <p>{service.description}</p>
      </article>)}</div>
      <p className={styles.maintenance}><Wrench size={18} aria-hidden="true" /><span><strong>Manutenção e limpeza.</strong> Cuidado preventivo para manter a eficiência do seu sistema.</span></p>
    </div>
  </section>;
}
