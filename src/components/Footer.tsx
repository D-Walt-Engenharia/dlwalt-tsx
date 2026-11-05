import Link from "next/link";
import { Facebook, Instagram, Linkedin, MapPin, Phone, Mail, Youtube } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data/company";

export function Footer() {
    return (
        <footer className="bg-secondary text-secondary-foreground pt-16 pb-8">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
                    {/* Brand */}
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <img src="/logo-branca.svg" alt="DWalt Energia" width={158} height={40} loading="lazy" className="h-10 w-[158px]" />
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {COMPANY_INFO.description}
                        </p>
                        <div className="flex gap-4">
                            <Link href={COMPANY_INFO.social.instagram} target="_blank" aria-label="Instagram da DWalt Energia" className="text-gray-400 hover:text-primary transition-colors">
                                <Instagram className="h-5 w-5" />
                            </Link>
                            <Link href={COMPANY_INFO.social.facebook} target="_blank" aria-label="Facebook da DWalt Energia" className="text-gray-400 hover:text-primary transition-colors">
                                <Facebook className="h-5 w-5" />
                            </Link>
                            <Link href={COMPANY_INFO.social.youtube} target="_blank" aria-label="YouTube da DWalt Energia" className="text-gray-400 hover:text-primary transition-colors">
                                <Youtube className="h-5 w-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Links Rápidos</h2>
                        <ul className="space-y-2">
                            {[
                                { name: "Início", href: "/#home" },
                                { name: "Sobre Nós", href: "/#about" },
                                { name: "Serviços", href: "/#services" },
                                { name: "Projetos", href: "/projetos" },
                                { name: "Blog", href: "/blog" },
                                { name: "Contato", href: "/#contact" }
                            ].map((item) => (
                                <li key={item.name}>
                                    <Link
                                        href={item.href}
                                        className="text-gray-400 hover:text-primary text-sm transition-colors"
                                    >
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Serviços</h2>
                        <ul className="space-y-2">
                            {["Instalação Residencial", "Energia Comercial", "Usinas Solares", "Manutenção e Limpeza", "Projetos Elétricos"].map((item) => (
                                <li key={item}>
                                    <Link href="/#services" className="text-gray-400 hover:text-primary text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h2 className="text-lg font-semibold mb-4 text-white">Matriz</h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-sm text-gray-400">
                                <MapPin className="h-5 w-5 text-primary shrink-0" />
                                <span>
                                    {COMPANY_INFO.units[0].address}
                                </span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Phone className="h-5 w-5 text-primary shrink-0" />
                                <span>{COMPANY_INFO.contact.phone}</span>
                            </li>
                            <li className="flex items-center gap-3 text-sm text-gray-400">
                                <Mail className="h-5 w-5 text-primary shrink-0" />
                                <span>{COMPANY_INFO.contact.email}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-gray-400">
                        © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos os direitos reservados.
                    </p>
                    <div className="flex gap-6 text-sm text-gray-400">
                        <Link href="/termos-de-uso" className="hover:text-primary transition-colors">Termos de Uso</Link>
                        <Link href="/politica-de-privacidade" className="hover:text-primary transition-colors">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
