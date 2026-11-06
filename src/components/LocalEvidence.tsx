import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';
import { getAllContent, type PublicProject } from '@/lib/public-content';
import { projectsInCity, unitInCity } from '@/lib/local-evidence';

export async function LocalEvidence({ city }: { city: string }) {
    const unit = unitInCity(city);
    let projects: PublicProject[] = [];
    try {
        projects = projectsInCity(await getAllContent('projects'), city).slice(0, 3);
    } catch {
        // A temporary portfolio outage must not affect the service page or invent proof.
    }
    if (!unit && projects.length === 0) return null;

    return (
        <section className="border-b border-white/10 bg-black py-16">
            <div className="container mx-auto max-w-5xl px-4">
                {unit && <div className="mb-10 rounded-2xl border border-green-500/20 bg-green-500/5 p-6 md:p-8">
                    <h2 className="mb-4 flex items-center gap-3 text-2xl font-bold"><MapPin className="h-6 w-6 shrink-0 text-green-400" />Nossa unidade em {city}</h2>
                    <p className="text-gray-300 leading-relaxed">{unit.address}</p>
                    <p className="mt-3 text-gray-300">Converse com a equipe para agendar uma visita ou solicitar uma avaliação do seu imóvel.</p>
                    <div className="mt-5 flex flex-wrap gap-5 text-green-400">
                        <a href={`https://wa.me/${unit.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {unit.phone}</a>
                        <Link href="/unidades">Endereços e contatos das unidades</Link>
                    </div>
                </div>}
                {projects.length > 0 && <div>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">Projetos publicados em {city}</h2>
                    <p className="text-gray-300 leading-relaxed mb-8">Conheça instalações do nosso portfólio nesta cidade. Veja as fotos, a potência instalada e os detalhes de cada projeto.</p>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {projects.map(project => <article key={project.id} className="overflow-hidden rounded-2xl border border-white/10 bg-neutral-900">
                            {project.photos?.[0] && <Link href={`/projetos/${project.id}`} tabIndex={-1} aria-hidden="true"><img src={project.photos[0]} alt="" width={800} height={500} loading="lazy" decoding="async" className="aspect-[16/10] w-full object-cover" /></Link>}
                            <div className="p-6">
                                <p className="text-xs uppercase tracking-wider text-green-400 mb-3">{project.category}</p>
                                <h3 className="font-bold text-xl mb-3"><Link href={`/projetos/${project.id}`}>{project.name}</Link></h3>
                                <p className="text-sm text-gray-300 mb-4">{project.location}</p>
                                <dl className="grid grid-cols-2 gap-4 border-t border-white/10 pt-4">
                                    <div><dt className="text-xs text-gray-400">Potência instalada</dt><dd className="font-semibold mt-1">{project.kwp} kWp</dd></div>
                                    <div><dt className="text-xs text-gray-400">Painéis</dt><dd className="font-semibold mt-1">{project.panelCount}</dd></div>
                                </dl>
                                <Link href={`/projetos/${project.id}`} className="inline-flex items-center gap-2 mt-6 text-green-400 font-medium">Ver projeto <ArrowRight className="h-4 w-4" /></Link>
                            </div>
                        </article>)}
                    </div>
                    <Link href="/projetos" className="inline-block mt-6 text-green-400 underline underline-offset-4">Conheça o portfólio completo</Link>
                </div>}
            </div>
        </section>
    );
}
