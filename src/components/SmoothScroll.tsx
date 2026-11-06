'use client';

import { isRegionalRoute } from '@/lib/regional-route';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import type Lenis from 'lenis';

export const SmoothScroll = () => {
    const pathname = usePathname();
    useEffect(() => {
        if (isRegionalRoute(pathname)) return;
        // Keep browser-native scrolling for the form and mobile keyboards.
        if (pathname === '/solicitar-orcamento' || pathname?.startsWith('/solicitar-orcamento/')) return;
        if (pathname === '/simular-financiamento' || pathname?.startsWith('/simular-financiamento/')) return;
        if (window.matchMedia('(prefers-reduced-motion: reduce), (pointer: coarse)').matches) return;

        let disposed = false;
        let lenis: Lenis | undefined;
        let frame = 0;
        void import('lenis').then(({ default: Lenis }) => {
            if (disposed) return;
            lenis = new Lenis({
                duration: 1.2,
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 1,
                touchMultiplier: 2,
            });

            function raf(time: number) {
                if (disposed) return;
                lenis?.raf(time);
                frame = requestAnimationFrame(raf);
            }
            frame = requestAnimationFrame(raf);
        });

        return () => {
            disposed = true;
            cancelAnimationFrame(frame);
            lenis?.destroy();
        };
    }, [pathname]);

    return null;
};
