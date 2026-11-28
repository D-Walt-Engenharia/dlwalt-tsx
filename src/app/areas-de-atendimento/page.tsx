import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RONDONIA_CITIES } from '@/lib/constants/rondonia-cities';
import { districtDataSource, municipalRecords } from '@/lib/regional-municipalities';
import { regionalSlug } from '@/lib/regional-pages';
import { pageMetadata } from '@/lib/seo';
import { MunicipalityDirectory, type DirectoryRegion } from './MunicipalityDirectory';

export const metadata = pageMetadata('Energia solar nas cidades de Rondônia | DWalt Energia', 'Encontre sua cidade ou distrito em Rondônia e consulte projetos, instalação de energia solar e atendimento da DWalt para o seu endereço.', '/areas-de-atendimento');

export default function CoveragePage() {
    const groups = new Map<string, DirectoryRegion>();
    for (const city of RONDONIA_CITIES) {
        const { regiao, distritos } = municipalRecords[city];
        const region = groups.get(regiao) ?? { name: regiao, cities: [] };
        region.cities.push({ city, districts: distritos, href: '/' + regionalSlug('energia-solar', city) });
        groups.set(regiao, region);
    }
    const regions = [...groups.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    return <div className="min-h-screen bg-black text-white"><Header />
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Energia solar em Rondônia</h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-4">Encontre o município do seu imóvel para ver projetos e consultar uma avaliação. A DWalt tem unidades físicas em Ariquemes e Porto Velho.</p>
            <p className="text-gray-400 mb-8">Para os demais endereços, consulte disponibilidade e deslocamento com a equipe. <Link href="/unidades" className="text-primary underline">Endereços das unidades</Link>.</p>
            <MunicipalityDirectory regions={regions} />
            <p className="mt-8 text-sm text-gray-400">Municípios agrupados pelas regiões geográficas imediatas do IBGE. <a className="underline" href={districtDataSource}>Consultar os distritos no IBGE</a>.</p>
            <Link className="inline-block mt-6 text-primary underline" href="/solicitar-orcamento">Solicite seu orçamento</Link>
        </main><Footer /></div>;
}
