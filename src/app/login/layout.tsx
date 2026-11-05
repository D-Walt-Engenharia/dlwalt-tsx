import type { Metadata } from "next";
export const metadata: Metadata = { title: "Acesso | DWalt Energia", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return children; }
