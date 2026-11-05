'use client';
import { useEffect, useState } from 'react';

/** Keep the decorative third-party player off mobile and the initial render. */
export function HeroVideo() {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        if (!window.matchMedia('(min-width: 1024px) and (pointer: fine) and (prefers-reduced-motion: no-preference)').matches) return;
        const connection = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
        if (connection?.saveData || /(^|-)2g$/.test(connection?.effectiveType || '')) return;
        let idle: number | undefined;
        const timer = window.setTimeout(() => {
            if ('requestIdleCallback' in window) idle = window.requestIdleCallback(() => setReady(true));
            else setReady(true);
        }, 5000);
        return () => {
            window.clearTimeout(timer);
            if (idle !== undefined) window.cancelIdleCallback(idle);
        };
    }, []);
    if (!ready) return null;
    return <iframe title="Vídeo de fundo de energia solar" aria-hidden="true" tabIndex={-1} className="absolute inset-0 h-full w-full pointer-events-none scale-[3.5]" src="https://www.youtube-nocookie.com/embed/QD_DLGDJsos?autoplay=1&mute=1&controls=0&loop=1&playlist=QD_DLGDJsos&rel=0&disablekb=1" allow="autoplay; encrypted-media" />;
}
