import snapshot from '../../public/dados/solar-ro-2026-11.json';

type MunicipalRecord = {
    codigoIbge: number;
    regiao: string;
    distritos: string[];
    total: number;
    classes: Partial<Record<string, number>>;
};

export const municipalRecords: Record<string, MunicipalRecord> = snapshot.municipios;
export const solarDataSource = snapshot.fonteSolar;
export const solarDataLicense = snapshot.licencaDadosSolares;
export const districtDataSource = snapshot.fonteDistritos;
export const municipalDataDownload = '/dados/solar-ro-2026-11.json';
export const solarReferenceMonth = new Intl.DateTimeFormat('pt-BR', {
    month: 'long', year: 'numeric', timeZone: 'UTC',
}).format(new Date(snapshot.periodo + '-01T00:00:00Z'));

// The names are used for matching only. Keep the IBGE spelling in the results.
export function normalizePlace(value: string) {
    return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
        .toLowerCase().replace(/[^a-z0-9]/g, '');
}
