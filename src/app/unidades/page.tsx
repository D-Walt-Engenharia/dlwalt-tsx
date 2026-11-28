import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import OfficeCard from '@/components/OfficeCard';
import { COMPANY_INFO } from '@/lib/data/company';
import { regionalSlug } from '@/lib/regional-pages';
import { MapPin } from 'lucide-react';

export default function UnitsPage() {
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />
            <main className="flex-grow">
                {/* Page Hero */}
                <section className="relative pt-32 pb-20 px-4 items-center justify-center bg-black overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-black to-black z-0" />
                    <div className="container mx-auto relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                            <MapPin className="w-4 h-4" />
                            Nossa Presença
                        </div>
                        <h1 className="text-4xl md:text-6xl font-bold mb-6">
                            Onde Encontrar a <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-100">DWalt Energia</span>
                        </h1>
                        <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                            Estamos estrategicamente posicionados para atender você com agilidade e excelência.
                            Visite uma de nossas unidades ou agende uma visita técnica.
                        </p>
                    </div>
                </section>

                <section className="py-16 bg-black">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {COMPANY_INFO.units.map(unit => (
                                <OfficeCard key={unit.id} unit={unit} cityHref={`/${regionalSlug('energia-solar', unit.city)}`} />
                            ))}
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
