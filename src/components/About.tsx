import { CheckCircle2 } from "lucide-react";

export function About() {
    return (
        <section id="about" className="py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="flex flex-col lg:flex-row items-center gap-16">
                    {/* Image Content */}
                    <div className="w-full lg:w-1/2">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                            <picture>
                                <source media="(max-width: 767px)" srcSet="/dwalt-equipe-640.webp" />
                                <img src="/dwalt-equipe-960.webp" alt="História da DWalt Energia" width={960} height={720} loading="lazy" decoding="async" className="aspect-[4/3] w-full object-cover" />
                            </picture>
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                            <div className="absolute bottom-6 left-6 text-white">
                                <p className="text-sm font-medium uppercase tracking-wider mb-1">Nossa história em Rondônia</p>
                                <p className="text-2xl font-bold">Líder em Energia Solar na Região Norte</p>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="w-full lg:w-1/2">
                        <h2 className="text-3xl font-bold tracking-tight mb-6 sm:text-4xl text-foreground">
                            Quem é a <span className="text-primary">DWalt Energia</span>?
                        </h2>
                        <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                            Somos especialistas em transformar a maneira como você consome energia.
                            Com mais de 2000 projetos executados, levamos economia, sustentabilidade e inovação
                            para lares e empresas em todo o estado.
                        </p>
                        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                            Nossa missão é democratizar o acesso à energia solar com soluções técnicas de excelência
                            e viabilidade financeira.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {[
                                "Equipe Técnica Certificada",
                                "Garantia de até 25 anos",
                                "Projetos Personalizados",
                                "Suporte Pós-venda",
                                "Financiamento Facilitado",
                                "Homologação Agilizada"
                            ].map((item) => (
                                <div key={item} className="flex items-center gap-3">
                                    <CheckCircle2 className="h-5 w-5 text-primary shrink-0" />
                                    <span className="text-foreground font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
