'use client';
import { COMPANY_INFO } from "@/lib/data/company";

import React, { useEffect, useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { MapPin, Zap, ArrowLeft, BatteryCharging, PanelTop, Leaf, Wallet, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { JsonLd } from '@/components/JsonLd';
import api from '@/lib/api';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';

interface Project {
    id: number;
    name: string;
    category: string;
    location: string;
    description: string;
    photos: string[];
    panelCount: number;
    kwp: string;
}

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default function ProjectDetailPage({ params }: Props) {
    const [id, setId] = useState<string | null>(null);
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unwrapParams = async () => {
            const resolvedParams = await params;
            setId(resolvedParams.id);
        };
        unwrapParams();
    }, [params]);

    useEffect(() => {
        if (!id) return;

        const fetchProject = async () => {
            try {
                const { data } = await api.get(`/projects/${id}`);
                setProject(data.data);
            } catch (error) {
                console.error("Failed to fetch project", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col min-h-screen bg-black text-white">
                <Header />
                <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                        <p className="text-gray-500">Carregando detalhes do projeto...</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="flex flex-col min-h-screen bg-black text-white">
                <Header />
                <main className="flex-grow pt-32 pb-20 flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold mb-4">Projeto não encontrado</h1>
                        <Button asChild>
                            <Link href="/projetos">Voltar para projetos</Link>
                        </Button>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Calculations based on kWp
    const kwp = parseFloat(project.kwp);
    const monthlyGeneration = Math.round(kwp * 125); // Approx kWh/month
    const annualSavings = Math.round(monthlyGeneration * 0.92 * 12); // Approx R$ 0.92/kWh
    const co2Saved = (monthlyGeneration * 12 * 0.1) / 1000; // Approx tons/year
    const treesSaved = Math.round(co2Saved * 7); // Approx trees

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": project.name,
        "image": project.photos?.[0],
        "description": project.description,
        "brand": {
            "@type": "Brand",
            "name": "DWalt Energia"
        },
        "offers": {
            "@type": "Offer",
            "priceCurrency": "BRL",
            "availability": "https://schema.org/InStock"
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <JsonLd data={jsonLd} />
            <Header />
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4 max-w-6xl">
                    <Link href="/projetos" className="inline-flex items-center text-gray-400 hover:text-primary mb-8 transition-colors group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        Voltar para projetos
                    </Link>

                    {/* Hero Section */}
                    <div className="grid lg:grid-cols-2 gap-12 mb-20">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="space-y-6"
                        >
                            <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-bold tracking-wider uppercase">
                                {project.category}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                {project.name}
                            </h1>
                            <div className="flex items-center gap-2 text-lg text-gray-400">
                                <MapPin className="w-5 h-5 text-primary" />
                                {project.location}
                            </div>
                            <p className="text-xl text-gray-300 leading-relaxed border-l-4 border-primary pl-6 whitespace-pre-line">
                                {project.description}
                            </p>

                            <div className="grid grid-cols-2 gap-4 py-6">
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Potência Instalada</p>
                                    <p className="text-2xl font-bold text-white">{project.kwp} <span className="text-sm text-primary font-normal">kWp</span></p>
                                </div>
                                <div className="bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Painéis Solares</p>
                                    <p className="text-2xl font-bold text-white">{project.panelCount} <span className="text-sm text-primary font-normal">unidades</span></p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="relative rounded-3xl overflow-hidden shadow-2xl shadow-primary/10 border border-white/10 aspect-[4/3] lg:aspect-auto lg:h-full"
                        >
                            <img
                                src={project.photos?.[0] || 'https://images.unsplash.com/photo-1548613053-220d938b8ca7?w=800&q=80'}
                                alt={project.name}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        </motion.div>
                    </div>

                    {/* Impact & Simulations Section */}
                    <div className="mb-20">
                        <h2 className="text-3xl font-bold mb-12 text-center">
                            Impacto e <span className="text-primary">Economia Gerada</span>
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8 mb-12">
                            {/* Monthly Generation Card */}
                            <div
                                className="bg-zinc-900/40 backdrop-blur border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Zap className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Geração Mensal Estimada</h3>
                                <p className="text-4xl font-bold text-white mb-2">{monthlyGeneration} <span className="text-lg text-gray-500">kWh</span></p>
                                <p className="text-xs text-gray-500">Média anual aproximada</p>
                            </div>

                            {/* Annual Savings Card */}
                            <div
                                className="bg-zinc-900/40 backdrop-blur border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Wallet className="w-8 h-8 text-green-400" />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Economia Anual Estimada</h3>
                                <p className="text-4xl font-bold text-white mb-2">R$ {annualSavings.toLocaleString('pt-BR')}</p>
                                <p className="text-xs text-gray-500">Baseado na tarifa média atual</p>
                            </div>

                            {/* Environmental Impact Card */}
                            <div
                                className="bg-zinc-900/40 backdrop-blur border border-white/10 rounded-2xl p-8 text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                                    <Leaf className="w-8 h-8 text-blue-400" />
                                </div>
                                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Impacto Ambiental</h3>
                                <div className="flex flex-col gap-1">
                                    <p className="text-xl font-bold text-white">{treesSaved} <span className="text-sm font-normal text-gray-400">árvores salvas/ano</span></p>
                                    <p className="text-xl font-bold text-white">{co2Saved.toFixed(1)} <span className="text-sm font-normal text-gray-400">ton CO₂ evitados/ano</span></p>
                                </div>
                            </div>
                        </div>

                        {/* Cumulative Savings Chart */}
                        <div className="bg-zinc-900/30 border border-white/5 rounded-3xl p-8 md:p-12 mb-12">
                            <h3 className="text-2xl font-bold mb-8 text-center">Projeção de Economia Acumulada</h3>
                            <div className="flex flex-col md:flex-row items-end justify-center gap-4 h-64 md:h-80 w-full max-w-4xl mx-auto">
                                {[
                                    { year: '1 Ano', value: annualSavings, color: 'bg-primary/40' },
                                    { year: '5 Anos', value: annualSavings * 5, color: 'bg-primary/60' },
                                    { year: '10 Anos', value: annualSavings * 10, color: 'bg-primary/80' },
                                    { year: '25 Anos', value: annualSavings * 25, color: 'bg-primary' },
                                ].map((item, index) => (
                                    <div key={index} className="flex flex-col items-center justify-end w-full md:w-1/4 h-full group">
                                        <div className="mb-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="text-sm font-bold text-white bg-zinc-800 px-2 py-1 rounded">
                                                R$ {item.value.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                                            </span>
                                        </div>
                                        <div
                                            className={`w-full ${item.color} rounded-t-xl transition-all duration-1000 ease-out relative hover:brightness-110`}
                                            style={{ height: `${(index + 1) * 25}%` }}
                                        >
                                            <div className="absolute top-2 w-full text-center text-xs md:text-sm font-bold text-black/70">

                                            </div>
                                        </div>
                                        <div className="mt-4 text-center">
                                            <p className="text-gray-400 font-medium">{item.year}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <p className="text-center text-gray-500 text-sm mt-8">
                                *Estimativa considerando inflação energética zero. O retorno real tende a ser ainda maior com os aumentos da tarifa.
                            </p>
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-r from-zinc-900 to-zinc-900/50 border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
                        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

                        <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                            <h2 className="text-3xl md:text-5xl font-bold">
                                Gostou desse resultado?
                            </h2>
                            <p className="text-xl text-gray-300">
                                Sua residência ou empresa também pode gerar a própria energia e economizar até 95% na conta de luz.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                                <Button size="lg" className="bg-primary text-black hover:bg-primary/90 font-bold px-8 h-14 rounded-full text-lg shadow-lg shadow-primary/25 group" asChild>
                                    <Link href="/calculadora-solar" className="flex items-center gap-2">
                                        Simular meu Projeto Agora
                                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                                    </Link>
                                </Button>
                                <Button size="lg" variant="outline" className="border-white/10 hover:bg-white/5 text-white h-14 px-8 rounded-full text-lg" asChild>
                                    <Link href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}`}>
                                        Falar com Especialista
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </motion.div>

                </div>
            </main>
            <Footer />
        </div>
    );
}
