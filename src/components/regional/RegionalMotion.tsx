'use client';

import { useEffect } from 'react';

/** Content is visible in server HTML; only off-screen blocks receive an entrance. */
export function RegionalMotion() {
    useEffect(() => {
        const root = document.getElementById('regional-page');
        const closeMenu = (event: MouseEvent) => {
            if (!(event.target instanceof Element) || !event.target.closest('a')) return;
            event.target.closest('details[data-regional-menu]')?.removeAttribute('open');
        };
        root?.addEventListener('click', closeMenu);
        return () => root?.removeEventListener('click', closeMenu);
    }, []);

    useEffect(() => {
        const root = document.getElementById('regional-page');
        const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
        if (!root || preference.matches || !('IntersectionObserver' in window)) return;
        const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-regional-reveal]'));
        const restore = () => elements.forEach(element => element.removeAttribute('data-reveal-state'));
        let observer: IntersectionObserver | undefined;
        try {
            observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.setAttribute('data-reveal-state', 'visible');
                        observer?.unobserve(entry.target);
                    }
                });
            }, { threshold: .08, rootMargin: '0px 0px -25px 0px' });
            elements.forEach(element => {
                if (element.getBoundingClientRect().top > window.innerHeight + 10) {
                    element.setAttribute('data-reveal-state', 'pending');
                    observer?.observe(element);
                }
            });
        } catch {
            observer?.disconnect();
            restore();
        }
        const reduce = () => {
            if (preference.matches) { observer?.disconnect(); restore(); }
        };
        preference.addEventListener('change', reduce);
        return () => { preference.removeEventListener('change', reduce); observer?.disconnect(); restore(); };
    }, []);
    return null;
}
