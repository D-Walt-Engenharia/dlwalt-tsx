import type { MetadataRoute } from 'next';
import { regionalPages } from '@/lib/regional-pages';
import { getAllContent } from '@/lib/public-content';
import { SITE_URL } from '@/lib/seo';

export const revalidate = 300;

function changedAt(value?: string): Pick<MetadataRoute.Sitemap[number], 'lastModified'> {
    return value && Number.isFinite(Date.parse(value)) ? { lastModified: new Date(value) } : {};
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, projects] = await Promise.all([getAllContent('posts'), getAllContent('projects')]);
    const routes = ['', '/blog', '/projetos', '/calculadora-solar', '/simular-financiamento', '/solicitar-orcamento', '/unidades', '/areas-de-atendimento', '/politica-de-privacidade', '/termos-de-uso'];
    return [
        ...routes.map(path => ({ url: `${SITE_URL}${path || '/'}` })),
        ...regionalPages().map(({ canonical }) => ({ url: `${SITE_URL}/${canonical}` })),
        ...posts.filter(post => post.status !== 'draft' && post.slug).map(post => ({ url: `${SITE_URL}/blog/${encodeURIComponent(post.slug)}`, ...changedAt(post.updatedAt || post.createdAt) })),
        ...projects.map(project => ({ url: `${SITE_URL}/projetos/${project.id}`, ...changedAt(project.updatedAt || project.createdAt) })),
    ];
}
