import cityProfiles from './data/regional-city-profiles.json';
import { unitInCity } from './local-evidence';

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
    if (city === 'Rolim de Moura') return { ...defaults, title: 'DWalt em Rolim de Moura, no Centro.', text: 'Converse com nossa unidade na Avenida 25 de Agosto, no Centro de Rolim de Moura, sobre o consumo e as características do seu imóvel.', detail: 'Confirme a localização com a equipe pelo WhatsApp antes da visita. Para uma avaliação no imóvel, informe o bairro, o endereço e uma referência do acesso.' };
    if (city === 'Cacaulândia') return { ...defaults, text: 'A ligação de Cacaulândia com a BR-364 passa pela RO-140. Ao conversar com a equipe, envie a localização do imóvel e uma referência do acesso para planejar a avaliação.', detail: 'Se o imóvel estiver na zona rural, informe a linha, o travessão ou a entrada da propriedade. A visita e as condições de atendimento são combinadas com a equipe.' };
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

export function regionalDescription(city: string, service: { title: string; slug: string }) {
    return `${service.title} em ${city}, RO. ${descriptions[service.slug] || descriptions['energia-solar']} ${unitInCity(city) ? 'Converse com nossa unidade.' : 'Atendimento regional sob agendamento.'}`;
}

export function regionalHeroIntro(city: string, serviceSlug: string) {
    if (serviceSlug === 'afiliados') return `Conheça as condições para indicar pessoas interessadas em energia solar em ${city} e acompanhar as oportunidades pelo portal da DWalt.`;
    if (serviceSlug === 'energia-solar') {
        if (city === 'Ariquemes') return 'Projeto solar com engenharia própria e a proximidade da nossa matriz no Bom Jesus.';
        if (city === 'Cacaulândia') return 'Energia solar para o seu imóvel, com projeto comercial na cidade e atendimento da equipe DWalt em Rondônia.';
        if (city === 'Porto Velho') return 'Seu projeto de energia solar com engenharia própria e atendimento na unidade DWalt em Porto Velho.';
    }
    const unit = unitInCity(city);
    return unit ? `Converse com a unidade DWalt em ${city} sobre o seu consumo, as condições do imóvel e a avaliação adequada ao seu projeto.` : `Converse com a DWalt sobre o seu imóvel em ${city}. A equipe orienta a avaliação inicial e combina as condições de atendimento na região.`;
}
