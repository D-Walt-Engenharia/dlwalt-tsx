import React from 'react';
import { getAllContent } from '@/lib/public-content';
import { pageMetadata } from '@/lib/seo';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { MapPin, Briefcase } from 'lucide-react';

export const metadata = pageMetadata('Projetos de energia solar em Rondônia | DWalt Energia', 'Conheça projetos de energia solar executados pela DWalt Energia em residências e empresas de Rondônia.', '/projetos');

export default async function ProjectsPage() {
    const projects = await getAllContent('projects');
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4">
                    {/* Header */}
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Briefcase className="w-4 h-4" />
                            Portfolio
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold">
                            Nossa Qualidade <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">Em Detalhes</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Explore nossos projetos realizados e veja como estamos transformando a energia de residências e empresas em Rondônia.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {projects.map((project) => (
                            <Link
                                key={project.id}
                                href={`/projetos/${project.id}`}
                                className="group relative bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 flex flex-col"
                            >
                                <div className="aspect-[16/10] overflow-hidden relative">
                                    <img
                                        src={project.photos?.[0] || 'https://images.unsplash.com/photo-1548613053-220d938b8ca7?w=800&q=80'}
                                        alt={project.name} width={800} height={500} loading="lazy" decoding="async"
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className="absolute top-4 right-4 bg-black/70 backdrop-blur border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">
                                        {project.category}
                                    </div>
                                </div>

                                <div className="p-6 flex-grow flex flex-col">
                                    <h2 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">
                                        {project.name}
                                    </h2>
                                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-6">
                                        <MapPin className="w-4 h-4 text-primary" />
                                        <span>{project.location}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800 mt-auto">
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Potência</p>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">{project.kwp} kWp</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-zinc-500 uppercase tracking-wider mb-1">Painéis</p>
                                            <p className="font-semibold text-white group-hover:text-primary transition-colors">{project.panelCount}</p>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                        {projects.length === 0 && (
                            <div className="col-span-3 text-center text-gray-500">Nenhum projeto encontrado.</div>
                        )}
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
