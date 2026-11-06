import Link from 'next/link';
import { ArrowRight, Sun } from 'lucide-react';
import { HomeMotion } from './HomeMotion';
import styles from './HomePremium.module.css';

export function HomeHero() {
  return <section id="home" className={styles.hero}>
    <picture className={styles.backdrop}>
      <source media="(max-width: 767px)" srcSet="/home-usina-640.webp" />
      <img src="/home-usina-1280.webp" alt="" width={1280} height={732} fetchPriority="high" className={styles.scene} />
    </picture>
    <HomeMotion />
    <div className={styles.shade} />
    <div className={styles.heroContent}>
      <p className={styles.badge}><Sun size={16} aria-hidden="true" /> Energia solar em Rondônia</p>
      <h1>Transforme o Sol em<br /><span>Economia Real</span></h1>
      <p className={styles.intro}>Energia solar para sua casa ou empresa.<br className={styles.desktopBreak} /> Projeto, instalação e suporte em Rondônia.</p>
      <div className={styles.actions}>
        <Link href="/calculadora-solar" className={styles.primary}>Simular Economia <ArrowRight size={22} aria-hidden="true" /></Link>
        <Link href="/projetos" className={styles.secondary}>Conheça nossos projetos</Link>
      </div>
    </div>
    <a href="#about" className={styles.scrollHint}>Explore a DWalt<span aria-hidden="true" /></a>
  </section>;
}
