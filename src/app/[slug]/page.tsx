import { RegionalLanding } from "@/components/regional/RegionalLanding";
import { notFound } from "next/navigation";
import { findRegionalPage, regionalPages } from "@/lib/regional-pages";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Metadata } from "next";

// Redirects are defined before the filesystem, keeping only canonical pages static.
export function generateStaticParams() {
    return regionalPages().map(({ canonical }) => ({ slug: canonical }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
    return findRegionalPage(slug);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        return {};
    }

    const { service, city, canonical } = data;

    const title = `${service.title} em ${city} (RO) | Energia Solar DWalt`;
    const description = `Economize com ${service.title} em ${city}. ${service.pain.split('?')[0]}? A DWalt oferece projetos de energia solar, instalação e manutenção. Peça um orçamento!`;
    const keywords = [
        "energia solar",
        "placa solar",
        "painel solar",
        "economia de energia",
        "dwalt energia",
        service.title.toLowerCase(),
        `energia solar em ${city.toLowerCase()}`,
        `instalador solar ${city.toLowerCase()}`,
        "rondonia",
        "sustentabilidade"
    ];

    return {
        title,
        description,
        keywords: keywords.join(", "),
        alternates: {
            canonical: `${SITE_URL}/${canonical}`,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}/${canonical}`,
            siteName: "DWalt Energia",
            locale: "pt_BR",
            type: "website",
            images: [
                {
                    url: "/regional-casa-modelo01.webp",
                    width: 1400,
                    height: 792,
                    alt: "Imagem ilustrativa de uma casa com painéis solares",
                },
            ],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: ["/regional-casa-modelo01.webp"],
        },
        robots: {
            index: true,
            follow: true,
        }
    };
}

export default async function LandingPage({ params }: Props) {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        notFound();
    }

    const { service, city, canonical } = data;

    const description = `Economize com ${service.title} em ${city}. ${service.pain.split('?')[0]}? A DWalt oferece projetos de energia solar, instalação e manutenção.`;

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "name": `${service.title} em ${city}`,
        "serviceType": service.title,
        "description": description,
        "provider": { "@id": ORGANIZATION_ID },
        "areaServed": { "@type": "City", "name": city, "containedInPlace": { "@type": "State", "name": "Rondônia" } },
        "url": `${SITE_URL}/${canonical}`,
    };

    return <><JsonLd data={jsonLd} /><RegionalLanding city={city} service={service} /></>;
}
