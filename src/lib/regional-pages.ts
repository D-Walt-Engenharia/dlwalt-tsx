import { RONDONIA_CITIES, slugify } from './constants/rondonia-cities';
import { SOLAR_SERVICES } from './constants/services';
import canonicalOverrides from './data/regional-canonical-overrides.json';

const preferredWithState = new Set(canonicalOverrides);

/** One published destination per service/city; retain established URL variants. */
export function regionalSlug(serviceSlug: string, city: string): string {
    const base = `${serviceSlug}-em-${slugify(city)}`;
    return preferredWithState.has(`${base}-ro`) ? `${base}-ro` : base;
}

export function regionalPages() {
    return SOLAR_SERVICES.flatMap(service => RONDONIA_CITIES.map(city => {
        const base = `${service.slug}-em-${slugify(city)}`;
        const canonical = regionalSlug(service.slug, city);
        return { service, city, canonical, alias: canonical === base ? `${base}-ro` : base };
    }));
}

export function findRegionalPage(slug: string) {
    return regionalPages().find(page => page.canonical === slug || page.alias === slug) ?? null;
}
