type Benefit = { title: string; description: string };
type Question = { question: string; answer: string };
type Copy = {
    headline: [string, string]; lead: string; cta: string;
    benefitTitle: [string, string]; benefitIntro: string; benefits: Benefit[]; faq: Question[];
    closing?: { title: [string, string]; text: string; cta: string };
};

const defaultCopy: Copy = {
    headline: ['Mais controle.', 'Mais economia.'],
    lead: 'Sua conta de energia pode ser o começo de uma nova conquista para a sua casa.',
    cta: 'Descobrir meu projeto solar',
    benefitTitle: ['Energia que faz sentido', 'para a sua vida.'],
    benefitIntro: 'Mais clareza para decidir. Mais controle para planejar o futuro do seu imóvel.',
    benefits: [
        { title: 'Um projeto para você', description: 'Seu consumo e o espaço disponível orientam o dimensionamento do sistema.' },
        { title: 'Execução acompanhada', description: 'Projeto, instalação e orientações de uso com a equipe da DWalt.' },
        { title: 'Uma equipe por perto', description: 'Converse sobre monitoramento, cuidados e suporte para o seu sistema.' },
    ],
    faq: [
        { question: 'Como é definido o tamanho do sistema?', answer: 'A equipe avalia seu consumo, o espaço disponível e as condições do imóvel. A proposta apresenta o dimensionamento indicado para o seu caso.' },
        { question: 'Posso conversar antes de solicitar a proposta?', answer: 'Sim. Você pode falar com a DWalt para esclarecer dúvidas sobre o atendimento e entender quais informações serão necessárias.' },
        { question: 'A proposta considera o meu tipo de imóvel?', answer: 'Sim. Informe se o projeto é para uma residência, comércio ou outra aplicação. A equipe vai orientar a avaliação técnica adequada.' },
    ],
};

