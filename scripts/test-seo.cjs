const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Module = require('node:module');
const ts = require('typescript');
const root = path.resolve(__dirname, '..');
const modules = new Map();

// Compile just the pure TypeScript modules, using the project's installed compiler.
function load(relative) {
    const file = path.resolve(root, relative);
    if (modules.has(file)) return modules.get(file).exports;
    if (file.endsWith('.json')) return JSON.parse(fs.readFileSync(file, 'utf8'));
    const mod = new Module(file, module);
    modules.set(file, mod);
    mod.filename = file;
    mod.paths = Module._nodeModulePaths(path.dirname(file));
    const originalRequire = mod.require.bind(mod);
    mod.require = specifier => {
        if (specifier.startsWith('.') || specifier.startsWith('@/')) {
            const candidate = specifier.startsWith('@/') ? path.join(root, 'src', specifier.slice(2)) : path.resolve(path.dirname(file), specifier);
            const resolved = ['', '.ts', '.json'].map(extension => candidate + extension).find(p => fs.existsSync(p) && fs.statSync(p).isFile());
            if (resolved) return load(path.relative(root, resolved));
        }
        return originalRequire(specifier);
    };
    const output = ts.transpileModule(fs.readFileSync(file, 'utf8'), { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, esModuleInterop: true } });
    mod._compile(output.outputText, file);
    return mod.exports;
}

test('all 416 regional destinations and aliases are unique and equivalent', async () => {
    const { regionalPages, findRegionalPage } = load('src/lib/regional-pages.ts');
    const { isRegionalRoute } = load('src/lib/regional-route.ts');
    const pages = regionalPages();
    assert.equal(pages.length, 416);
    assert.equal(new Set(pages.flatMap(p => [p.canonical, p.alias])).size, 832);
    for (const page of pages) {
        assert.equal(isRegionalRoute('/' + page.canonical), true);
        assert.equal(isRegionalRoute('/' + page.alias), true);
        assert.equal(findRegionalPage(page.alias).canonical, page.canonical);
        assert.equal(findRegionalPage(page.canonical).city, page.city);
    }
    for (const route of ['/', '/simular-financiamento', '/solicitar-orcamento', '/projetos/1', '/blog', '/login', '/areas-de-atendimento']) assert.equal(isRegionalRoute(route), false);
    assert.equal(findRegionalPage('pagina-inexistente'), null);
    assert.equal(findRegionalPage('energia-solar-em-cujubim').canonical, 'energia-solar-em-cujubim-ro');
    assert.equal(findRegionalPage('energia-solar-em-ariquemes-ro').canonical, 'energia-solar-em-ariquemes');
    const config = load('next.config.ts').default;
    const redirects = await config.redirects();
    assert.equal(redirects.length, 417);
    for (let i = 0; i < pages.length; i++) {
        assert.equal(redirects[i].source, '/' + pages[i].alias);
        assert.equal(redirects[i].destination, 'https://www.dwalt.net/' + pages[i].canonical);
        assert.equal(redirects[i].permanent, true);
    }
});

test('public collections support both deployed response shapes', () => {
    const { contentCollection } = load('src/lib/public-content.ts');
    assert.equal(contentCollection({ data: [{ id: 1 }] }).total, 1);
    assert.deepEqual(contentCollection({ data: { total: 3, page: 2, limit: 2, data: [{ id: 3 }] } }), { data: [{ id: 3 }], total: 3, page: 2, limit: 2 });
    assert.throws(() => contentCollection({ broken: true }), /Invalid/);
});

test('pagination includes later items and rejects a repeated first page', async () => {
    const originalFetch = global.fetch;
    const { getAllContent } = load('src/lib/public-content.ts');
    try {
        let calls = 0;
        global.fetch = async url => {
            calls++;
            const page = Number(new URL(url).searchParams.get('page'));
            return Response.json({ data: { data: page === 1 ? [{ id: 1 }, { id: 2 }] : [{ id: 3 }], total: 3, page, limit: 2 } });
        };
        assert.deepEqual((await getAllContent('projects')).map(p => p.id), [1, 2, 3]);
        assert.equal(calls, 2);
        global.fetch = async () => Response.json({ data: { data: [{ id: 1 }], total: 2, page: 1, limit: 1 } });
        await assert.rejects(getAllContent('projects'), /Incomplete/);
    } finally { global.fetch = originalFetch; }
});

