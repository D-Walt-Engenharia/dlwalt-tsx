'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HomePremium.module.css';
const clip = '/api/home-animation?v=modelo01-v2';

export function HomeMotion() {
  const video = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const root = document.getElementById('dwalt-home');
    const media = video.current;
    if (!root || !media) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    let disposed = false;
    let reveal: IntersectionObserver | undefined;
    const animations: Animation[] = [];

    // Observe the actual text throughout the homepage. Content stays readable
    // without JavaScript; animation does not depend on hidden CSS attributes.
    if (!preference.matches && 'IntersectionObserver' in window) {
      reveal = new IntersectionObserver(entries => entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        reveal?.unobserve(entry.target);
        const element = entry.target as HTMLElement;
        if (typeof element.animate === 'function') animations.push(element.animate([
          { opacity: 0, transform: 'translateY(18px)' },
          { opacity: 1, transform: 'translateY(0)' },
        ], { duration: 650, easing: 'cubic-bezier(.2,.65,.3,1)' }));
      }), { threshold: 0.12 });
      root.querySelectorAll<HTMLElement>('section h1, section h2, section h3, section p, [data-home-card]').forEach(element => {
        // A service card enters as a unit; avoid animating its children twice.
        if (element.parentElement?.closest('[data-home-card]')) return;
        reveal?.observe(element);
      });
    }
    media.muted = true;
    media.defaultMuted = true;
    media.loop = true;
    const attemptPlay = () => {
      if (disposed || document.hidden || preference.matches) return;
      if (!media.getAttribute('src')) { media.src = clip; media.load(); }
      void media.play().catch(() => {
        // iOS may require a gesture. The first page interaction retries inline,
        // without adding a visible player control or changing navigation.
      });
    };
    const onEnded = () => { media.currentTime = 0; attemptPlay(); };
    const onPreference = () => {
      if (preference.matches) {
        media.pause(); setLoaded(false);
        animations.forEach(animation => animation.cancel());
        reveal?.disconnect();
      } else attemptPlay();
    };
    document.addEventListener('visibilitychange', attemptPlay);
    document.addEventListener('pointerdown', attemptPlay, { passive: true });
    document.addEventListener('keydown', attemptPlay);
    preference.addEventListener('change', onPreference);
    media.addEventListener('canplay', attemptPlay);
    media.addEventListener('pause', attemptPlay);
    media.addEventListener('ended', onEnded);
    const timer = window.setTimeout(attemptPlay, 450);
    return () => {
      disposed = true;
      clearTimeout(timer);
      reveal?.disconnect();
      animations.forEach(animation => animation.cancel());
      document.removeEventListener('visibilitychange', attemptPlay);
      document.removeEventListener('pointerdown', attemptPlay);
      document.removeEventListener('keydown', attemptPlay);
      preference.removeEventListener('change', onPreference);
      media.removeEventListener('canplay', attemptPlay);
      media.removeEventListener('pause', attemptPlay);
      media.removeEventListener('ended', onEnded);
      media.pause();
    };
  }, []);
  return <video ref={video} className={styles.motion} data-loaded={loaded ? 'true' : undefined} autoPlay muted loop playsInline preload="none" aria-hidden="true" tabIndex={-1}
    onPlaying={() => setLoaded(true)} onError={() => setLoaded(false)} />;
}
