import { RONDONIA_CITIES } from './constants/rondonia-cities';
import { COMPANY_INFO } from './data/company';
import type { PublicProject } from './public-content';

function normalizeLocation(value: string): string {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase()
        .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
}

/** Only attribute a published project to a city explicitly identified by its data. */
export function projectCity(project: Pick<PublicProject, 'location' | 'city'>): string | null {
    const explicit = normalizeLocation(project.city || '');
    if (explicit) {
        return RONDONIA_CITIES.find(city => normalizeLocation(city) === explicit) ?? null;
    }
    const location = normalizeLocation(project.location || '');
    return RONDONIA_CITIES.find(city => {
        const name = normalizeLocation(city);
        return ['', ' ro', ' rondonia', ' ro brasil', ' rondonia brasil'].some(suffix =>
            location === `${name}${suffix}` || location.endsWith(` ${name}${suffix}`),
        );
    }) ?? null;
}

export function projectsInCity(projects: PublicProject[], city: string): PublicProject[] {
    return projects.filter(project => projectCity(project) === city);
}

export function unitInCity(city: string) {
    return COMPANY_INFO.units.find(unit => unit.city === city);
}
