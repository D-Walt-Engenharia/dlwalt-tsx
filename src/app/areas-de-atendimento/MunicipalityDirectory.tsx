'use client';

import Link from 'next/link';
import { useState } from 'react';
import { normalizePlace } from '@/lib/regional-municipalities';

type DirectoryEntry = { city: string; districts: string[]; href: string };
export type DirectoryRegion = { name: string; cities: DirectoryEntry[] };

export function MunicipalityDirectory({ regions }: { regions: DirectoryRegion[] }) {
    const [query, setQuery] = useState('');
    const term = normalizePlace(query);
    const filtered = regions.map(region => ({
        ...region,
        cities: region.cities.filter(({ city, districts }) =>
            [city, ...districts].some(place => normalizePlace(place).includes(term))),
    })).filter(region => region.cities.length > 0);
    const count = filtered.reduce((sum, region) => sum + region.cities.length, 0);

    return <div>
        <label className="block font-semibold mb-2" htmlFor="buscar-cidade">Buscar por município ou distrito</label>
        <div className="flex gap-2 max-w-xl">
            <input id="buscar-cidade" type="search" value={query} onChange={event => setQuery(event.target.value)}
                className="w-full min-w-0 rounded-lg border border-white/30 bg-white/5 px-4 py-3 text-white focus:border-primary"
                placeholder="Jaru ou Tarilândia" />
            {query && <button className="px-3 text-primary underline" onClick={() => setQuery('')}>Limpar</button>}
        </div>
        <p role="status" aria-live="polite" className="my-3 text-sm text-gray-300">
            {count === 0 ? 'Nenhum município encontrado. Confira a grafia ou busque pelo nome da sede.' :
                count === 1 ? '1 município encontrado.' : `${count} municípios encontrados.`}
        </p>
        {filtered.map(region => <section key={region.name} className="mt-8">
            <h2 className="text-xl font-semibold mb-3">Região de {region.name}</h2>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {region.cities.map(({ city, districts, href }) => <li key={city}>
                    <Link className="block h-full rounded-xl border border-white/15 bg-white/5 px-4 py-3 hover:border-primary focus-visible:outline-primary" href={href}>
                        <span className="font-semibold text-white">{city}</span>
                        {districts.length > 0 && <span className="block mt-1 text-sm text-gray-300">Distritos além da sede · {districts.join(', ')}.</span>}
                    </Link>
                </li>)}
            </ul>
        </section>)}
    </div>;
}
