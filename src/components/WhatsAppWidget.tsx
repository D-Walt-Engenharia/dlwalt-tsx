"use client";

import { isRegionalRoute } from "@/lib/regional-route";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

// The financing route already provides inline support. Avoid downloading the
// animated chat and its dependencies on this route, not just hiding the UI.
const WhatsAppChat = dynamic(() => import("./WhatsAppChat"), { ssr: false });

export function WhatsAppWidget() {
    const pathname = usePathname();
    const [quoteState, setQuoteState] = useState({ pathname, visible: false });
    useEffect(() => {
        const contact = document.getElementById('contact');
        if (!contact || typeof IntersectionObserver === 'undefined') return;
        // Keep the floating chat from covering the quote fields and primary button.
        const observer = new IntersectionObserver(([entry]) => setQuoteState({ pathname, visible: entry.isIntersecting }));
        observer.observe(contact);
        return () => observer.disconnect();
    }, [pathname]);
    if (pathname === "/solicitar-orcamento" || pathname?.startsWith("/solicitar-orcamento/")) return null;
    if (quoteState.pathname === pathname && quoteState.visible) return null;
    if (pathname === "/simular-financiamento" || pathname?.startsWith("/simular-financiamento/")) return null;
    // The approved regional layout provides its own visible contact buttons.
    if (isRegionalRoute(pathname)) return null;
    return <WhatsAppChat />;
}
