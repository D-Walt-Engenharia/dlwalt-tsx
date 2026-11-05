import type { Metadata } from "next";
import { organizationSchema, SITE_URL } from "@/lib/seo";
import { GA4_MEASUREMENT_ID } from "@/lib/analytics";
import Script from "next/script";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";
import { SmoothScroll } from "@/components/SmoothScroll";
import { Toaster } from 'sonner';
import { AuthProvider } from "@/providers/auth-provider";
import { WhatsAppTracking } from "@/components/WhatsAppTracking";
import { WhatsAppWidget } from "@/components/WhatsAppWidget";
import { ScriptRenderer } from "@/components/ScriptRenderer";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "DWalt Energia | Soluções em Energia Solar",
  description: "Transforme sua conta de luz em investimento com a DWalt Energia. Projetos personalizados, economia de até 95% e tecnologia de ponta.",
  openGraph: {
    title: "DWalt Energia | Energia Solar",
    description: "Economize até 95% na conta de luz com energia solar fotovoltaica. Solicite seu orçamento.",
    type: "website",
    locale: "pt_BR",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let scripts: any[] = [];
  const configuredApi = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");
  const primaryApi = configuredApi || (process.env.NODE_ENV === "development" ? "http://localhost:3000/api" : "https://api.dwalt.net/api");
  // With an explicit test/staging URL, never fall back to production scripts.
  const fallbackApi = configuredApi || "https://api.dwalt.net/api";

  try {
    let res = await fetch(`${primaryApi}/scripts`, {
      next: { revalidate: 60 }
    }).catch(() => null);

    // If local dev server returned error or is offline, fallback to production api
    if (!res || !res.ok) {
      res = await fetch(`${fallbackApi}/scripts`, {
        next: { revalidate: 60 }
      }).catch(() => null);
    }

    if (res && res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // Exclude script entries that duplicate Google tag AW-10800412438, which is loaded directly with Next.js Script
        scripts = data.filter((s: any) => s.isActive && !s.code?.includes("AW-10800412438") && !s.code?.includes(GA4_MEASUREMENT_ID));
      }
    }
  } catch (error) {
    console.error("Failed to fetch scripts:", error);
  }

  const jsonLd = organizationSchema();

  const headScripts = scripts.filter((s: any) => !s.position || s.position === "head");
  const bodyScripts = scripts.filter((s: any) => s.position === "body_start" || s.position === "body_end");

  return (
    <html lang="pt-BR" className="dark">
      <head>
        {/* Core Google tag (gtag.js) for AW-10800412438 loaded directly with Next Script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-10800412438"
          strategy="beforeInteractive"
        />
        <Script id="google-analytics-init" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-10800412438');
            gtag('config', '${GA4_MEASUREMENT_ID}');
          `}
        </Script>

        {headScripts.map((script: any) => (
          <ScriptRenderer
            key={`script-head-${script.id}`}
            id={script.id}
            code={script.code}
            position="head"
          />
        ))}
      </head>
      <body
        className="antialiased bg-background text-foreground"
      >
        {bodyScripts.map((script: any) => (
          <ScriptRenderer
            key={`script-body-${script.id}`}
            id={script.id}
            code={script.code}
            position={script.position}
          />
        ))}

        <AuthProvider>
          <SmoothScroll />
          <JsonLd data={jsonLd} />
          {children}
          <WhatsAppTracking />
          <WhatsAppWidget />
          <Toaster richColors position="top-center" closeButton />
        </AuthProvider>
      </body>
    </html>
  );
}