const variations: Record<string, Partial<Copy>> = {
    'energia-solar-residencial': {
        benefits: [
            { title: 'Consumo da sua casa', description: 'O histórico das contas e a rotina dos moradores orientam a potência e a proposta do sistema.' },
            { title: 'Cobertura e instalação', description: 'Área do telhado, sombreamento e condições elétricas entram na avaliação antes da execução.' },
            { title: 'Orientação depois da instalação', description: 'Converse com a equipe sobre uso, monitoramento e cuidados recomendados para o seu sistema.' },
        ],
    },
    'manutencao-e-limpeza': {
        headline: ['Mais cuidado.', 'Mais desempenho.'],
        lead: 'Seu sistema solar também precisa de acompanhamento. Converse com a DWalt sobre limpeza e manutenção.',
        cta: 'Solicitar avaliação do sistema', benefitTitle: ['Cuide da energia', 'que o seu sistema produz.'],
        benefitIntro: 'A avaliação técnica orienta os cuidados indicados para a sua instalação.',
        benefits: [
            { title: 'Avaliação do sistema', description: 'Informe o modelo dos equipamentos e o que você observou no funcionamento da instalação.' },
            { title: 'Limpeza e manutenção', description: 'A equipe avalia os serviços necessários conforme as condições dos módulos e da instalação.' },
            { title: 'Orientação e acompanhamento', description: 'Entenda os cuidados recomendados e as condições de atendimento para o seu sistema.' },
        ],
        faq: [
            { question: 'Como solicito uma avaliação?', answer: 'Fale com a equipe e informe a cidade, a quantidade de painéis e o que você percebeu no sistema. Essas informações ajudam a organizar o atendimento.' },
            { question: 'A limpeza resolve qualquer queda de geração?', answer: 'A geração pode variar por diferentes motivos. A equipe precisa avaliar o caso antes de indicar a limpeza ou outro serviço.' },
            { question: 'O que devo informar para agendar?', answer: 'Envie a localização da instalação e, se disponíveis, fotos e registros do monitoramento. A equipe confirma disponibilidade, deslocamento e condições do serviço.' },
        ],
    },
    'instalacao-fotovoltaica': {
        headline: ['Seu projeto.', 'Nossa execução.'],
        lead: 'Do planejamento à instalação, conte com uma equipe para cuidar de cada etapa do seu sistema fotovoltaico.',
        cta: 'Planejar minha instalação', benefitTitle: ['Uma instalação pensada', 'para o seu imóvel.'],
        benefitIntro: 'As condições do local e os equipamentos orientam a preparação e a execução do serviço.',
        benefits: [
            { title: 'Preparação do local', description: 'Cobertura, acesso, área disponível e instalação elétrica são avaliados para definir a execução.' },
            { title: 'Montagem planejada', description: 'A proposta considera os equipamentos e as condições de instalação do seu imóvel.' },
            { title: 'Entrega e orientações', description: 'As etapas de execução e as orientações de uso são combinadas com a equipe.' },
        ],
        faq: [
            { question: 'Já tenho equipamentos. Posso solicitar instalação?', answer: 'Informe os modelos, as quantidades e o local de instalação. A equipe avalia a compatibilidade, as condições e o escopo do serviço antes de elaborar a proposta.' },
            { question: 'Quais informações ajudam na avaliação?', answer: 'Envie o endereço, fotos da cobertura e do padrão de entrada, além dos dados dos equipamentos ou do projeto disponível.' },
            { question: 'Como é definido o agendamento?', answer: 'O cronograma depende da avaliação do local, do escopo e da disponibilidade da equipe. Confirme as etapas e as condições na proposta.' },
        ],
    },
    'energia-solar-empresarial': {
        headline: ['Mais controle.', 'Para o seu negócio.'],
        lead: 'Transforme a análise da sua conta de energia em um projeto solar para a realidade da sua empresa.',
        cta: 'Avaliar meu projeto empresarial', benefitTitle: ['Energia alinhada', 'à operação da sua empresa.'],
        benefitIntro: 'Consumo, espaço e rotina de operação orientam uma proposta personalizada para o seu negócio.',
        benefits: [
            { title: 'Perfil de consumo da empresa', description: 'Contas de energia e horário de funcionamento ajudam a entender a necessidade do negócio.' },
            { title: 'Espaço para o sistema', description: 'Cobertura, área disponível e características elétricas orientam o planejamento da instalação.' },
            { title: 'Planejamento da execução', description: 'As etapas e os acessos são combinados para organizar o serviço junto à rotina da empresa.' },
        ],
        faq: [
            { question: 'O projeto considera o horário de funcionamento?', answer: 'Sim. Informe a rotina da empresa e o histórico das contas para orientar a avaliação do consumo e a proposta do sistema.' },
            { question: 'Posso avaliar um ponto comercial alugado?', answer: 'Informe as condições do imóvel e da locação. A equipe orienta a avaliação técnica; autorizações e condições de instalação precisam ser verificadas antes da execução.' },
            { question: 'Quais dados devo enviar?', answer: 'Envie a conta de energia, o endereço, o tipo de atividade e, se disponíveis, fotos da cobertura e da instalação elétrica.' },
        ],
    },
    'energia-solar-industrial': {
        headline: ['Mais planejamento.', 'Para a sua operação.'],
        lead: 'Converse com a nossa engenharia sobre as condições de consumo e o potencial de um projeto solar para a sua indústria.',
        cta: 'Conversar sobre meu projeto', benefitTitle: ['Cada operação exige', 'um projeto bem pensado.'],
        benefitIntro: 'O estudo considera as características de consumo, o espaço disponível e as condições técnicas do local.',
        benefits: [
            { title: 'Dados da operação', description: 'Consumo, horários de produção e informações da instalação orientam a avaliação de engenharia.' },
            { title: 'Condições de implantação', description: 'Área disponível, acesso e características elétricas são considerados no planejamento do sistema.' },
            { title: 'Escopo e execução', description: 'As etapas, os documentos e as condições de conexão são definidos conforme a análise do projeto.' },
        ],
        faq: [
            { question: 'Quais informações iniciarão a avaliação industrial?', answer: 'Envie as contas de energia, o endereço e os dados disponíveis da instalação, além da rotina de funcionamento e das áreas previstas para o sistema.' },
            { question: 'A equipe avalia instalação em solo ou cobertura?', answer: 'Informe o espaço disponível e as características do local. A engenharia avalia a alternativa e os estudos necessários antes de apresentar a proposta.' },
            { question: 'A proposta define a potência e a execução?', answer: 'O dimensionamento e o escopo dependem da análise técnica. Confirme com a equipe as etapas, os documentos e as condições específicas da operação.' },
        ],
    },
    'engenharia-eletrica': {
        headline: ['Mais planejamento.', 'Mais segurança.'],
        lead: 'Conte para a DWalt o que o seu imóvel ou a sua operação precisa. A equipe orienta a avaliação e o projeto elétrico.',
        cta: 'Solicitar serviço de engenharia', benefitTitle: ['Engenharia para', 'a sua necessidade.'],
        benefitIntro: 'Uma primeira conversa ajuda a definir os dados e a avaliação necessários para o serviço.',
        benefits: [
            { title: 'Entender a necessidade', description: 'Informe o tipo de imóvel, a localização e o objetivo do serviço para orientar a avaliação.' },
            { title: 'Planejar a solução', description: 'A equipe analisa as condições técnicas e os dados necessários para elaborar a proposta.' },
            { title: 'Acompanhar as etapas', description: 'Converse sobre escopo, documentos, execução e orientações relacionadas ao projeto.' },
        ],
        faq: [
            { question: 'Como começo a solicitar o serviço?', answer: 'Informe o tipo de projeto ou problema, a cidade e as características do imóvel. A equipe indica quais informações e documentos serão necessários.' },
            { question: 'Posso pedir uma avaliação antes do projeto?', answer: 'Sim. Converse com a DWalt para entender a avaliação adequada ao seu caso e as condições de atendimento.' },
            { question: 'A proposta detalha o serviço?', answer: 'A definição da proposta depende da avaliação da demanda. Confirme com a equipe o escopo, os documentos, as etapas e as condições previstas.' },
        ],
    },
    'afiliados': {
        headline: ['Indique a DWalt.', 'Conecte oportunidades.'],
        lead: 'Conheça o programa de afiliados e o processo para indicar pessoas interessadas em energia solar.',
        cta: 'Conhecer o programa', benefitTitle: ['Uma indicação pode', 'abrir uma nova conversa.'],
        benefitIntro: 'Consulte no portal as regras, as etapas de participação e as condições do programa.',
        benefits: [
            { title: 'Conheça o programa', description: 'Acesse o portal e confira as regras e as informações para participar.' },
            { title: 'Cadastre sua indicação', description: 'Siga as orientações do programa para registrar pessoas interessadas em energia solar.' },
            { title: 'Acompanhe pelo portal', description: 'Consulte o andamento das indicações e as condições aplicáveis no ambiente do afiliado.' },
        ],
        faq: [
            { question: 'Onde faço o cadastro?', answer: 'Use o botão desta página para acessar o portal de afiliados da DWalt e conferir as orientações de cadastro.' },
            { question: 'Quais são as regras de participação?', answer: 'As regras, os critérios e as condições do programa devem ser consultados diretamente no portal antes de participar.' },
            { question: 'Como acompanho as indicações?', answer: 'O portal reúne as informações do programa. Caso tenha dúvidas de acesso ou de participação, converse com a equipe da DWalt.' },
        ],
        closing: { title: ['Sua próxima indicação', 'pode começar aqui.'], text: 'Conheça as condições do programa e o processo para conectar uma oportunidade à equipe da DWalt.', cta: 'Acessar o portal de afiliados' },
    },
};

export function regionalCopy(slug: string): Copy {
    return { ...defaultCopy, ...variations[slug] };
}
