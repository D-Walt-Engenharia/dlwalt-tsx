'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HomePremium.module.css';
const clip = '/home-modelo01-drone-v2.mp4';

export function HomeMotion() {
  const video = useRef<HTMLVideoElement>(null);
  const userPaused = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const root = document.getElementById('dwalt-home');
    const hero = document.getElementById('home');
    const media = video.current;
    if (!root || !hero || !media) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    const targets: HTMLElement[] = [];
    let reveal: IntersectionObserver | undefined;
    let visible = true;
    let visibility: IntersectionObserver | undefined;
    media.muted = true;
    media.defaultMuted = true;
    const attemptPlay = () => {
      if (document.hidden || !visible || userPaused.current || preference.matches) return;
      void media.play().catch(() => setPlaying(false));
    };
    if (!preference.matches && 'IntersectionObserver' in window) {
      reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.removeAttribute('data-home-reveal');
        reveal?.unobserve(entry.target);
      }), { threshold: 0.08 });
      root.querySelectorAll<HTMLElement>('section:not(#home) h2, section:not(#home) h2 + p, [data-home-card]').forEach(element => {
        if (element.getBoundingClientRect().top < innerHeight) return;
        element.setAttribute('data-home-reveal', '');
        targets.push(element);
        reveal?.observe(element);
      });
    }
    if ('IntersectionObserver' in window) {
      visibility = new IntersectionObserver(entries => {
        visible = entries[0]?.isIntersecting ?? false;
        if (!visible) media.pause();
        else if (media.getAttribute('src')) attemptPlay();
      });
      visibility.observe(hero);
    }
    const onVisibility = () => { if (document.hidden) media.pause(); else attemptPlay(); };
    const onPreference = () => {
      if (preference.matches) {
        media.pause(); setLoaded(false);
        targets.forEach(element => element.removeAttribute('data-home-reveal'));
      } else attemptPlay();
    };
    document.addEventListener('visibilitychange', onVisibility);
    preference.addEventListener('change', onPreference);
    const timer = window.setTimeout(() => {
      if (preference.matches || connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
      media.src = clip; media.load(); attemptPlay();
    }, 450);
    return () => {
      clearTimeout(timer); reveal?.disconnect(); visibility?.disconnect();
      document.removeEventListener('visibilitychange', onVisibility);
      preference.removeEventListener('change', onPreference);
      targets.forEach(element => element.removeAttribute('data-home-reveal'));
      media.pause();
    };
  }, []);
  return <>
    <video ref={video} className={styles.motion} data-loaded={loaded ? 'true' : undefined} autoPlay muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}
      onPlaying={() => { setLoaded(true); setPlaying(true); }}
      onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} onError={() => { setLoaded(false); setPlaying(false); }} />
    <button type="button" className={styles.motionControl} aria-label={playing ? 'Pausar animação de fundo' : 'Reproduzir animação de fundo'} onClick={() => {
      const media = video.current;
      if (!media) return;
      if (!media.paused) { userPaused.current = true; media.pause(); return; }
      userPaused.current = false; media.muted = true; media.defaultMuted = true;
      if (!media.getAttribute('src')) { media.src = clip; media.load(); }
      // Remains inside the tap gesture for iOS autoplay restrictions.
      void media.play().then(() => { setLoaded(true); setPlaying(true); }).catch(() => setPlaying(false));
    }}><span aria-hidden="true">{playing ? 'Ⅱ' : '▶'}</span> {playing ? 'Pausar' : 'Reproduzir animação'}</button>
  </>;
}
