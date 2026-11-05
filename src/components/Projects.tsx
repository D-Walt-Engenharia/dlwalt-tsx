import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getAllContent, type PublicProject } from '@/lib/public-content';

export type Project = PublicProject;

export async function Projects() {
    let projects: PublicProject[];
    try {
        projects = (await getAllContent('projects')).slice(0, 3);
    } catch {
        // An unavailable portfolio must not take the main commercial page down.
        return null;
    }

    return (
        <section id="projects" className="py-24 bg-black text-white overflow-hidden">
            <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-4 sm:text-4xl">
                            Projetos <span className="text-primary">Realizados</span>
                        </h2>
                        <p className="text-gray-400 text-lg max-w-xl">
                            Conheça algumas das nossas instalações e veja o resultado da nossa qualidade técnica.
                        </p>
                    </div>
                    <Link
                        href="/projetos"
                        className="text-primary hover:text-primary/80 font-semibold transition-colors flex items-center gap-2 group"
                    >
                        Ver Portfolio Completo <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {projects.map((project) => (
                        <Link
                            key={project.id}
                            href={`/projetos/${project.id}`}
                            className="group relative rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-800 hover:border-primary/50 transition-all duration-300 block"
                        >
                            <div className="aspect-[16/10] overflow-hidden relative">
                                <img
                                    src={project.photos?.[0] || 'https://images.unsplash.com/photo-1548613053-220d938b8ca7?w=800&q=80'}
                                    alt={project.name} width={800} height={500} loading="lazy" decoding="async"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                                <div className="absolute top-4 right-4 bg-primary text-black text-xs font-bold px-3 py-1 rounded-full">
                                    {project.category}
                                </div>
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
                                <p className="text-sm text-zinc-400 mb-4">{project.location}</p>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800">
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Potência</p>
                                        <p className="font-semibold text-primary">{project.kwp} kWp</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Painéis</p>
                                        <p className="font-semibold text-primary">{project.panelCount}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
