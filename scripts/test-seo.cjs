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
    assert.equal(unitInCity('Rolim de Moura'), undefined);
});

test('every existing municipality has sourced access references and an honest contact type', () => {
    const { RONDONIA_CITIES } = load('src/lib/constants/rondonia-cities.ts');
    const profiles = load('src/lib/data/regional-city-profiles.json');
    const { regionalCityProfile, regionalLocalCopy } = load('src/lib/regional-local-content.ts');
    assert.deepEqual(Object.keys(profiles).sort(), [...RONDONIA_CITIES].sort());
    for (const city of RONDONIA_CITIES) {
        const profile = regionalCityProfile(city);
        assert(profile.references.length >= 2, city);
        assert(profile.access.trim().length > 0 && profile.arrival.trim().length > 0, city);
        const source = new URL(profile.source);
        assert(source.protocol === 'https:' && /(?:^|\.)(?:gov\.br|ro\.gov\.br)$/.test(source.hostname), city + ' primary source');
        if (!['Ariquemes', 'Porto Velho'].includes(city)) assert.equal(regionalLocalCopy(city).kicker, 'Atendimento regional', city);
    }
    assert(regionalCityProfile('Cacaulândia').references.includes('RO-140'));
    assert(regionalCityProfile('Rio Crespo').references.includes('RO-459'));
});

test('new published local projects appear without a fixed selection and regional examples retain provenance', () => {
    const { regionalPortfolio, projectCity } = load('src/lib/local-evidence.ts');
    const projects = [
        { id: 1, location: 'Ariquemes - RO' }, { id: 2, location: 'CACAULANDIA-RO' },
        { id: 3, location: 'Condomínio Jardins, Ariquemes - RO' },
        { id: 4, location: 'Ariquemes - RO' }, { id: 5, city: 'Ariquemes', location: 'Instalação nova' },
        { id: 6, location: 'Local não informado' },
    ];
    const local = regionalPortfolio(projects, 'Ariquemes');
    assert.equal(local.isLocal, true);
    assert.deepEqual(local.projects.map(p => p.id), [1, 3, 4, 5]);
    assert.deepEqual(local.projects.map(projectCity), Array(4).fill('Ariquemes'));
    const regional = regionalPortfolio(projects, 'Vilhena');
    assert.equal(regional.isLocal, false);
    assert.equal(regional.localProjects.length, 0);
    assert(regional.projects.every(p => projectCity(p) !== 'Vilhena' && p.id !== 6));
    assert.equal(regionalPortfolio([], 'Vilhena').projects.length, 0);
});

test('regional descriptions match the service and city without generic savings promises', () => {
    const { SOLAR_SERVICES } = load('src/lib/constants/services.ts');
    const { regionalDescription } = load('src/lib/regional-local-content.ts');
    const descriptions = SOLAR_SERVICES.map(service => regionalDescription('Cacaulândia', service));
    assert.equal(new Set(descriptions).size, SOLAR_SERVICES.length);
    for (const [index, description] of descriptions.entries()) {
        if (SOLAR_SERVICES[index].slug === 'energia-solar') {
            assert.match(description, /instalação de energia solar em Cacaulândia/i);
            assert.match(description, /equipe de Ariquemes/);
        } else {
            const terms = {
                'energia-solar-residencial': /telhado/, 'energia-solar-empresarial': /horário de funcionamento/,
                'energia-solar-industrial': /turnos/, 'engenharia-eletrica': /carga prevista/,
                'manutencao-e-limpeza': /inversor/, 'instalacao-fotovoltaica': /padrão de entrada/, afiliados: /portal/,
            };
            assert(description.includes('Cacaulândia'));
            assert.match(description, terms[SOLAR_SERVICES[index].slug]);
        }
        assert(!/95%|100%|garantid|payback|comiss[oõ]es/i.test(description));
    }
});


