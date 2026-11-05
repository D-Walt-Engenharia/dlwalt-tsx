import { Button } from "./ui/button";
import { ArrowRight, Sun } from "lucide-react";
import Link from "next/link";
import { HeroVideo } from "./HeroVideo";

export function Hero() {
    return (
        <section
            id="home"
            className="relative flex h-svh min-h-[800px] w-full items-center justify-center overflow-hidden bg-black"
        >
            <div className="absolute inset-0 z-0">
                <picture>
                    <source media="(max-width: 767px)" srcSet="/solar-roof-640.webp" />
                    <img src="/solar-roof-1280.webp" alt="" width={1280} height={714} fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
                </picture>
                <HeroVideo />
                <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/55 to-background" />
            </div>

            {/* Content */}
            <div className="container relative z-20 flex flex-col items-center px-4 text-center">
                <div
                    className="mb-6 flex items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
                >
                    <Sun className="h-4 w-4 text-yellow-500" />
                    <span className="text-sm font-medium text-white">
                        Energia limpa para um futuro sustentável
                    </span>
                </div>

                <h1
                    className="max-w-4xl text-5xl font-extrabold tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
                >
                    Transforme o Sol em <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
                        Economia Real
                    </span>
                </h1>

                <p
                    className="mt-6 max-w-2xl text-lg text-gray-200 md:text-xl"
                >
                    Energia solar em Rondônia para residências e empresas.
                    Projetos personalizados, instalação e suporte para você aproveitar a energia do sol.
                </p>

                <div
                    className="mt-10 flex flex-col gap-4 sm:flex-row"
                >
                    <Link href="/calculadora-solar">
                        <Button size="lg" className="text-lg h-14 px-8 rounded-full">
                            Simular Economia
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                    </Link>
                    <Link href="/projetos">
                        <Button
                            variant="outline"
                            size="lg"
                            className="text-lg h-14 px-8 rounded-full border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white"
                        >
                            Conheça Nossos Projetos
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div
                className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce"
            >
                <div className="flex flex-col items-center gap-2">
                    <span className="text-xs text-white/50 uppercase tracking-widest">ROLE PARA BAIXO</span>
                    <div className="h-10 w-[1px] bg-gradient-to-b from-primary to-transparent" />
                </div>
            </div>
        </section>
    );
}
