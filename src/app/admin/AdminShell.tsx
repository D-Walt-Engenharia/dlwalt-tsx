"use client";

import { useAuth } from "@/providers/auth-provider";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { LayoutDashboard, FileText, Users, LogOut, Menu, X, Zap, MessageSquare, Code } from "lucide-react";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        if (!loading && !user) {
            router.push("/login");
        }
    }, [user, loading, router]);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
            </div>
        );
    }

    if (!user) return null;

    const NavContent = () => (
        <>
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
                <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">
                    DWalt Admin
                </h1>
                {/* Close button for mobile inside drawer */}
                <button onClick={() => setIsMobileMenuOpen(false)} className="md:hidden text-gray-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    href="/admin"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname === "/admin"
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <LayoutDashboard className="w-5 h-5" />
                    Dashboard
                </Link>
                <Link
                    href="/admin/financiamentos"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/financiamentos")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    Simulações
                </Link>
                <Link
                    href="/admin/projects"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/projects")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <Zap className="w-5 h-5" />
                    Projetos
                </Link>
                <Link
                    href="/admin/testimonials"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/testimonials")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <MessageSquare className="w-5 h-5" />
                    Depoimentos
                </Link>
                <Link
                    href="/admin/posts"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/posts")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    Posts
                </Link>
                <Link
                    href="/admin/users"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/users")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <Users className="w-5 h-5" />
                    Usuários
                </Link>
                <Link
                    href="/admin/scripts"
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${pathname.startsWith("/admin/scripts")
                        ? "bg-green-600/10 text-green-400 border border-green-600/20"
                        : "hover:bg-white/5 text-gray-400 hover:text-white"
                        }`}
                >
                    <Code className="w-5 h-5" />
                    Scripts
                </Link>
            </nav>

            <div className="p-4 border-t border-white/10">
                <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-xl">
                    <div className="flex flex-col overflow-hidden mr-2">
                        <span className="text-sm font-medium text-white truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                    </div>
                    <button onClick={() => logout()} className="text-gray-400 hover:text-red-400 transition-colors shrink-0">
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </>
    );

    return (
        <div className="flex h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Sidebar Desktop */}
            <aside className="w-64 border-r border-white/10 bg-black/50 hidden md:flex flex-col">
                <NavContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div className="fixed inset-0 z-50 md:hidden flex">
                    <div className="relative w-64 max-w-[80%] bg-zinc-900 border-r border-white/10 flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-200">
                        <NavContent />
                    </div>
                    <div
                        className="flex-1 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                        onClick={() => setIsMobileMenuOpen(false)}
                    />
                </div>
            )}

            {/* Main Content */}
            <main className="flex-1 flex flex-col h-full overflow-hidden">
                {/* Mobile Header */}
                <header className="md:hidden h-16 border-b border-white/10 flex items-center justify-between px-4 bg-black/50 shrink-0">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsMobileMenuOpen(true)} className="text-gray-400 hover:text-white">
                            <Menu className="w-6 h-6" />
                        </button>
                        <span className="font-bold text-lg">DWalt Admin</span>
                    </div>

                    {/* Optional: Add user avatar or simpler logout here if desired, keeping it clean for now */}
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
