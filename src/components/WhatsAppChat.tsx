"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "./ui/button";
import { COMPANY_INFO } from "@/lib/data/company";
import { trackContact } from "@/lib/tracking";

export default function WhatsAppChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isOpen) setShowTooltip(true);
        }, 5000);
        return () => clearTimeout(timer);
    }, [isOpen]);

    const handleOpenChat = () => {
        const nextState = !isOpen;
        setIsOpen(nextState);
        setShowTooltip(false);
    };

    const handleStartConversation = () => {
        trackContact("widget_whatsapp");
        window.open(`https://wa.me/${COMPANY_INFO.contact.whatsapp}`, "_blank");
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, y: 20, transformOrigin: "bottom right" }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.8, y: 20 }}
                        className="mb-4 w-[320px] sm:w-[360px] overflow-hidden rounded-2xl bg-card border border-border shadow-2xl"
                    >
                        {/* Header */}
                        <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center overflow-hidden">
                                        <img src="/logo-branca.svg" alt="DWalt" width={24} height={6} className="w-6 h-auto" />
                                    </div>
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-primary rounded-full" />
                                </div>
                                <div>
                                    <p className="font-bold text-sm">DWalt Energia</p>
                                    <p className="text-[10px] opacity-80">Online agora</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                aria-label="Fechar atendimento pelo WhatsApp"
                                className="p-1 hover:bg-black/10 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body / Simulated Chat */}
                        <div className="p-4 space-y-4 max-h-[300px] overflow-y-auto bg-accent/30">
                            <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm border border-border/50 max-w-[85%]">
                                <p className="text-sm">
                                    Olá! 👋 Seja bem-vindo à DWalt Energia. Como podemos ajudar você hoje?
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-1 block">10:00</span>
                            </div>

                            <div className="bg-card p-3 rounded-2xl rounded-tl-none shadow-sm border border-border/50 max-w-[85%]">
                                <p className="text-sm">
                                    Quer parar de pagar contas altas? Peça sua simulação personalizada. Nossos especialistas avaliam seu caso para garantir o máximo de eficiência e economia.
                                </p>
                                <span className="text-[10px] text-muted-foreground mt-1 block">10:01</span>
                            </div>
                        </div>

                        {/* Footer / Action */}
                        <div className="p-4 bg-card border-t border-border">
                            <Button
                                onClick={handleStartConversation}
                                className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold gap-2 h-12 rounded-xl"
                            >
                                <Send className="w-4 h-4 text-white" />
                                Iniciar Conversa
                            </Button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Bubble Button */}
            <div className="relative">
                <AnimatePresence>
                    {showTooltip && (
                        <motion.div
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                            className="absolute bottom-full right-0 mb-4 mr-2 whitespace-nowrap bg-background border border-border px-4 py-2 rounded-xl shadow-lg text-sm font-medium"
                        >
                            Fale com um especialista! ☀️
                            <div className="absolute top-full right-4 w-2 h-2 bg-background border-r border-b border-border rotate-45 -translate-y-1" />
                        </motion.div>
                    )}
                </AnimatePresence>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleOpenChat}
                    aria-label={isOpen ? "Fechar atendimento pelo WhatsApp" : "Abrir atendimento pelo WhatsApp"}
                    aria-expanded={isOpen}
                    className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-shadow relative"
                >
                    {isOpen ? (
                        <X className="w-7 h-7" />
                    ) : (
                        <>
                            <MessageCircle className="w-7 h-7" />
                            <span className="absolute -top-1 -right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
                            </span>
                        </>
                    )}
                </motion.button>
            </div>
        </div>
    );
}
