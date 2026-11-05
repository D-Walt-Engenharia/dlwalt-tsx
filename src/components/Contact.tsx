"use client";

import { QuoteWhatsAppForm } from "./QuoteWhatsAppForm";
import { Mail, MapPin, Phone, Send, Instagram, Facebook, Youtube, MessageCircle } from "lucide-react";
import { COMPANY_INFO } from "@/lib/data/company";
import { trackContact } from "@/lib/tracking";

export function Contact() {
    return (
        <section id="contact" className="relative py-24 bg-black text-white overflow-hidden">
            {/* Background Effects */}
            <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px] pointer-events-none" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-start">
                    {/* Info Column */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                            <MessageCircle className="w-4 h-4" />
                            Fale Conosco
                        </div>
                        <h2 className="text-4xl lg:text-5xl font-bold tracking-tight mb-6">
                            Pronto para zerar sua <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-100">
                                conta de luz?
                            </span>
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-12 max-w-lg">
                            Solicite um orçamento gratuito. Nossa equipe de engenheiros fará uma análise
                            personalizada do seu perfil de consumo.
                        </p>

                        <div className="space-y-8">
                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                                    <Phone className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white mb-1">Telefone / WhatsApp</p>
                                    <a
                                        href={`https://wa.me/${COMPANY_INFO.contact.whatsapp}`}
                                        target="_blank"
                                        className="text-gray-400 hover:text-primary transition-colors"
                                        onClick={() => trackContact("whatsapp")}
                                    >
                                        {COMPANY_INFO.contact.phone}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                                    <Mail className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white mb-1">E-mail</p>
                                    <a
                                        href={`mailto:${COMPANY_INFO.contact.email}`}
                                        className="text-gray-400 hover:text-primary transition-colors"
                                        onClick={() => trackContact("email")}
                                    >
                                        {COMPANY_INFO.contact.email}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4 group">
                                <div className="p-3 rounded-xl bg-white/5 border border-white/10 group-hover:border-primary/50 group-hover:bg-primary/10 transition-colors">
                                    <MapPin className="w-6 h-6 text-primary" />
                                </div>
                                <div>
                                    <p className="font-bold text-lg text-white mb-1">Matriz</p>
                                    <p className="text-gray-400 text-sm max-w-xs">{COMPANY_INFO.units[0].address}</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 pt-8 border-t border-white/10 flex gap-4">
                            <a href={COMPANY_INFO.social.instagram} target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-pink-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href={COMPANY_INFO.social.facebook} target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-blue-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href={COMPANY_INFO.social.youtube} target="_blank" className="p-3 rounded-full bg-white/5 hover:bg-white/10 hover:text-red-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Form Column */}
                    <div className="bg-white/5 border border-white/10 p-8 md:p-10 rounded-3xl backdrop-blur-md shadow-2xl relative">
                        <div className="absolute top-0 right-0 p-8 opacity-20">
                            <Send className="w-24 h-24 text-white rotate-12" />
                        </div>

                        <h3 className="text-2xl font-bold text-white mb-2">Solicite uma Proposta</h3>
                        <p className="text-gray-400 text-sm mb-8">Informe os dados abaixo e continue seu pedido de orçamento pelo WhatsApp.</p>

                        <QuoteWhatsAppForm />
                    </div>
                </div>
            </div>
        </section>
    );
}
