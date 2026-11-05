import Link from 'next/link';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { RONDONIA_CITIES } from '@/lib/constants/rondonia-cities';
import { regionalSlug } from '@/lib/regional-pages';
import { pageMetadata } from '@/lib/seo';

export const metadata = pageMetadata('Energia solar nas cidades de Rondônia | DWalt Energia', 'Conheça as áreas de atendimento da DWalt em Rondônia e encontre informações sobre energia solar na sua cidade.', '/areas-de-atendimento');

export default function CoveragePage() {
    return <div className="min-h-screen bg-black text-white"><Header />
        <main className="container mx-auto px-4 pt-32 pb-20 max-w-6xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Energia solar em Rondônia</h1>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mb-6">A DWalt atende residências e empresas em Rondônia, com unidades em Ariquemes, Porto Velho e Rolim de Moura. Encontre sua cidade e converse com nossa equipe sobre projetos, instalação e manutenção.</p>
            <p className="text-gray-400 mb-8">Consulte as condições de deslocamento e disponibilidade para sua localização. <Link href="/unidades" className="text-primary underline">Veja nossas unidades</Link>.</p>
            <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {RONDONIA_CITIES.map(city => <li key={city}><Link className="block rounded-xl border border-white/10 bg-white/5 p-4 hover:border-primary hover:text-primary" href={`/${regionalSlug('energia-solar', city)}`}>Energia solar em {city}</Link></li>)}
            </ul>
            <Link className="inline-block mt-10 text-primary underline" href="/solicitar-orcamento">Solicite seu orçamento</Link>
        </main><Footer /></div>;
}
