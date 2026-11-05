'use client';

import React from 'react';
import { MapPin, Phone, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { trackContact } from '@/lib/tracking';

interface OfficeCardProps {
    unit: {
        name: string;
        address: string;
        phone: string;
        whatsapp: string;
        mapEmbedUrl: string;
    };
}

const OfficeCard: React.FC<OfficeCardProps> = ({ unit }) => {
    return (
        <div className="bg-white/5 border border-white/10 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-primary/50 transition-all duration-300 group">
            <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-primary transition-colors">{unit.name}</h3>

                <div className="space-y-4 mb-8">
                    <div className="flex items-start gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <MapPin className="w-5 h-5" />
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed">{unit.address}</p>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <Phone className="w-5 h-5" />
                        </div>
                        <p className="text-gray-400 text-sm">{unit.phone}</p>
                    </div>
                </div>

                <div className="flex gap-3">
                    <Button
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                        onClick={() => { trackContact('unidade_whatsapp'); window.open(`https://wa.me/${unit.whatsapp}`, '_blank', 'noopener,noreferrer'); }}
                    >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        WhatsApp
                    </Button>
                </div>
            </div>

            <div className="w-full h-[250px] relative filter grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <iframe
                    src={unit.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="absolute inset-0 w-full h-full"
                />
            </div>
        </div>
    );
};

export default OfficeCard;
