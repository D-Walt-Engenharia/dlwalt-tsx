import cityProfiles from './data/regional-city-profiles.json';
import cityIntake from './data/regional-intake.json';
import { municipalRecords } from './regional-municipalities';
import { projectCity, unitInCity } from './local-evidence';
import type { PublicProject } from './public-content';

export type CityProfile = { references: string[]; access: string; arrival: string; source: string };
const profiles: Record<string, CityProfile> = cityProfiles;

/** References describe access to the municipality; they are never branch addresses. */
export function regionalCityProfile(city: string): CityProfile {
    return profiles[city] || { references: [city, 'Rondônia'], access: `Para avaliar o atendimento em ${city}, informe o endereço do imóvel.`, arrival: 'Envie a localização e um ponto de referência para combinar o atendimento com a equipe.', source: '' };
}

export function regionalLocalCopy(city: string) {
    const profile = regionalCityProfile(city);
    const unit = unitInCity(city);
    const defaults = {
        kicker: unit ? 'Nossa unidade na sua cidade' : 'Atendimento regional',
        title: unit ? `Atendimento da DWalt em ${city}.` : `Seu endereço em ${city} orienta o projeto.`,
        text: profile.access,
        detail: profile.arrival,
        references: profile.references,
    };
    if (city === 'Ariquemes') return { ...defaults, kicker: 'Nossa matriz é aqui', title: 'Atendimento em Ariquemes, no Bom Jesus.', text: 'Converse com a DWalt na Avenida Hugo Frey, esquina com a Rua Fernando Pessoa. Nossa equipe orienta o projeto para o seu consumo e as condições do seu imóvel.', detail: 'Para começar, envie sua conta de energia e o endereço do imóvel. O bairro e um ponto de referência ajudam a equipe a planejar a avaliação e o agendamento.' };
    if (city === 'Porto Velho') return { ...defaults, kicker: 'Nossa unidade na capital', title: 'DWalt em Porto Velho, no Flodoaldo Pontes Pinto.', text: 'Nosso ponto de atendimento fica na Rua Mestre Gabriel, 5368, no bairro Flodoaldo Pontes Pinto. Converse com a equipe sobre o consumo da sua casa ou empresa e as características do imóvel.', detail: 'Ao solicitar uma avaliação em Porto Velho, informe o bairro e um ponto de referência. Para imóveis fora da sede urbana, envie também a localização e o acesso para combinar o atendimento.' };
    if (city === 'Cacaulândia') return { ...defaults, text: 'A ligação de Cacaulândia com a BR-364 passa pela RO-140. Ao conversar com a equipe, envie a localização do imóvel e uma referência do acesso para planejar a avaliação.', detail: 'Se o imóvel estiver na zona rural, informe a linha, o travessão ou a entrada da propriedade. A visita e as condições de atendimento são combinadas com a equipe.' };
    if (city === 'Rolim de Moura') return { ...defaults, title: 'Contato para Rolim de Moura pela matriz em Ariquemes.' };
    return defaults;
}

const intake: Record<string, string> = cityIntake;

