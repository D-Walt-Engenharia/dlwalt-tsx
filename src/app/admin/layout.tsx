import type { Metadata } from "next";
import AdminShell from "./AdminShell";
export const metadata: Metadata = { title: "Administração | DWalt Energia", robots: { index: false, follow: false } };
export default function Layout({ children }: { children: React.ReactNode }) { return <AdminShell>{children}</AdminShell>; }
