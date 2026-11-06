import type { CSSProperties } from 'react';
import styles from './RegionalPage.module.css';

const paths = {
    arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
    pin: <><path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    sun: <><circle cx="12" cy="12" r="4" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.4 1.4m11.2 11.2L19 19M5 19l1.4-1.4M17.6 6.4 19 5" /></>,
    shield: <><path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6l8-3Z" /><path d="m8 12 3 3 5-6" /></>,
    home: <><path d="m3 10 9-7 9 7v11H3V10Z" /><path d="M9 21v-8h6v8" /></>,
    building: <path d="M4 21V5h10v16m0-12h6v12M2 21h20M7 9h4m-4 4h4m-4 4h4m6-4h1m-1 4h1" />,
    leaf: <><path d="M20 3C9 2 2 7 5 15c3 8 15 3 15-12Z" /><path d="M3 22 16 8" /></>,
    phone: <path d="M5 3h4l2 5-3 2c2 4 4 6 8 8l2-3 4 2v4c-9 3-22-10-17-18Z" />,
};

export function RegionalIcon({ name, style }: { name: keyof typeof paths; style?: CSSProperties }) {
    return <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={style}>{paths[name]}</svg>;
}

export function WhatsAppIcon() {
    return <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.52 3.48A11.87 11.87 0 0 0 12.05 0C5.45 0 .08 5.37.08 11.97c0 2.11.55 4.17 1.6 5.99L0 24l6.2-1.63a11.94 11.94 0 0 0 5.85 1.49h.01c6.6 0 11.97-5.37 11.97-11.97 0-3.2-1.25-6.21-3.51-8.41ZM12.06 21.84a9.89 9.89 0 0 1-5.03-1.38l-.36-.22-3.68.97.98-3.59-.23-.37a9.9 9.9 0 0 1-1.52-5.28c0-5.49 4.46-9.95 9.94-9.95a9.87 9.87 0 0 1 7.03 2.92 9.87 9.87 0 0 1 2.91 7.04c0 5.49-4.46 9.95-9.94 9.95Zm5.46-7.46c-.3-.15-1.77-.87-2.04-.97-.28-.1-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.88-.78-1.48-1.75-1.65-2.05-.18-.3-.02-.46.13-.61.14-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.03-.53-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.21 5.09 4.5.71.3 1.26.48 1.69.61.71.23 1.36.2 1.87.12.57-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.13-.27-.2-.57-.35Z" /></svg>;
}