const intent: Record<string, { label: string; request: string; intro: string }> = {
    'energia-solar-residencial': { label: 'Placas solares para casas', request: 'Envie o consumo em kWh e uma foto do telhado para avaliar quantas placas cabem na sua casa.', intro: 'Para estimar o tamanho do sistema residencial, a equipe analisa o consumo em kWh, a área disponível e o sombreamento do telhado.' },
    'energia-solar-empresarial': { label: 'Energia solar para empresas', request: 'Peça uma análise com a fatura e o horário de funcionamento da empresa.', intro: 'Envie uma conta de energia da empresa e informe os horários de funcionamento. A equipe compara o consumo durante o dia com a área disponível para as placas.' },
    'energia-solar-industrial': { label: 'Energia solar industrial', request: 'Informe os turnos de produção e envie uma fatura com a demanda, quando aplicável.', intro: 'Para estudar a instalação industrial, a engenharia parte das faturas, dos turnos de produção e do espaço disponível. Inclua a demanda contratada quando ela constar na conta.' },
    'instalacao-fotovoltaica': { label: 'Instalação de placas solares', request: 'Envie fotos da cobertura e do padrão de entrada para planejar a montagem.', intro: 'Indique onde os painéis podem ser montados e envie fotos da cobertura e do padrão de entrada. Se já possui equipamentos, informe os modelos antes de combinar a instalação.' },
    'manutencao-e-limpeza': { label: 'Manutenção e limpeza de placas solares', request: 'Envie o histórico do inversor e a data da queda de geração para solicitar avaliação.', intro: 'Envie uma captura da produção diária no aplicativo do inversor e informe quando percebeu a mudança. Com isso, a equipe pode orientar a avaliação ou a limpeza do sistema.' },
    'engenharia-eletrica': { label: 'Engenharia elétrica', request: 'Informe a carga prevista, o tipo de imóvel e o projeto ou documento de que precisa.', intro: 'Indique se a demanda envolve projeto elétrico, adequação do padrão ou documentação técnica. As informações da instalação e os documentos existentes ajudam a definir o escopo.' },
    'afiliados': { label: 'Programa de indicação de energia solar', request: 'Consulte as condições do programa e acompanhe suas indicações pelo portal da DWalt.', intro: 'Consulte os critérios no portal de afiliados antes de registrar uma indicação. Identifique o município do imóvel para que a equipe possa avaliar o atendimento ao interessado.' },
};

type SearchCopy = { title: string; description: string; intro: string };

const localSearchCopy: Record<string, Record<string, SearchCopy>> = {
    'energia-solar': {
        'Cacaulândia': {
            title: 'Energia solar em Cacaulândia (RO) | Projeto e instalação DWalt',
            description: 'Instalação de energia solar em Cacaulândia para casas, comércios e propriedades rurais. Consulte a equipe de Ariquemes para avaliar seu imóvel.',
            intro: 'A equipe de Ariquemes avalia sua conta de luz e o local de instalação em Cacaulândia. Para imóveis rurais, envie a linha ou o travessão junto com a localização.',
        },
        'Porto Velho': {
            title: 'Energia solar em Porto Velho (RO) | Instalação DWalt',
            description: 'Peça um orçamento de instalação de energia solar em Porto Velho. Fale com a DWalt na Rua Mestre Gabriel, 5368, no bairro Flodoaldo Pontes Pinto.',
            intro: 'Quem quer instalar placas solares em Porto Velho pode conversar com a equipe na Rua Mestre Gabriel, 5368, no Flodoaldo Pontes Pinto. Leve sua conta de luz ou envie pelo WhatsApp para avaliar o tamanho do sistema.',
        },
        'Cacoal': {
            title: 'Energia solar em Cacoal (RO) | Orçamento de instalação DWalt',
            description: 'Solicite orçamento de energia solar em Cacoal para casa, comércio ou imóvel rural. Envie a conta de luz e a localização para combinar a avaliação com a DWalt.',
            intro: 'Para orçar a instalação em Cacoal, envie a conta de luz e diga onde fica o imóvel. No perímetro urbano, informe o bairro. Em uma propriedade rural, indique a linha ou a saída da BR-364 que dá acesso ao local.',
        },
        'Ariquemes': {
            title: 'Energia solar em Ariquemes (RO) | Projetos da DWalt',
            description: 'Veja projetos de energia solar em Ariquemes e peça um orçamento à matriz da DWalt na Avenida Hugo Frey, 4752, no Bom Jesus.',
            intro: 'Conheça instalações da DWalt em Ariquemes e converse com nossa engenharia na matriz do Bom Jesus. Com a sua conta de luz, a equipe avalia a potência indicada para sua casa ou empresa.',
        },
    },
    'manutencao-e-limpeza': {
        'Porto Velho': {
            title: 'Limpeza e manutenção de placas solares em Porto Velho | DWalt',
            description: 'Seu sistema perdeu geração em Porto Velho? Envie a produção recente do inversor para a DWalt avaliar a necessidade de limpeza ou manutenção dos painéis.',
            intro: 'Se a geração caiu, envie uma captura do aplicativo do inversor, a data em que percebeu a queda e o bairro do imóvel. A equipe de Porto Velho avalia os dados com você e combina a visita quando necessária.',
        },
    },
    'energia-solar-residencial': {
        'Ariquemes': {
            title: 'Placas solares para casas em Ariquemes (RO) | DWalt Energia',
            description: 'Planeje a instalação de placas solares na sua casa em Ariquemes. Envie o consumo mensal e uma foto do telhado para a equipe da matriz no Bom Jesus.',
            intro: 'Para avaliar quantas placas cabem na sua casa em Ariquemes, nossa equipe começa pelo consumo em kWh e pela área do telhado. Envie a conta de luz e uma foto da cobertura para a matriz no Bom Jesus.',
        },
    },
};

