# Páginas regionais com conteúdo local

O padrão visual aprovado inclui imagem de casa com painéis no topo, projetos com fotografias do portfólio, referências municipais, atendimento identificado, perguntas por serviço/cidade, animações leves e botão flutuante do WhatsApp.

O escopo é a coleção existente de 416 destinos canônicos (oito serviços em 52 municípios). A página inicial, o financiamento e os dados do portfólio no painel não são alterados. As URLs, os 417 redirecionamentos e a composição do sitemap permanecem preservados.

## Conteúdo e prova local

`regional-city-profiles.json` contém referências geográficas verificadas para os 52 municípios. Elas descrevem acessos à região, sem representar filiais, obras ou clientes. Os endereços da DWalt vêm de `COMPANY_INFO`, com unidade física apenas em Ariquemes, Porto Velho e Rolim de Moura. O endereço de Rolim permanece sem número; a página orienta confirmar a localização com a equipe.

Todos os projetos locais publicados pela API são mostrados na cidade correta, inclusive novas publicações, sem lista fixa de clientes. Nas cidades sem projeto local publicado, uma seleção do portfólio de Rondônia identifica a cidade verdadeira de cada obra. Durante indisponibilidade temporária do portfólio, a página mantém atendimento e acesso à galeria, sem inventar fotografias.

As descrições de SEO respeitam o serviço e a cidade. `Service` descreve a área atendida, sem criar `LocalBusiness` fictício. Breadcrumbs estruturados correspondem à navegação visível. Perguntas são conteúdo de atendimento, sem promessa de resultados especiais na busca. Não há garantia de indexação ou de posição no Google.

## Exibição e desempenho

A imagem principal é ilustrativa e continua identificada assim. A versão móvel tem 34.806 bytes, prioridade alta e cache. As fotografias reais carregam diretamente das URLs públicas do portfólio, sob demanda e com dimensões declaradas. Conteúdo, menu e perguntas são renderizados no servidor e permanecem disponíveis sem JavaScript. O controlador de animações só prepara blocos abaixo da tela e respeita movimento reduzido.

O WhatsApp flutuante é um link nativo para o contato público, com contexto de serviço/cidade, sem dependências de chat e sem enviar mensagem sozinho. O rastreamento global existente continua reconhecendo os links de WhatsApp. A página reserva espaço lateral nas chamadas móveis.

## Verificação

Onze testes de regressão cobrem canônicas/redirecionamentos, paginação, falhas da API, sitemap, organização, registro de leads, referências dos 52 municípios e associação de projetos novos à cidade. A compilação inclui TypeScript; a verificação HTTP percorre todos os 416 destinos canônicos e confere amostras de conteúdo, imagem, contato e formulários. A avaliação visual usa o HTML renderizado pelo próprio build, em celular e computador.

## Fontes das referências

Verificação em 5 de novembro de 2026. As fontes abaixo fundamentam as referências geográficas, e não endereços ou vínculos comerciais da DWalt. Contatos da empresa são os informados pelo proprietário e mantidos no cadastro do site.

- https://geoportal.portovelho.ro.gov.br/bairros/flodoaldo_pontes_pinto.html
- https://rondonia.ro.gov.br/assinada-ordem-de-servico-para-reinicio-do-asfaltamento-do-acesso-a-pimenteiras-com-investimento-de-r-325-milhoes/
- https://rondonia.ro.gov.br/departamento-de-estradas-de-rodagem-recupera-rodovia-que-liga-cacaulandia-a-br-364/
- https://rondonia.ro.gov.br/departamento-de-estradas-de-rodagem-recupera-trecho-da-ro-010-de-migrantinopolis-a-nova-brasilandia/
- https://rondonia.ro.gov.br/der-conclui-manutencao-na-ro-459-que-liga-rio-crespo-a-br-364/
- https://rondonia.ro.gov.br/der-executa-manutencao-em-mais-de-100-quilometros-de-estradas-na-regiao-de-ouro-preto-do-oeste/
- https://rondonia.ro.gov.br/der-executa-manutencao-na-ro-463-que-liga-jaru-a-governador-jorge-teixeira/
- https://rondonia.ro.gov.br/der-executa-obras-de-manutencao-na-rodovia-492-nas-regioes-do-cafe-e-zona-da-mata/
- https://rondonia.ro.gov.br/der-executa-servicos-de-recuperacao-na-ro-494-regiao-de-primavera-de-rondonia/
- https://rondonia.ro.gov.br/der/institucional/enderecos-das-residencias-regionais/
- https://rondonia.ro.gov.br/empresa-trabalha-nos-alicerces-da-nova-ponte-de-concreto-no-rio-jamari-em-ariquemes/
- https://rondonia.ro.gov.br/governo-conclui-servicos-de-recuperacao-da-rodovia-383-entre-o-trevo-da-ro-490-e-o-municipio-de-alta-floresta-doeste/
- https://rondonia.ro.gov.br/governo-leva-pacote-de-obras-para-nova-mamore-e-regiao-3/
- https://rondonia.ro.gov.br/manutencao-asfaltica-fortalece-condicoes-de-trafego-na-ro-471-em-ministro-andreazza/
- https://rondonia.ro.gov.br/manutencao-de-revestimento-primario-e-realizada-pelo-governo-de-ro-nas-ro-470-e-ro-010-na-regiao-central/
- https://rondonia.ro.gov.br/obra-na-ro-473-avanca-para-etapa-de-imprimacao-e-deve-melhorar-o-acesso-a-teixeiropolis/
- https://rondonia.ro.gov.br/ro-370-governo-recupera-trecho-entre-cerejeiras-e-corumbiara/
- https://rondonia.ro.gov.br/ro-383-entre-santa-luzia-doeste-e-rolim-de-moura-passa-por-manutencao-e-motoristas-devem-dirigir-com-atencao-redobrada/
- https://rondonia.ro.gov.br/servico-de-manutencao-em-33-quilometros-da-ro-135-e-concluido-na-regiao-de-alvorada-do-oeste/
- https://rondonia.ro.gov.br/sine-estadual-de-rolim-de-moura-passa-a-operar-em-novo-endereco/
- https://rondonia.ro.gov.br/usina-de-asfalto-do-der-em-jaru-finaliza-manutencao-de-142-quilometros-na-rodovia-133%E2%A0%80/
- https://rondonia.ro.gov.br/wp-content/uploads/2022/07/SEI_0019.098304_2021_32.pdf
- https://www.camaradeariquemes.ro.gov.br/navegacao/ariquemes
- https://www.gov.br/antt/pt-br/assuntos/rodovias/novos-projetos-em-rodovias/bndes-cn1-centro-oeste-norte
- https://www.gov.br/dnit/pt-br/assuntos/noticias/diretoria-de-planejamento-e-pesquisa-do-dnit-realiza-vistoria-tecnica-na-br-364-ro-para-estruturacao-do-projeto-de-duplicacao
- https://www.gov.br/dnit/pt-br/assuntos/noticias/dnit-revitaliza-mais-de-10-km-na-br-429-em-rondonia
