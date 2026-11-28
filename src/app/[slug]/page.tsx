import { RegionalLanding } from "@/components/regional/RegionalLanding";
import { notFound } from "next/navigation";
import { findRegionalPage, regionalBreadcrumbs, regionalPages } from "@/lib/regional-pages";
import { ORGANIZATION_ID, SITE_URL } from "@/lib/seo";
import { JsonLd } from "@/components/JsonLd";
import { Metadata } from "next";
import { regionalDescription, regionalTitle } from "@/lib/regional-local-content";

import { getRegionalEvidence } from "@/components/regional/RegionalEvidence";

export const revalidate = 300;

// Redirects are defined before the filesystem, keeping only canonical pages static.
export function generateStaticParams() {
    return regionalPages().map(({ canonical }) => ({ slug: canonical }));
}

interface Props {
    params: Promise<{ slug: string }>;
}

async function getData(slug: string) {
    const page = findRegionalPage(slug);
    if (!page) return null;
    const evidence = await getRegionalEvidence(page.city);
    return { ...page, evidence, description: regionalDescription(page.city, page.service, evidence.localProjects[0]) };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const data = await getData(slug);

    if (!data) {
        return {};
    }

    const { service, city, canonical, description } = data;
    const title = regionalTitle(city, service);

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

    const { service, city, canonical, evidence, description } = data;
    const trail = regionalBreadcrumbs(city, service, canonical);

    const jsonLd = city === 'Rolim de Moura' ? {
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: regionalTitle(city, service),
        description,
        url: `${SITE_URL}/${canonical}`,
        publisher: { '@id': ORGANIZATION_ID },
    } : {
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
        itemListElement: trail.map((link, index) => ({
            '@type': 'ListItem', position: index + 1, name: link.name, item: new URL(link.href, SITE_URL).href,
        })),
    };
    return <><JsonLd data={jsonLd} /><JsonLd data={breadcrumb} /><RegionalLanding city={city} service={service} evidence={evidence} trail={trail} /></>;
}
