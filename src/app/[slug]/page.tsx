import { RegionalLanding } from "@/components/regional/RegionalLanding";
import { notFound } from "next/navigation";
import { findRegionalPage, regionalPages } from "@/lib/regional-pages";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Metadata } from "next";
import { regionalDescription } from "@/lib/regional-local-content";

export const revalidate = 300;

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

    const title = `${service.title} em ${city} - RO | DWalt Energia`;
    const description = regionalDescription(city, service);

    return {
        title,
        description,
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
                    height: 788,
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

    const description = regionalDescription(city, service);

    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${SITE_URL}/${canonical}#service`,
        "name": `${service.title} em ${city}`,
        "serviceType": service.title,
        "description": description,
        "provider": { "@id": ORGANIZATION_ID },
        "areaServed": { "@type": "City", "name": city, "containedInPlace": { "@type": "State", "name": "Rondônia" } },
        "url": `${SITE_URL}/${canonical}`,
    };

    const breadcrumb = {
        '@context': 'https://schema.org', '@type': 'BreadcrumbList',
        itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Início', item: SITE_URL },
            { '@type': 'ListItem', position: 2, name: 'Cidades atendidas', item: `${SITE_URL}/areas-de-atendimento` },
            { '@type': 'ListItem', position: 3, name: `${service.title} em ${city}`, item: `${SITE_URL}/${canonical}` },
        ],
    };
    return <><JsonLd data={jsonLd} /><JsonLd data={breadcrumb} /><RegionalLanding city={city} service={service} /></>;
}
