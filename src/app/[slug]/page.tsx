import { COMPANY_INFO } from "@/lib/data/company";
import { notFound } from "next/navigation";
import { findRegionalPage, regionalPages, regionalSlug } from "@/lib/regional-pages";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { LocalEvidence } from "@/components/LocalEvidence";
import { Metadata } from "next";
import { SOLAR_SERVICES } from "@/lib/constants/services";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Link from "next/link";
import { CheckCircle, MapPin, ArrowRight, AlertTriangle, ShieldCheck, TrendingUp, Sun } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

// Redirects are defined before the filesystem, keeping only canonical pages static.
export function generateStaticParams() {
    return regionalPages().map(({ canonical }) => ({ slug: canonical }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
    return findRegionalPage(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        return {};
    }

    const { service, city, canonical } = data;

    const title = `${service.title} em ${city} (RO) | Energia Solar DWalt`;
    const description = `Economize com ${service.title} em ${city}. ${service.pain.split('?')[0]}? A DWalt oferece projetos de energia solar, instalação e manutenção. Peça um orçamento!`;
    const keywords = [
        "energia solar",
        "placa solar",
        "painel solar",
        "economia de energia",
        "dwalt energia",
        service.title.toLowerCase(),
        `energia solar em ${city.toLowerCase()}`,
        `instalador solar ${city.toLowerCase()}`,
        "rondonia",
        "sustentabilidade"
    ];

    return {
        title,
        description,
        keywords: keywords.join(", "),
        alternates: {
            canonical: `${SITE_URL}/${canonical}`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/${canonical}`,
            siteName: "DWalt Energia",
            locale: "pt_BR",
            type: "website",
            images: [
                {
                    url: service.image,
                    width: 1200,
                    height: 630,
                    alt: `${service.title} em ${city}`,
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [service.image],
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

export default async function LandingPage({ params }: Props) {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        notFound();
    }

    const { service, city, canonical } = data;

    const description = `Economize com ${service.title} em ${city}. ${service.pain.split('?')[0]}? A DWalt oferece projetos de energia solar, instalação e manutenção.`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.title} em ${city}`,
        "serviceType": service.title,
        "description": description,
        "provider": { "@id": ORGANIZATION_ID },
        "areaServed": { "@type": "City", "name": city, "containedInPlace": { "@type": "State", "name": "Rondônia" } },
        "url": `${SITE_URL}/${canonical}`,
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white font-sans selection:bg-green-500/30">
            <JsonLd data={jsonLd} />
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-4 overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-neutral-950/80 via-neutral-950/50 to-neutral-950 z-10"></div>
                    {/* Placeholder for dynamic background image */}
                    <div className="w-full h-full bg-neutral-900 opacity-50"></div>
                </div>

                <div className="container mx-auto relative z-20 text-center max-w-5xl">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 text-green-400 text-sm font-medium mb-8 border border-green-500/20 backdrop-blur-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <MapPin className="w-4 h-4" />
                        Atendimento Especializado em {city}
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                        <span className="block text-white">{service.title} em {city}</span>
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 pb-2">
                            Profissional e Garantida
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed font-light">
                        {service.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link href={service.ctaUrl || "/solicitar-orcamento"} className="w-full sm:w-auto" target={service.ctaUrl ? "_blank" : undefined}>
                            <Button size="lg" className="w-full sm:w-auto bg-green-600 hover:bg-green-500 text-white rounded-full text-lg px-10 h-16 shadow-[0_0_40px_-10px_rgba(22,163,74,0.5)] transition-all hover:scale-105 font-bold">
                                {service.cta}
                                <ArrowRight className="ml-2 w-5 h-5" />
                            </Button>
                        </Link>
                        <Link href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}?text=Ol%C3%A1%2C+tenho+interesse+em+${service.title}+em+${city}`} target="_blank" className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto rounded-full text-lg px-8 h-16 bg-white/5 border-white/10 hover:bg-white/10 text-white hover:text-green-400 transition-colors font-medium backdrop-blur-sm">
                                Falar no WhatsApp
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <section className="border-b border-white/10 bg-neutral-900/30 py-12">
                <div className="container mx-auto px-4 max-w-5xl">
                    <h2 className="text-2xl font-bold mb-4">Atendimento em {city}</h2>
                    <p className="text-gray-300 leading-relaxed mb-6">A DWalt atende projetos em Rondônia a partir de suas unidades em Ariquemes, Porto Velho e Rolim de Moura. Converse com a equipe para confirmar a avaliação do imóvel, o deslocamento e as condições do serviço em {city}.</p>
                    <div className="flex flex-wrap gap-4 text-green-400">
                        <Link href="/unidades">Conheça nossas unidades</Link>
                        <Link href="/projetos">Veja projetos realizados</Link>
                        <Link href="/areas-de-atendimento">Cidades atendidas</Link>
                    </div>
                    <h3 className="text-lg font-semibold mt-8 mb-4">Outras soluções em {city}</h3>
                    <ul className="grid sm:grid-cols-2 gap-3 text-gray-300">
                        {SOLAR_SERVICES.filter(item => item.slug !== service.slug && item.slug !== 'afiliados').map(item => (
                            <li key={item.slug}><Link className="hover:text-green-400 underline underline-offset-4" href={`/${regionalSlug(item.slug, city)}`}>{item.title} em {city}</Link></li>
                        ))}
                    </ul>
                </div>
            </section>

            {service.slug !== 'afiliados' && <LocalEvidence city={city} />}

            {/* STATS SECTION */}
            <section className="py-12 border-b border-white/5 bg-neutral-900/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {service.stats.map((stat, i) => (
                            <div key={i} className="text-center">
                                <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                                <div className="text-sm text-green-500 font-medium uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* PAIN/PROBLEM SECTION */}
            <section className="py-24 bg-neutral-950 relative">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-red-500/5 border border-red-500/10 rounded-3xl p-8 md:p-12 relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>

                        <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                            <div className="bg-red-500/10 p-4 rounded-2xl shrink-0">
                                <AlertTriangle className="w-10 h-10 text-red-500" />
                            </div>
                            <div>
                                <h2 className="text-2xl md:text-3xl font-bold mb-4 text-red-50">
                                    Atenção
                                </h2>
                                <p className="text-lg text-gray-400 leading-relaxed mb-6">
                                    {service.pain}
                                </p>
                                <div className="flex items-center gap-2 text-red-400 text-sm font-medium">
                                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></div>
                                    Não ignore esse problema.
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* SOLUTION & PROCESS SECTION - UNIQUE FEATURES */}
            <section className="py-24 bg-neutral-900/50 border-t border-white/5">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 max-w-3xl mx-auto">
                        <span className="text-green-500 font-bold tracking-wider uppercase text-sm mb-2 block">Nossa Abordagem</span>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Como funciona nosso serviço em {city}</h2>
                        <p className="text-xl text-gray-400">
                            {service.solution}
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto mb-20">
                        {service.features.map((feature, i) => (
                            <div key={i} className="bg-neutral-900 border border-white/10 p-8 rounded-2xl hover:border-green-500/50 transition-all hover:-translate-y-1 duration-300 group">
                                <div className="mb-6 bg-green-500/10 w-14 h-14 rounded-xl flex items-center justify-center group-hover:bg-green-500 text-green-500 group-hover:text-white transition-all">
                                    <span className="text-2xl font-bold">{i + 1}</span>
                                </div>
                                <h3 className="font-bold text-xl mb-3 text-white">{feature.title}</h3>
                                <p className="text-gray-400 leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* BENEFITS LIST */}
                    <div className="max-w-4xl mx-auto bg-neutral-950 border border-white/10 rounded-3xl p-8 md:p-12">
                        <h3 className="text-2xl font-bold mb-8 text-center">Por que escolher a DWalt?</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            {service.benefits.map((benefit, i) => (
                                <div key={i} className="flex items-start gap-3">
                                    <CheckCircle className="w-6 h-6 text-green-500 shrink-0 mt-0.5" />
                                    <span className="text-lg text-gray-300">{benefit}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQ SECTION - UNIQUE Q&A */}
            <section className="py-24 bg-neutral-950 border-t border-white/5">
                <div className="container mx-auto px-4 max-w-3xl">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Perguntas Frequentes</h2>
                        <p className="text-gray-400">Tire suas dúvidas sobre {service.title}.</p>
                    </div>

                    <Accordion type="single" collapsible className="w-full space-y-4">
                        {service.faq.map((item, i) => (
                            <AccordionItem key={i} value={`item-${i}`} className="border border-white/10 bg-neutral-900/50 rounded-xl px-6">
                                <AccordionTrigger className="text-lg font-medium hover:text-green-400 text-left py-6">
                                    {item.question}
                                </AccordionTrigger>
                                <AccordionContent className="text-gray-400 text-base pb-6 leading-relaxed">
                                    {item.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>
            </section>

            {/* PROOF / WHY US SECTION */}
            <section className="py-24 bg-black relative overflow-hidden">
                <div className="container mx-auto px-4 max-w-5xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-6">DWalt Energia: Sinônimo de Qualidade em Rondônia</h2>
                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">1</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Experiência Comprovada</h4>
                                        <p className="text-gray-400 text-sm">Centenas de projetos executados e homologados em todo o estado.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">2</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Engenharia Própria</h4>
                                        <p className="text-gray-400 text-sm">Não terceirizamos responsabilidade. Nossa equipe técnica cuida do seu projeto.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="w-12 h-12 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center text-xl font-bold text-white shrink-0">3</div>
                                    <div>
                                        <h4 className="font-bold text-lg mb-1">Suporte Local</h4>
                                        <p className="text-gray-400 text-sm">Atendimento em {city} com suporte da nossa estrutura em Rondônia. Consulte a equipe sobre visitas e disponibilidade.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-zinc-900 to-black p-8 rounded-3xl border border-white/10 relative">
                            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-green-500 rounded-full blur-3xl opacity-20"></div>

                            <h3 className="text-2xl font-bold mb-6 text-center">Garantia DWalt</h3>
                            <div className="grid grid-cols-2 gap-4 text-center">
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-3xl font-bold text-green-500 mb-1">25</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest">Anos de Performance</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl">
                                    <div className="text-3xl font-bold text-green-500 mb-1">10+</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest">Anos de Equipamento</div>
                                </div>
                                <div className="p-4 bg-white/5 rounded-xl col-span-2">
                                    <div className="text-xl font-bold text-white mb-1">100%</div>
                                    <div className="text-xs text-gray-400 uppercase tracking-widest">Satisfação Garantida</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section className="py-32 bg-green-600 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/images/solar-pattern.png')] bg-repeat opacity-10 mix-blend-overlay"></div>
                <div className="container mx-auto px-4 relative z-10 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 max-w-4xl mx-auto leading-tight">
                        Aproveite o potencial de {city}.<br />
                        {service.cta.replace('Quero', 'Solicite')}.
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-2xl mx-auto">
                        <Link href={service.ctaUrl || "/solicitar-orcamento"} className="w-full" target={service.ctaUrl ? "_blank" : undefined}>
                            <Button size="lg" className="w-full bg-white text-green-700 hover:bg-gray-100 rounded-full text-xl h-16 shadow-2xl font-bold border-none transition-transform hover:scale-105">
                                {service.cta}
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </main>
    );
}