test('content failures do not turn a temporary API failure into a missing page', async () => {
    const originalFetch = global.fetch;
    const { getPublicPost, getPublicProject } = load('src/lib/public-content.ts');
    try {
        global.fetch = async () => new Response('', { status: 404 });
        assert.equal(await getPublicProject('999999'), null);
        global.fetch = async () => new Response('', { status: 503 });
        await assert.rejects(getPublicProject('1'), /503/);
        global.fetch = async () => Response.json({ data: { id: 1, title: 'Draft', content: '', status: 'draft' } });
        assert.equal(await getPublicPost('draft'), null);
    } finally { global.fetch = originalFetch; }
});

test('sitemap has one URL per content and real modification dates only', async () => {
    const originalFetch = global.fetch;
    try {
        global.fetch = async url => Response.json({ data: url.includes('/posts?') ? [{ id: 1, slug: 'artigo', status: 'published', updatedAt: '2026-10-01' }, { id: 2, slug: 'rascunho', status: 'draft' }] : [{ id: 3 }] });
        const sitemap = await load('src/app/sitemap.ts').default();
        assert.equal(sitemap.length, 428);
        assert.equal(new Set(sitemap.map(item => item.url)).size, sitemap.length);
        assert.equal(sitemap.some(item => item.url.endsWith('/rascunho')), false);
        assert.equal(sitemap.find(item => item.url.endsWith('/projetos/3')).lastModified, undefined);
        assert.equal(sitemap.find(item => item.url.endsWith('/blog/artigo')).lastModified.toISOString(), '2026-10-01T00:00:00.000Z');
    } finally { global.fetch = originalFetch; }
});

test('organization uses real contact and no placeholder logo or ratings', () => {
    const { organizationSchema, pageMetadata } = load('src/lib/seo.ts');
    const schema = organizationSchema();
    assert.equal(schema.contactPoint.telephone, '+5569993695702');
    assert.equal(schema.logo, 'https://www.dwalt.net/logo-branca.svg');
    assert.equal(schema.sameAs.length, 3);
    assert.equal(JSON.stringify(schema).includes('aggregateRating'), false);
    assert.equal(pageMetadata('Título', '<p>Conteúdo &amp; teste</p>', '/teste').description, 'Conteúdo & teste');
});

test('GA4 lead is sent once for a confirmed record, without applicant values', () => {
    const memory = new Map();
    const events = [];
    global.window = { localStorage: { getItem: key => memory.get(key) || null, setItem: (key, value) => memory.set(key, value) }, gtag: (...args) => events.push(args) };
    try {
        const { trackConfirmedAnalyticsLead } = load('src/lib/analytics.ts');
        assert.equal(trackConfirmedAnalyticsLead('record-test-123'), 'queued');
        assert.equal(trackConfirmedAnalyticsLead('record-test-123'), 'duplicate');
        assert.equal(trackConfirmedAnalyticsLead('invalid record'), 'invalid');
        assert.equal(events.length, 1);
        assert.equal(events[0][1], 'generate_lead');
        assert.deepEqual(Object.keys(events[0][2]).sort(), ['event_id', 'lead_source', 'send_to']);
    } finally { delete global.window; }
});

test('project evidence matches the city, accents and state without borrowing nearby works', () => {
    const { projectCity, projectsInCity, unitInCity } = load('src/lib/local-evidence.ts');
    assert.equal(projectCity({ location: 'CACAULANDIA-RO' }), 'Cacaulândia');
    assert.equal(projectCity({ location: 'Condomínio Jardins, Ariquemes / RO' }), 'Ariquemes');
    assert.equal(projectCity({ location: 'Ji-Paraná, Rondônia, Brasil' }), 'Ji-Paraná');
    assert.equal(projectCity({ location: 'Nova Brasilândia D’Oeste - RO' }), "Nova Brasilândia D'Oeste");
    assert.equal(projectCity({ location: 'Monte Negro do Guaporé' }), null);
    assert.equal(projectCity({ location: 'Local não informado' }), null);
    assert.equal(projectCity({ location: 'Ariquemes - RO', city: 'Cidade desconhecida' }), null);
    const projects = [{ id: 1, location: 'Ariquemes - RO' }, { id: 2, location: 'Cacaulândia - RO' }];
    assert.deepEqual(projectsInCity(projects, 'Cacaulândia').map(p => p.id), [2]);
    assert.equal(projectsInCity(projects, 'Porto Velho').length, 0);
    assert.equal(unitInCity('Ariquemes').id, 'matriz');
    assert.equal(unitInCity('Vilhena'), undefined);
});
