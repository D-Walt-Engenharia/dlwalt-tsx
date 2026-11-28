import cityProfiles from './data/regional-city-profiles.json';
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

const descriptions: Record<string, string> = {
    'energia-solar': 'Projetos para casas, empresas e imóveis rurais. Engenharia própria, instalação e suporte.',
    'energia-solar-residencial': 'Projeto fotovoltaico para sua casa, com análise de consumo, telhado e instalação elétrica.',
    'energia-solar-empresarial': 'Projeto solar para sua empresa, considerando consumo, espaço e horário de funcionamento.',
    'energia-solar-industrial': 'Avaliação de consumo e condições técnicas para o projeto solar da sua operação industrial.',
    'instalacao-fotovoltaica': 'Planejamento e execução da instalação fotovoltaica conforme as condições do imóvel.',
    'manutencao-e-limpeza': 'Avaliação, limpeza e manutenção do sistema fotovoltaico. Consulte agendamento e deslocamento.',
    'engenharia-eletrica': 'Avaliação e proposta para projetos e serviços de engenharia elétrica conforme a sua necessidade.',
    'afiliados': 'Conheça o programa de indicações da DWalt, as regras de participação e o portal de afiliados.',
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
    return localSearchCopy[service.slug]?.[city]?.title ?? `${service.title} em ${city} - RO | DWalt Energia`;
}

export function regionalDescription(city: string, service: ServiceLabel, project?: PublicProject) {
    if (service.slug === 'energia-solar' && city === 'Cacaulândia' && project && projectCity(project) === city) {
        const power = Number(project.kwp);
        if (project.name?.trim() && Number.isFinite(power) && power > 0 && project.panelCount > 0) {
            return `Energia solar em Cacaulândia. Veja o projeto ${project.name.trim()} com ${power.toLocaleString('pt-BR')} kWp e ${project.panelCount} painéis. Peça um orçamento para seu imóvel.`;
        }
    }
    const copy = localSearchCopy[service.slug]?.[city];
    if (copy) return copy.description;
    const contact = city === 'Rolim de Moura'
        ? 'Consulte a matriz em Ariquemes sobre disponibilidade.'
        : unitInCity(city) ? 'Converse com nossa unidade.' : 'Atendimento regional sob agendamento.';
    return `${service.title} em ${city}, RO. ${descriptions[service.slug] || descriptions['energia-solar']} ${contact}`;
}

export function regionalHeroIntro(city: string, serviceSlug: string) {
    if (serviceSlug === 'afiliados') return `Conheça as condições para indicar pessoas interessadas em energia solar em ${city} e acompanhar as oportunidades pelo portal da DWalt.`;
    const copy = localSearchCopy[serviceSlug]?.[city];
    if (copy) return copy.intro;
    const unit = unitInCity(city);
    return unit ? `Converse com a unidade DWalt em ${city} sobre o seu consumo, as condições do imóvel e a avaliação adequada ao seu projeto.` : `Converse com a DWalt sobre o seu imóvel em ${city}. A equipe orienta a avaliação inicial e combina as condições de atendimento na região.`;
}
