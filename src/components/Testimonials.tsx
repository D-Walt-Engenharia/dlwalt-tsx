'use client';

import React, { useState, useEffect } from 'react';
import { Star, MapPin, Play, Quote, ChevronLeft, ChevronRight } from 'lucide-react';
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from '@/hooks/use-media-query';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    image: string;
    text: string;
    rating?: number;
    videoUrl?: string; // YouTube Embed URL
}

import api from '@/lib/api';

interface Testimonial {
    id: number;
    name: string;
    location: string;
    avatar: string; // Changed from image to match API or mapped
    testimonial: string; // Changed from text
    stars: number; // Changed from rating
    url?: string; // Changed from videoUrl
}

// Helper function to extract YouTube ID
const getYouTubeId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

export function Testimonials() {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 768px) and (max-width: 1023px)');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const fetchTestimonials = async () => {
            try {
                const { data } = await api.get("/testimonials");
                // Handle different response structures as seen in admin pages
                let receivedData = [];
                if (Array.isArray(data.data)) {
                    receivedData = data.data;
                } else if (data.data?.data && Array.isArray(data.data.data)) {
                    receivedData = data.data.data;
                }
                setTestimonials(receivedData);
            } catch (error) {
                console.error("Failed to fetch testimonials", error);
            }
        };
        fetchTestimonials();
    }, []);

    const itemsToShow = mounted ? (isDesktop ? 3 : isTablet ? 2 : 1) : 3;

    const nextSlide = () => {
        setCurrentIndex((prev) =>
            prev + 1 > testimonials.length - itemsToShow ? 0 : prev + 1
        );
    };

    const prevSlide = () => {
        setCurrentIndex((prev) =>
            prev - 1 < 0 ? testimonials.length - itemsToShow : prev - 1
        );
    };

    // Auto visual adjust if resizing window
    useEffect(() => {
        const maxIndex = testimonials.length - itemsToShow;
        if (currentIndex > maxIndex) {
            setCurrentIndex(Math.max(0, maxIndex));
        }
    }, [itemsToShow, currentIndex, testimonials.length]);

    if (!testimonials.length) return null;

    return (
        <section className="py-24 bg-black relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <Quote className="w-4 h-4" />
                        O que dizem nossos clientes
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold text-white">
                        Histórias de quem já <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-300">
                            gera a própria energia
                        </span>
                    </h2>
                </div>

                <div className="relative group/slider">
                    <div className="overflow-hidden">
                        <motion.div
                            className="flex"
                            animate={{ x: `-${currentIndex * (100 / testimonials.length)}%` }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            style={{
                                width: `${(testimonials.length * 100) / itemsToShow}%`,
                            }}
                        >
                            {testimonials.map((t) => {
                                const videoId = t.url ? getYouTubeId(t.url) : null;
                                const thumbnailUrl = videoId
                                    ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
                                    : `https://images.unsplash.com/photo-1548613053-220d938b8ca7?w=800&q=80`;
                                const embedUrl = videoId
                                    ? `https://www.youtube.com/embed/${videoId}?autoplay=1`
                                    : t.url;

                                return (
                                    <div
                                        key={t.id}
                                        className="px-4" // Use padding to simulate gap
                                        style={{ width: `${100 / testimonials.length}%` }}
                                    >
                                        <div className="bg-zinc-900/50 border border-white/5 rounded-3xl p-8 flex flex-col backdrop-blur-sm hover:border-primary/30 transition-colors group h-full">
                                            {/* Video Thumbnail if exists */}
                                            {t.url && (
                                                <Dialog>
                                                    <DialogTrigger asChild>
                                                        <div className="w-full aspect-video rounded-xl bg-zinc-800 mb-6 relative overflow-hidden cursor-pointer group/video border border-white/5">
                                                            <div className="absolute inset-0 bg-black/40 group-hover/video:bg-black/20 transition-colors z-10" />
                                                            <img
                                                                src={thumbnailUrl}
                                                                className="w-full h-full object-cover opacity-60"
                                                                alt="Thumbnail do depoimento"
                                                            />
                                                            <div className="absolute inset-0 flex items-center justify-center z-20">
                                                                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/30 group-hover/video:scale-110 transition-transform">
                                                                    <Play className="w-5 h-5 text-black fill-black ml-1" />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </DialogTrigger>
                                                    <DialogContent className="bg-black border-zinc-800 p-0 overflow-hidden max-w-4xl aspect-video">
                                                        <DialogTitle className="sr-only">Depoimento de {t.name}</DialogTitle>
                                                        <iframe
                                                            width="100%"
                                                            height="100%"
                                                            src={embedUrl}
                                                            title={`Depoimento de ${t.name}`}
                                                            frameBorder="0"
                                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                                            allowFullScreen
                                                        />
                                                    </DialogContent>
                                                </Dialog>
                                            )}

                                            {/* Stars */}
                                            {t.stars && (
                                                <div className="flex gap-1 mb-4">
                                                    {[...Array(t.stars)].map((_, i) => (
                                                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                                    ))}
                                                </div>
                                            )}

                                            {/* Text */}
                                            <div className="flex-grow mb-8">
                                                <p className={`text-gray-300 italic leading-relaxed ${expandedId === t.id ? '' : 'line-clamp-6'}`}>
                                                    "{t.testimonial}"
                                                </p>
                                                {t.testimonial.length > 150 && (
                                                    <button
                                                        onClick={() => setExpandedId(expandedId === t.id ? null : t.id)}
                                                        className="text-primary text-sm font-semibold mt-2 hover:underline focus:outline-none"
                                                    >
                                                        {expandedId === t.id ? 'Recolher' : 'Ler tudo'}
                                                    </button>
                                                )}
                                            </div>

                                            {/* Author Profile */}
                                            <div className="flex items-center gap-4 mt-auto pt-6 border-t border-white/5">
                                                <img src={t.avatar || "/placeholder-user.png"} width={48} height={48} loading="lazy" decoding="async" alt={t.name} className="w-12 h-12 rounded-full border-2 border-primary/20 object-cover" />
                                                <div>
                                                    <h4 className="font-bold text-white leading-tight mb-1">{t.name}</h4>
                                                    <div className="flex items-center gap-1 text-xs text-gray-400">
                                                        <MapPin className="w-3 h-3 text-primary" />
                                                        <span>{t.location}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </motion.div>
                    </div>

                    {/* Navigation Buttons */}
                    <button
                        onClick={prevSlide}
                        className="absolute top-1/2 -left-4 md:-left-12 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors z-20"
                        aria-label="Anterior"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={nextSlide}
                        className="absolute top-1/2 -right-4 md:-right-12 -translate-y-1/2 w-10 h-10 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-white hover:bg-primary hover:text-black transition-colors z-20"
                        aria-label="Próximo"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>

                    {/* Dots indicators */}
                    <div className="flex justify-center gap-2 mt-8">
                        {Array.from({ length: Math.max(0, testimonials.length - itemsToShow + 1) }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setCurrentIndex(index)}
                                className={`w-2 h-2 rounded-full transition-all ${index === currentIndex ? 'bg-primary w-6' : 'bg-white/20 hover:bg-white/40'
                                    }`}
                                aria-label={`Ir para a página ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
