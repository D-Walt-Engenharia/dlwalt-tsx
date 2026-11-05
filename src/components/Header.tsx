"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Sun, ChevronDown, Calculator, PiggyBank, Users, MapPin, FileText, Shield, BookOpen, Briefcase } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/tracking";

const navigation = {
    solucoes: {
        title: "Soluções",
        items: [
            { name: "Calculadora Solar", href: "/calculadora-solar", icon: Calculator, description: "Estime sua economia mensal e o tamanho do sistema." },
            { name: "Simular Financiamento", href: "/simular-financiamento", icon: PiggyBank, description: "Planeje o investimento com parcelas que cabem no bolso." },
        ]
    },
    institucional: {
        title: "Institucional",
        items: [
            { name: "Sobre Nós", href: "/#about", icon: Users, description: "Conheça nossa história e missão." },
            { name: "Nossas Unidades", href: "/unidades", icon: MapPin, description: "Encontre o escritório mais próximo de você." },
            { name: "Política de Privacidade", href: "/politica-de-privacidade", icon: Shield, description: "Como protegemos seus dados." },
            { name: "Termos de Uso", href: "/termos-de-uso", icon: FileText, description: "Regras de utilização do nosso site." },
        ]
    },
    conteudo: {
        title: "Conteúdo",
        items: [
            { name: "Blog", href: "/blog", icon: BookOpen, description: "Notícias e artigos sobre energia solar." },
            { name: "Projetos", href: "/projetos", icon: Briefcase, description: "Veja nossos cases de sucesso." },
        ]
    }
};

export function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
                isScrolled ? "py-4" : "py-6",
                isScrolled && !mobileMenuOpen
                    ? "bg-background/95 backdrop-blur-md shadow-md"
                    : "bg-transparent"
            )}
            onMouseLeave={() => setActiveDropdown(null)}
        >
            <div className="container mx-auto flex items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 relative z-50">
                    <img src="/logo-branca.svg" alt="DWalt Energia" width={158} height={40} className="h-10 w-[158px] shrink-0" />
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/#home"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isScrolled && !activeDropdown ? "text-foreground" : "text-white/90"
                        )}
                        onMouseEnter={() => setActiveDropdown(null)}
                    >
                        Início
                    </Link>

                    {/* Mega Menu Items */}
                    {Object.entries(navigation).map(([key, section]) => (
                        <div key={key} className="relative group">
                            <button
                                className={cn(
                                    "flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary focus:outline-none",
                                    isScrolled || activeDropdown ? "text-foreground" : "text-white/90"
                                )}
                                onMouseEnter={() => setActiveDropdown(key)}
                                onClick={() => setActiveDropdown(activeDropdown === key ? null : key)}
                                aria-expanded={activeDropdown === key}
                            >
                                {section.title}
                                <ChevronDown className={cn("h-4 w-4 transition-transform", activeDropdown === key ? "rotate-180" : "")} />
                            </button>
                        </div>
                    ))}

                    <Link
                        href="/#contact"
                        className={cn(
                            "text-sm font-medium transition-colors hover:text-primary",
                            isScrolled && !activeDropdown ? "text-foreground" : "text-white/90"
                        )}
                        onMouseEnter={() => setActiveDropdown(null)}
                    >
                        Contato
                    </Link>

                    <Link href="/solicitar-orcamento" onClick={() => trackEvent("clique_cta_cabecalho", { local: "desktop" })}>
                        <Button variant="default" className="font-semibold shadow-lg shadow-primary/20">
                            Solicite um Orçamento
                        </Button>
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className={cn(
                        "md:hidden z-50 transition-colors",
                        isScrolled || mobileMenuOpen ? "text-foreground" : "text-white"
                    )}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label={mobileMenuOpen ? "Fechar menu de navegação" : "Abrir menu de navegação"}
                    aria-expanded={mobileMenuOpen}
                    aria-controls="mobile-navigation"
                >
                    {mobileMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
                </button>
            </div>

            {/* Desktop Mega Menu Dropdown */}
            {activeDropdown && (
                <div
                    className="hidden md:block absolute top-full left-0 w-full bg-background/95 backdrop-blur-xl border-t border-border shadow-xl animate-in fade-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => setActiveDropdown(activeDropdown)}
                    onMouseLeave={() => setActiveDropdown(null)}
                >
                    <div className="container mx-auto py-8 px-4">
                        <div className="grid grid-cols-12 gap-8">
                            <div className="col-span-3">
                                <h3 className="text-lg font-bold text-primary mb-2">
                                    {navigation[activeDropdown as keyof typeof navigation].title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Explore nossas opções e descubra como podemos ajudar você a economizar energia.
                                </p>
                            </div>
                            <div className="col-span-9 grid grid-cols-2 lg:grid-cols-3 gap-6">
                                {navigation[activeDropdown as keyof typeof navigation].items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-start gap-4 p-3 rounded-lg hover:bg-accent transition-colors group"
                                        onClick={() => setActiveDropdown(null)}
                                    >
                                        <div className="p-2 bg-primary/10 rounded-md text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                                            <item.icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                                {item.name}
                                            </div>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {item.description}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <nav id="mobile-navigation" aria-label="Navegação principal" className="fixed inset-0 z-40 bg-background pt-24 px-4 md:hidden flex flex-col gap-4 overflow-y-auto">
                    <Link
                        href="/#home"
                        className="text-lg font-medium py-3 border-b border-border/50"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Início
                    </Link>

                    {Object.entries(navigation).map(([key, section]) => (
                        <div key={key} className="py-2 border-b border-border/50">
                            <div className="font-semibold text-primary mb-3 uppercase text-xs tracking-wider">
                                {section.title}
                            </div>
                            <div className="grid gap-4 pl-2">
                                {section.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center gap-3 text-sm text-foreground/80 hover:text-primary"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        <item.icon className="h-4 w-4 text-muted-foreground" />
                                        {item.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Link
                        href="/#contact"
                        className="text-lg font-medium py-3 border-b border-border/50"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        Contato
                    </Link>

                    <Link href="/solicitar-orcamento" onClick={() => { trackEvent("clique_cta_cabecalho", { local: "mobile" }); setMobileMenuOpen(false); }} className="w-full mt-4">
                        <Button className="w-full" size="lg">Solicite um Orçamento</Button>
                    </Link>
                </nav>
            )}
        </header>
    );
}