type ServiceLabel = { title: string; slug: string };

export function regionalTitle(city: string, service: ServiceLabel) {
    const pilot = localSearchCopy[service.slug]?.[city];
    if (pilot) return pilot.title;
    const label = intent[service.slug]?.label ?? service.title;
    if (city === 'Rolim de Moura') return `${label} em ${city} | Consulta à DWalt`;
    if (service.slug === 'energia-solar') return `Energia solar em ${city} (RO) | Projeto e instalação DWalt`;
    return `${label} em ${city} | DWalt`;
}

export function regionalDescription(city: string, service: ServiceLabel, project?: PublicProject) {
    const mainPage = service.slug === 'energia-solar';
    const label = intent[service.slug]?.label ?? 'Energia solar';
    if (city === 'Rolim de Moura') {
        if (service.slug === 'afiliados') return 'Indicações de energia solar em Rolim de Moura. Consulte as regras do programa no portal e a disponibilidade para o endereço do interessado com a matriz em Ariquemes.';
        return `${label} em ${city}. Consulte a matriz em Ariquemes sobre disponibilidade para o seu endereço. A antiga unidade encerrou o atendimento presencial.`;
    }
    if (mainPage && !unitInCity(city) && project && projectCity(project) === city) {
        const power = Number(project.kwp);
        if (project.name?.trim() && Number.isFinite(power) && power > 0 && Number.isInteger(project.panelCount) && project.panelCount > 0) {
            return `Energia solar em ${city}. Veja o projeto ${project.name.trim()} com ${power.toLocaleString('pt-BR')} kWp e ${project.panelCount.toLocaleString('pt-BR')} painéis. Peça um orçamento para seu imóvel.`;
        }
    }
    const pilot = localSearchCopy[service.slug]?.[city];
    if (pilot) return pilot.description;
    if (mainPage) return `Energia solar em ${city} (RO). ${intake[city] ?? regionalCityProfile(city).arrival}`;
    const request = intent[service.slug]?.request ?? regionalCityProfile(city).arrival;
    const district = municipalRecords[city]?.distritos[0];
    const road = regionalCityProfile(city).references.find(reference => /^(?:RO|BR)-\d+$/.test(reference));
    if (district && service.slug !== 'afiliados') return `${label} em ${city} (RO). ${request} Em ${district}, informe o distrito.`;
    if (road && ['manutencao-e-limpeza', 'instalacao-fotovoltaica'].includes(service.slug)) {
        return `${label} em ${city} (RO). ${request} Se chegar pela ${road}, indique o acesso.`;
    }
    return `${label} em ${city} (RO). ${request}`;
}

export function regionalHeroIntro(city: string, serviceSlug: string) {
    const pilot = localSearchCopy[serviceSlug]?.[city];
    if (pilot) return pilot.intro;
    const localIntake = intake[city] ?? regionalCityProfile(city).arrival;
    if (serviceSlug === 'energia-solar') return localIntake;
    const service = intent[serviceSlug];
    if (!service) return localIntake;
    if (city === 'Rolim de Moura') return `${localIntake} ${service.intro}`;
    const districts = municipalRecords[city]?.distritos;
    if (districts?.length) return `${service.intro} Se o imóvel fica em um distrito, como ${districts[0]}, informe a localidade no contato.`;
    if (unitInCity(city)) return `${service.intro} A unidade de ${city} pode orientar você.`;
    return `${service.intro} Informe a localização do imóvel em ${city} no primeiro contato.`;
}
