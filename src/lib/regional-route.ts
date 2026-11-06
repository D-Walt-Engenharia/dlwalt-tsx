/** Small client-safe guard: do not bundle regional content in shared widgets. */
export function isRegionalRoute(pathname: string | null): boolean {
    return /^\/(?:energia-solar(?:-residencial|-empresarial|-industrial)?|manutencao-e-limpeza|instalacao-fotovoltaica|engenharia-eletrica|afiliados)-em-[^/]+\/?$/.test(pathname ?? '');
}
