import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { Calendar, ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getContentPage } from '@/lib/public-content';
import { pageMetadata, plainText } from '@/lib/seo';
import type { Metadata } from 'next';

type Props = { searchParams: Promise<{ page?: string }> };
function pageNumber(value?: string) {
    const page = Number(value);
    return Number.isSafeInteger(page) && page > 0 ? page : 1;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
    const page = pageNumber((await searchParams).page);
    return pageMetadata(`Blog sobre energia solar em Rondônia${page > 1 ? ` - Página ${page}` : ''} | DWalt Energia`, 'Artigos e informações sobre projetos, instalação, manutenção e energia solar em Rondônia.', page > 1 ? `/blog?page=${page}` : '/blog');
}

export default async function BlogPage({ searchParams }: Props) {
    const currentPage = pageNumber((await searchParams).page);
    const postsData = await getContentPage('posts', currentPage, 6);
    if (currentPage > 1 && postsData.data.length === 0) notFound();
    const totalPages = Math.ceil(postsData.total / postsData.limit);
    const posts = postsData.data.filter(post => post.status !== 'draft');
    return (
        <div className="flex flex-col min-h-screen bg-black text-white">
            <Header />
            <main className="flex-grow pt-32 pb-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-16 space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium"><BookOpen className="w-4 h-4" />Blog &amp; Notícias</div>
                        <h1 className="text-4xl md:text-6xl font-bold">Conteúdo para um <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">Mundo Sustentável</span></h1>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {posts.map(post => (
                            <article key={post.id} className="group bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-blue-500/50 hover:bg-white/10 transition-all duration-300 flex flex-col">
                                <div className="h-56 bg-gray-800 relative overflow-hidden">
                                    {post.thumbnailUrl ? <img src={post.thumbnailUrl} alt={post.title} width={800} height={450} loading="lazy" decoding="async" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80 group-hover:opacity-100" /> : <div className="w-full h-full flex items-center justify-center bg-gray-900 text-gray-500"><BookOpen className="w-12 h-12" /></div>}
                                    {post.category && <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 text-white text-xs font-bold px-3 py-1 rounded-full">{post.category}</div>}
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <div className="flex items-center gap-1 text-xs text-gray-400 mb-4"><Calendar className="w-3 h-3" />{new Date(post.createdAt).toLocaleDateString('pt-BR', { timeZone: 'America/Porto_Velho' })}</div>
                                    <h2 className="text-xl font-bold text-white mb-3 line-clamp-2 group-hover:text-blue-400"><Link href={`/blog/${post.slug || post.id}`}>{post.title}</Link></h2>
                                    <p className="text-gray-400 mb-6 line-clamp-3 flex-grow text-sm leading-relaxed">{plainText(post.excerpt || post.content).slice(0, 160)}</p>
                                    <Link href={`/blog/${post.slug || post.id}`} className="inline-flex items-center text-blue-400 font-semibold hover:text-blue-300 mt-auto text-sm">Ler artigo completo <ArrowRight className="w-4 h-4 ml-2" /></Link>
                                </div>
                            </article>
                        ))}
                    </div>
                    {totalPages > 1 && <nav aria-label="Páginas do blog" className="flex justify-center items-center mt-12 gap-4">
                        {currentPage > 1 && <Link href={currentPage === 2 ? '/blog' : `/blog?page=${currentPage - 1}`} aria-label="Página anterior" className="p-3 rounded-lg bg-white/5 hover:bg-white/10"><ChevronLeft className="w-5 h-5" /></Link>}
                        <span className="text-gray-300">Página {currentPage} de {totalPages}</span>
                        {currentPage < totalPages && <Link href={`/blog?page=${currentPage + 1}`} aria-label="Próxima página" className="p-3 rounded-lg bg-white/5 hover:bg-white/10"><ChevronRight className="w-5 h-5" /></Link>}
                    </nav>}
                </div>
            </main>
            <Footer />
        </div>
    );
}
