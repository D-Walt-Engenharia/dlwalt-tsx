import type { Post } from '../types';

export interface PublicProject {
    id: number;
    name: string;
    category: string;
    location: string;
    description: string;
    photos: string[];
    panelCount: number;
    kwp: string | number;
    createdAt?: string;
    updatedAt?: string;
}

type Collection<T> = { data: T[]; total: number; page: number; limit: number };
type PublicEndpoint = 'posts' | 'projects';
type ContentFor<E extends PublicEndpoint> = E extends 'posts' ? Post : PublicProject;

function unwrap(value: unknown): unknown {
    for (let depth = 0; depth < 4; depth++) {
        if (!value || typeof value !== 'object' || Array.isArray(value)) break;
        const record = value as Record<string, unknown>;
        if (!('data' in record) || Array.isArray(record.data)) break;
        value = record.data;
    }
    return value;
}

/** Accept the API's wrapped array and paginated response shapes. */
export function contentCollection<T>(value: unknown, page = 1, limit = 100): Collection<T> {
    const unwrapped = unwrap(value);
    if (Array.isArray(unwrapped)) return { data: unwrapped as T[], total: unwrapped.length, page: 1, limit: Math.max(unwrapped.length, 1) };
    if (!unwrapped || typeof unwrapped !== 'object') throw new Error('Invalid public content response');
    const body = unwrapped as Record<string, unknown>;
    if (!Array.isArray(body.data)) throw new Error('Invalid public content collection');
    const positive = (value: unknown, fallback: number) => Number.isFinite(Number(value)) && Number(value) > 0 ? Number(value) : fallback;
    return { data: body.data as T[], total: positive(body.total, body.data.length), page: positive(body.page, page), limit: positive(body.limit, limit) };
}

async function publicRequest(path: string) {
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || 'https://api.dwalt.net/api').replace(/\/$/, '');
    const response = await fetch(`${base}/${path}`, { next: { revalidate: 300 }, signal: AbortSignal.timeout(15000) });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Public content request failed (${response.status})`);
    return response.json() as Promise<unknown>;
}

export async function getContentPage<E extends PublicEndpoint>(endpoint: E, page = 1, limit = 100) {
    const response = await publicRequest(`${endpoint}?page=${page}&limit=${limit}`);
    if (response === null) throw new Error('Public content endpoint unavailable');
    return contentCollection<ContentFor<E>>(response, page, limit);
}

export async function getAllContent<E extends PublicEndpoint>(endpoint: E): Promise<ContentFor<E>[]> {
    const first = await getContentPage(endpoint);
    const results = [...first.data];
    const ids = new Set(results.map(item => item.id));
    const pageCount = Math.ceil(first.total / first.limit);
    if (pageCount > 200) throw new Error('Public content pagination exceeds supported size');
    for (let page = 2; page <= pageCount; page++) {
        const next = await getContentPage(endpoint, page, first.limit);
        const newItems = next.data.filter(item => !ids.has(item.id));
        // Do not silently drop content when an API stops honoring pagination.
        if (newItems.length === 0 && results.length < first.total) throw new Error('Incomplete public content pagination');
        newItems.forEach(item => ids.add(item.id));
        results.push(...newItems);
    }
    return results;
}

export async function getPublicPost(slug: string): Promise<Post | null> {
    const body = await publicRequest(`posts/${encodeURIComponent(slug)}`);
    const post = unwrap(body) as Post | null;
    if (!post || post.status === 'draft') return null;
    if (!post.id || !post.title || typeof post.content !== 'string') throw new Error('Invalid public post');
    return post;
}

export async function getPublicProject(id: string): Promise<PublicProject | null> {
    if (!/^\d+$/.test(id)) return null;
    const body = await publicRequest(`projects/${id}`);
    const project = unwrap(body) as PublicProject | null;
    if (!project) return null;
    if (!project.id || !project.name) throw new Error('Invalid public project');
    return project;
}