test('city search copy uses only verified local project data and the matching service', () => {
    const { regionalDescription, regionalTitle } = load('src/lib/regional-local-content.ts');
    const solar = { slug: 'energia-solar', title: 'Energia Solar' };
    const other = { slug: 'engenharia-eletrica', title: 'Engenharia Elétrica' };
    const project = { name: 'SUPER MERCADO BM PREÇO', location: 'CACAULANDIA-RO', kwp: '132.00', panelCount: 220 };
    assert.match(regionalDescription('Cacaulândia', solar, project), /BM PREÇO com 132 kWp e 220 painéis/);
    const fallback = regionalDescription('Cacaulândia', solar);
    assert.equal(regionalDescription('Cacaulândia', solar, { ...project, city: 'Ariquemes' }), fallback);
    assert.equal(regionalDescription('Cacaulândia', solar, { ...project, panelCount: 0 }), fallback);
    assert.equal(regionalDescription('Cacaulândia', solar, { ...project, kwp: null }), fallback);
    assert.doesNotMatch(regionalDescription('Cacaulândia', other, project), /BM PREÇO/);
    assert.match(regionalTitle('Cacoal', solar), /Energia solar em Cacoal.*instalação/i);
    assert.match(regionalDescription('Porto Velho', solar), /Rua Mestre Gabriel, 5368/);
    assert.match(regionalDescription('Rolim de Moura', solar), /Consulte a matriz/);
    const maintenance = { slug: 'manutencao-e-limpeza', title: 'Manutenção e Limpeza' };
    assert.match(regionalDescription('Porto Velho', maintenance), /produção recente do inversor/);
    const residential = { slug: 'energia-solar-residencial', title: 'Energia Solar Residencial' };
    assert.match(regionalTitle('Ariquemes', residential), /Placas solares para casas em Ariquemes/);
    assert.doesNotMatch(regionalTitle('Ariquemes', solar), /para casas/);
});

test('every specialty links to its city hub using its published canonical suffix', () => {
    const { regionalPages, regionalBreadcrumbs, regionalSlug } = load('src/lib/regional-pages.ts');
    for (const { service, city, canonical } of regionalPages()) {
        const trail = regionalBreadcrumbs(city, service, canonical);
        assert.equal(trail.at(-1).href, '/' + canonical);
        assert.equal(new Set(trail.map(step => step.href)).size, trail.length);
        const primary = service.slug === 'energia-solar';
        assert.equal(trail.length, primary ? 3 : 4);
        if (!primary) assert.equal(trail.at(-2).href, '/' + regionalSlug('energia-solar', city));
    }
});

test('all 52 municipalities have traceable solar counts and city-specific guidance', () => {
    const { RONDONIA_CITIES } = load('src/lib/constants/rondonia-cities.ts');
    const { municipalRecords, normalizePlace, solarReferenceMonth } = load('src/lib/regional-municipalities.ts');
    const intake = load('src/lib/data/regional-intake.json');
    assert.deepEqual(Object.keys(municipalRecords).sort(), [...RONDONIA_CITIES].sort());
    assert.deepEqual(Object.keys(intake).sort(), [...RONDONIA_CITIES].sort());
    assert.equal(new Set(Object.values(intake)).size, 52);
    assert.equal(new Set(Object.values(municipalRecords).map(m => m.codigoIbge)).size, 52);
    assert.equal(new Set(Object.values(municipalRecords).map(m => m.regiao)).size, 6);
    for (const [name, item] of Object.entries(municipalRecords)) {
        assert.equal(Object.values(item.classes).reduce((a,b) => a+b, 0), item.total, name);
        assert.equal(item.distritos.includes(name), false, name);
    }
    assert.equal(municipalRecords['Cacaulândia'].total, 240);
    assert.equal(solarReferenceMonth, 'novembro de 2026');
    const search = term => Object.entries(municipalRecords).filter(([name, m]) =>
        [name, ...m.distritos].some(place => normalizePlace(place).includes(normalizePlace(term)))).map(([name]) => name);
    assert.deepEqual(search('tarilandia'), ['Jaru']);
    assert.deepEqual(search('nova londrina'), ['Ji-Paraná']);
    assert.deepEqual(search('migrantinopolis'), ['Novo Horizonte do Oeste']);
    assert.deepEqual(search('espigao doeste'), ["Espigão D'Oeste"]);
    assert.deepEqual(search('ji parana'), ['Ji-Paraná']);
});

