'use client';

import { useEffect, useRef, useState } from 'react';
import styles from './HomePremium.module.css';

/** Homepage-only enhancement: readable without JS, no scroll event handler. */
export function HomeMotion() {
  const video = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(false);
  const userPaused = useRef(false);

  useEffect(() => {
    const root = document.getElementById('dwalt-home');
    if (!root) return;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
    let reveal: IntersectionObserver | undefined;
    let visibility: IntersectionObserver | undefined;
    const targets: HTMLElement[] = [];
    if (!preference.matches && 'IntersectionObserver' in window) {
      reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.removeAttribute('data-home-reveal');
          reveal?.unobserve(entry.target);
        }
      }), { threshold: 0.08 });
      root.querySelectorAll<HTMLElement>('section:not(#home) h2, section:not(#home) h2 + p, #services .grid > div, #projects .grid > a').forEach(element => {
        // Never hide content already on screen, or accordion/carousel internals.
        if (element.getBoundingClientRect().top < window.innerHeight) return;
        element.setAttribute('data-home-reveal', '');
        targets.push(element);
        reveal?.observe(element);
      });
    }
    let cancelled = false;
    const showPoster = () => {
      video.current?.pause();
      setReady(false);
      targets.forEach(element => element.removeAttribute('data-home-reveal'));
    };
    preference.addEventListener('change', showPoster);
    const onVisibility = () => {
      if (document.hidden) video.current?.pause();
      else if (!userPaused.current && !preference.matches && video.current && video.current.getBoundingClientRect().bottom > 0) void video.current.play().catch(() => {});
    };
    document.addEventListener('visibilitychange', onVisibility);
    // Poster is the LCP; defer the local, silent clip until initial page assets settle.
    const timer = window.setTimeout(() => {
      if (!cancelled && !preference.matches && !connection?.saveData && !/(^|-)2g$/.test(connection?.effectiveType || '')) setReady(true);
    }, 2200);
    if ('IntersectionObserver' in window) visibility = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!video.current) return;
      if (entry.isIntersecting && !document.hidden && !preference.matches && !userPaused.current) void video.current.play().catch(() => {});
      else video.current.pause();
    }));
    visibility?.observe(root.querySelector('#home')!);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
      reveal?.disconnect();
      visibility?.disconnect();
      targets.forEach(element => element.removeAttribute('data-home-reveal'));
      preference.removeEventListener('change', showPoster);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  if (!ready) return null;
  return <><video ref={video} className={styles.motion} src="/home-usina-drone.mp4" autoPlay muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1} onCanPlay={event => {
    event.currentTarget.dataset.loaded = 'true';
    if (!userPaused.current && !document.hidden && event.currentTarget.getBoundingClientRect().bottom > 0) void event.currentTarget.play().catch(() => {});
  }} /><button type="button" className={styles.motionControl} aria-label={paused ? 'Reproduzir animação de fundo' : 'Pausar animação de fundo'} onClick={() => {
    userPaused.current = !userPaused.current;
    setPaused(userPaused.current);
    if (userPaused.current) video.current?.pause();
    else void video.current?.play().catch(() => {});
  }}>{paused ? '▶' : 'Ⅱ'} <span>{paused ? 'Reproduzir' : 'Pausar'}</span></button></>;
}
