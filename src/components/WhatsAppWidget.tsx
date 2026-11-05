"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// The financing route already provides inline support. Avoid downloading the
// animated chat and its dependencies on this route, not just hiding the UI.
const WhatsAppChat = dynamic(() => import("./WhatsAppChat"), { ssr: false });

export function WhatsAppWidget() {
    const pathname = usePathname();
    if (pathname === "/simular-financiamento" || pathname?.startsWith("/simular-financiamento/")) return null;
    return <WhatsAppChat />;
}
