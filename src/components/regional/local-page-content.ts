import { regionalCopy } from './content';
import { regionalCityProfile } from '@/lib/regional-local-content';
import type { RegionalProof } from './RegionalEvidence';

type Solution = { icon: 'home' | 'building' | 'leaf' | 'shield' | 'sun'; title: string; text: string };
type LocalQuestion = { question: string; answer: string; id?: string };

export function localPageContent(city: string, slug: string) {
    const original = regionalCopy(slug);
    const energy = ['energia-solar', 'energia-solar-residencial'].includes(slug);
    const general: Solution[] = [
        { icon: 'home', title: `Energia solar residencial em ${city}`, text: 'Um projeto que parte da sua conta de energia, da cobertura e da rotina de consumo da casa.' },
        { icon: 'building', title: `Energia solar para empresas em ${city}`, text: 'Consumo, horário de funcionamento e espaço disponível orientam a proposta para o seu negócio.' },
        { icon: 'leaf', title: 'Energia para o imóvel rural', text: 'Localização, condições de acesso e características elétricas entram na avaliação da propriedade.' },
    ];
    const solutions: Solution[] = slug === 'energia-solar' ? general : original.benefits.map((benefit, index) => ({ icon: (['shield', 'sun', 'building'] as const)[index], title: benefit.title, text: benefit.description }));
    const promise = slug === 'energia-solar' ? ['Mais economia.', 'Com quem entende do seu projeto.'] : original.headline;
    const journey = slug === 'afiliados' ? [
        ['Conhecer as condições', 'Regras e critérios de participação no portal.'], ['Cadastrar a indicação', 'Siga o processo e as orientações do programa.'], ['Acompanhar a oportunidade', 'Consulte as informações na sua área de afiliado.'],
    ] : slug === 'manutencao-e-limpeza' ? [
        ['Entender a situação', 'Localização, equipamentos e registros do sistema.'], ['Avaliar a intervenção', 'Identificação dos cuidados e serviços indicados.'], ['Combinar o atendimento', 'Agendamento, deslocamento e orientações da equipe.'],
    ] : slug === 'engenharia-eletrica' ? [
        ['Entender a necessidade', 'Objetivo, documentos e informações do imóvel.'], ['Planejar a solução', 'Avaliação técnica e definição do escopo.'], ['Acompanhar as etapas', 'Serviços e documentos previstos na proposta.'],
    ] : [
        ['Entender seu consumo', 'Conta de energia e informações do imóvel.'], ['Planejar seu sistema', 'Avaliação técnica e proposta personalizada.'], ['Executar e acompanhar', 'Instalação, orientações e suporte da equipe.'],
    ];
    let benefitIntro = energy ? 'Da primeira conversa ao acompanhamento do sistema: clareza em cada etapa para decidir com segurança.' : original.benefitIntro;
    if (slug === 'energia-solar-residencial' && city !== 'Rolim de Moura') {
        benefitIntro = `Para planejar a energia solar para sua residência em ${city}, separe as últimas contas de luz. O histórico em kWh ajuda a considerar meses de maior consumo antes de escolher a potência das placas.`;
    }
    if (slug === 'instalacao-fotovoltaica' && city !== 'Rolim de Moura') {
        benefitIntro = `A instalação de energia solar em ${city} começa pela avaliação da cobertura, do acesso e do padrão de entrada. Esses detalhes orientam a montagem e o orçamento da equipe.`;
    }
    return { original, solutions, promise, cta: energy ? 'Quero meu projeto solar' : original.cta, journey, benefitTitle: energy ? ['Um projeto para', 'a sua rotina.'] : original.benefitTitle, benefitIntro };
}