test('service metadata, visible explanations and project attribution span the whole state', () => {
    const { regionalPages } = load('src/lib/regional-pages.ts');
    const { regionalTitle, regionalDescription, regionalHeroIntro } = load('src/lib/regional-local-content.ts');
    const titles = new Set(), descriptions = new Set();
    for (const { service, city } of regionalPages()) {
        const title = regionalTitle(city, service), description = regionalDescription(city, service);
        assert(title.includes(city) && description.includes(city), title);
        assert(regionalHeroIntro(city, service.slug).length > 50, title);
        titles.add(title); descriptions.add(description);
    }
    assert.equal(titles.size, 416);
    assert.equal(descriptions.size, 416);
    const service = { slug: 'energia-solar', title: 'Energia Solar' };
    const project = { name: 'Obra de teste', city: 'Jaru', kwp: '11', panelCount: 20 };
    assert.match(regionalDescription('Jaru', service, project), /Obra de teste com 11 kWp e 20 painéis/);
    assert.doesNotMatch(regionalDescription('Vilhena', service, project), /Obra de teste/);
    assert.doesNotMatch(regionalDescription('Rolim de Moura', service, {...project,city:'Rolim de Moura'}), /Obra de teste/);
});

test('local buying questions use the correct service, city and available office', () => {
    const { localPageContent, localPageQuestions } = load('src/components/regional/local-page-content.ts');
    const { unitInCity } = load('src/lib/local-evidence.ts');
    const { RONDONIA_CITIES } = load('src/lib/constants/rondonia-cities.ts');
    for (const city of RONDONIA_CITIES) {
        const evidence = { unit: unitInCity(city), localProjects: [] };
        const main = localPageQuestions(city, 'energia-solar', evidence);
        const installation = localPageQuestions(city, 'instalacao-fotovoltaica', evidence);
        const company = main.find(item => item.id === 'empresa-solar');
        const kit = installation.find(item => item.id === 'kit-solar');
        if (city === 'Rolim de Moura') {
            assert.equal(company, undefined);
            assert.equal(kit, undefined);
            assert.match(main[0].answer, /encerrado/);
            continue;
        }
        assert(company.question.includes(city));
        assert(company.answer.includes(evidence.unit?.address ?? 'matriz em Ariquemes'));
        assert(kit.question.includes(city));
        assert.match(kit.answer, /módulos.*inversor.*estrutura/);
        assert.equal(main.some(item => item.id === 'kit-solar'), false);
        assert(localPageContent(city, 'energia-solar-residencial').benefitIntro.includes(city));
    }
});

test('price and panel searches respect service areas and the reviewed consumption examples', () => {
    const { localPageQuestions } = load('src/components/regional/local-page-content.ts');
    const { RONDONIA_CITIES } = load('src/lib/constants/rondonia-cities.ts');
    const { MONTHLY_CONSUMPTION_EXAMPLES, estimateSolarArray } = load('src/lib/solar-constants.ts');
    for (const city of RONDONIA_CITIES) {
        const evidence = { localProjects: [] };
        for (const [service, anchor] of [
            ['energia-solar', 'preco-instalado'],
            ['energia-solar-residencial', 'preco-instalado'],
            ['instalacao-fotovoltaica', 'placa-solar-local'],
        ]) {
            const matches = localPageQuestions(city, service, evidence).filter(q => q.id === anchor);
            assert.equal(matches.length, city === 'Rolim de Moura' ? 0 : 1, city);
            if (matches.length) assert(matches[0].question.includes(city));
        }
    }
    assert.deepEqual(MONTHLY_CONSUMPTION_EXAMPLES, [500, 600, 800, 900, 1000, 1200, 1500, 1800, 2000]);
    assert.deepEqual(MONTHLY_CONSUMPTION_EXAMPLES.map(kwh => estimateSolarArray(kwh).panels), [7, 9, 11, 13, 14, 17, 21, 25, 27]);
});
