# SEO técnico - primeira etapa

## Comportamento publicado

- Uma URL por combinação de serviço e cidade. Os 416 endereços alternativos recebem redirecionamento permanente 308 para a página equivalente, preservando os parâmetros da consulta.
- As exceções em `regional-canonical-overrides.json` preservam variantes com `-ro` que apresentavam histórico mais forte no Search Console de agosto a outubro de 2026. As demais mantêm a variante sem o sufixo. Reavaliar a escolha caso um inventário de backlinks ou a inspeção de URLs mostre novos sinais.
- Sitemap com destinos canônicos, data de modificação real quando disponível e todas as páginas de artigos/projetos da API. Revalidação em cinco minutos. Login e administração usam `noindex`.
- Organização usa o cadastro central da empresa. Páginas regionais descrevem um serviço e sua área de atendimento, sem criar endereços físicos em cada cidade ou avaliações repetidas no schema.
- Blog, projetos e cartões de portfólio têm conteúdo no HTML inicial; a paginação do blog usa links rastreáveis. Falhas temporárias da API não viram páginas 404 de conteúdo que existe.
- Navegação para as cidades existentes em `/areas-de-atendimento`, ligada ao menu, rodapé e páginas regionais.
- Título principal visível no HTML inicial. Imagens locais em WebP com versões móveis; vídeo decorativo adiado em computadores e omitido em celulares/conexões econômicas/redução de movimento.

## Medição

O ID `G-B5TF6XMTWD` foi observado na interface autenticada da propriedade conectada da empresa, em 05/11/2026. O site usa o Google tag existente e configura esse destino GA4 uma vez, excluindo duplicações do mesmo ID vindas dos scripts dinâmicos.

`generate_lead` é enviado apenas após a resposta do servidor confirmar um cadastro de financiamento e retornar um identificador. O evento não recebe dados do formulário; repetições do mesmo registro são evitadas no navegador. Cliques de WhatsApp continuam como interações, sem serem transformados em cadastro confirmado.

A ativação do evento como evento principal e a confirmação de recebimento no GA4 ainda precisam ser verificadas na administração. Esta propriedade tem histórico de outro hostname; filtrar `www.dwalt.net` e `dwalt.net` nos relatórios do site. Não foi criado ou alterado um fluxo web ou uma propriedade pelo navegador.

## Validação

- `node --test scripts/test-seo.cjs`: destinos, redirecionamentos, formatos da API, paginação completa, falhas transitórias, sitemap, schema e deduplicação do lead.
- `npx tsc --noEmit` e `npm run build`.
- A compilação local usa uma API de testes isolada, pois este executor não consegue consultar a API pública da produção. Dados de teste não fazem parte do repositório nem da publicação. O deploy de produção compila novamente com a API original.
- Verificar respostas HTTP e HTML de início, cidade, cidade alternativa, blog paginado, projeto, login, sitemap e formulários antes da publicação.

## Continuação editorial e de contas

Ainda são necessários projetos documentados e materiais específicos para enriquecer cada cidade, medição geográfica de concorrentes e verificação do índice atual no Search Console. Ajustes dos perfis do Google, horários e validação de Rolim de Moura exigem acesso administrativo funcional e confirmação das informações reais de operação. Esta etapa não cria filiais, obras ou depoimentos.