export function localPageQuestions(city: string, slug: string, evidence: RegionalProof): LocalQuestion[] {
    const original = regionalCopy(slug);
    if (slug === 'afiliados') return [{ question: `Como conhecer o programa de afiliados em ${city}?`, answer: `Acesse o portal de afiliados da DWalt para consultar as regras e o processo de indicação de interessados em energia solar em ${city}. As condições de participação são informadas no portal.` }, ...original.faq];
    const profile = regionalCityProfile(city);
    const address: LocalQuestion = evidence.unit
        ? { question: `Onde fica a DWalt em ${city}?`, answer: `Nosso atendimento em ${city} tem o endereço: ${evidence.unit.address}. Você também pode iniciar o atendimento pelo WhatsApp.` }
        : { question: `Como funciona o atendimento em ${city}?`, answer: city === 'Rolim de Moura' ? `${profile.arrival} ${profile.access}` : `O atendimento em ${city} é regional e sob agendamento. Envie a localização do imóvel e converse com a equipe sobre disponibilidade, avaliação e deslocamento. ${profile.access}` };
    const contact: LocalQuestion = slug === 'energia-solar' && city !== 'Rolim de Moura' ? {
        id: 'empresa-solar',
        question: `Procuro uma empresa de energia solar em ${city}. Como a DWalt atende?`,
        answer: evidence.unit ? `Converse com a equipe pelo WhatsApp ou visite a DWalt em ${evidence.unit.address}.` : `Fale com a matriz em Ariquemes pelo WhatsApp para consultar o atendimento ao seu endereço em ${city}. ${profile.arrival}`,
    } : address;
    if (slug === 'instalacao-fotovoltaica' && city !== 'Rolim de Moura') return [contact, {
        id: 'placa-solar-local',
        question: `Procuro placa solar em ${city}. Como comparar as propostas?`,
        answer: 'Compare a potência total em kWp, a geração mensal estimada e os serviços incluídos. Uma proposta instalada deve detalhar os módulos, o inversor, a montagem e quem cuida da homologação. Envie sua fatura e fotos do telhado para pedir esse detalhamento.',
    }, {
        id: 'kit-solar',
        question: `O que conferir no orçamento de um kit de energia solar em ${city}?`,
        answer: 'Confira a quantidade e a potência dos módulos, o modelo do inversor, a estrutura de fixação e as proteções elétricas. Peça que a proposta detalhe os equipamentos, a instalação e as garantias de cada item. A escolha do conjunto depende do consumo e do espaço disponível no imóvel.',
    }, ...original.faq];
    if (!['energia-solar', 'energia-solar-residencial'].includes(slug)) return [contact, ...original.faq];
    const installedPrice: LocalQuestion = {
        id: 'preco-instalado',
        question: `Quanto custa instalar energia solar em ${city}?`,
        answer: 'O preço da placa é apenas uma parte do valor instalado. O consumo em kWh orienta a potência do sistema. O tipo de telhado, a fixação, o inversor e eventuais adequações elétricas também entram na proposta. Envie uma fatura recente e a localização do imóvel para receber o orçamento completo.',
    };
    if (city === 'Cacaulândia') return [
        { question: 'A DWalt tem projeto publicado em Cacaulândia?', answer: evidence.localProjects.length ? `Sim. O portfólio inclui ${evidence.localProjects.map(p => p.name).join(' e ')}. Os cartões acima mostram as fotos e abrem os dados de cada projeto.` : 'Você pode consultar o portfólio da DWalt para conhecer as instalações publicadas e a cidade identificada em cada projeto.' },
        installedPrice,
        { question: 'Como solicitar uma visita em Cacaulândia?', answer: 'Converse com a equipe pelo WhatsApp, envie a conta de energia e a localização do imóvel. O agendamento, a disponibilidade e as condições da visita são combinados no atendimento.' },
        { question: 'Meu imóvel fica em uma linha rural. Como informar?', answer: 'Envie a localização e identifique a linha, o travessão ou uma referência de acesso à propriedade. Isso ajuda no planejamento da avaliação técnica.' },
        slug === 'energia-solar' ? contact : { question: 'Existe uma loja física da DWalt em Cacaulândia?', answer: 'Nesta página, o atendimento é regional e sob agendamento. O endereço de contato exibido é o da matriz em Ariquemes; ele não representa uma filial em Cacaulândia.' },
    ];
    const proof = evidence.localProjects.length ? { question: `Posso conhecer projetos realizados em ${city}?`, answer: `Sim. O portfólio publicado inclui ${evidence.localProjects.map(project => project.name).join(', ')}. Os cartões acima abrem as páginas desses projetos, com fotos e dados do sistema.` } : { question: `Que referência enviar para o atendimento em ${city}?`, answer: profile.arrival };
    return [contact, proof,
        city === 'Rolim de Moura' ? { question: `Quanto custa instalar energia solar em ${city}?`, answer: 'O valor depende do consumo, da potência necessária, da cobertura e das condições elétricas. Envie a conta de energia e o endereço para receber uma análise e uma proposta adequada ao seu imóvel.' } : installedPrice,
        { question: 'O que enviar para iniciar meu orçamento?', answer: `Envie a conta de energia, seu nome e o endereço do imóvel em ${city}. Fotos do telhado e do padrão de entrada também ajudam na avaliação inicial.` },
    ];
}
