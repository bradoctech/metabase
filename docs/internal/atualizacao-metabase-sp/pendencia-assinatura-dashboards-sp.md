# Tarefa posterior — assinatura Dashboards SP em incorporação e exportações

**Estado:** levantamento estático concluído em 16/11/2026; implementação não iniciada.

**Solicitação:** usuário durante TS-12, em 14/11/2026.

**Branch de trabalho:** `EDD-1523v64`; origem da solicitação: `saopaulov64`.

**Revisão inspecionada:** `14811769fe277dfd2fde7126f5970aed4de5210a`.

**Contexto:** [roteiro de smoke](./smoke-saopaulov64.md) e [plano de reaplicação](./reaplicacao-saopaulov64.md).

## Objetivo

Substituir a identidade Metabase nas assinaturas visuais de incorporação e exportação por **Dashboards SP**, acompanhada do **brasão do Estado de São Paulo** já utilizado no fork.

Exemplos desejados: “Desenvolvido por [brasão] Dashboards SP” na incorporação e “Feito com [brasão] Dashboards SP” nas exportações, respeitando o prefixo/localização de cada fluxo. O requisito confirmado é trocar o nome Metabase e sua marca pela identidade Dashboards SP; padronização dos prefixos pode ser definida na implementação.

Nenhuma alteração de produto foi realizada ao registrar esta tarefa. A assinatura atual não invalida o aceite TS-12 da política comercial.

## Evidências e escopo

- Captura do usuário na configuração/prévia de incorporação mostra rodapé “Desenvolvido por” e logo/wordmark Metabase.
- Usuário também identificou assinatura Metabase em exportações PDF e PNG durante os smokes anteriores.
- Inspecionar pergunta e dashboard, prévia e visualização incorporada disponível, além de PNG e PDF. Assinaturas por e-mail entram na conferência se reutilizarem esses renderers e houver ambiente para exercitá-las.
- Manter dados, cores, layouts, parâmetros, tooltips e opções funcionais. Preservar as condições técnicas existentes de exibição e os gates de features/licença; substituir a identidade nos pontos de assinatura.
- A mudança é localizada nesses elementos visuais; nomes de drivers, consultas, mensagens técnicas e referências internas ao projeto não devem ser alvo de substituição global.

## Pontos de entrada identificados no código atual

| Fluxo | Arquivo / responsabilidade |
| --- | --- |
| Assinatura de incorporação | `frontend/src/metabase/embedding/components/LogoBadge/LogoBadge.tsx`: prefixo Powered by, SVG com wordmark e link |
| Footer que usa a assinatura | `frontend/src/metabase/embedding/components/EmbeddingFooter/EmbeddingFooter.tsx`; conferir também `embedding/embedding-iframe-sdk/components/SdkIframeEmbedRoute.tsx` |
| SVG atual compartilhado | `frontend/src/metabase/embedding/components/LogoBadge/metabase_logo_with_text.svg` |
| PNG/exportação frontend | `frontend/src/metabase/visualizations/lib/exports-branding-utils.tsx`: prefixo Made with e conversão do SVG para imagem |
| PDF backend | `src/metabase/channel/render/pdf.clj`: leitura do SVG, desenho vetorial do badge e prefixo localizado; PNG/frontend e PDF/backend precisam de adaptações próprias |
| Identidade SP existente | `resources/frontend_client/app/assets/img/logo.svg` e `frontend/src/metabase/common/components/LogoIcon/LogoIcon.tsx`; reutilizar a fonte do brasão, adaptando o consumo ao renderer |
| Testes relacionados | `LogoBadge.unit.spec.tsx`, `PublicApp.unit.spec.tsx`, `exports-branding-utils.unit.spec.ts` e testes PDF aplicáveis |

Esses pontos foram aprofundados no inventário abaixo. A busca cobre assinaturas e consumidores identificados no código desta revisão; disponibilidade visual depende de rota, configuração, permissões e recursos habilitados. A marca de desenvolvimento de static-viz (`hasDevWatermark`) é um mecanismo distinto da assinatura Made with/Powered by; avaliar pela finalidade antes de alterar assets de watermark.

## Detalhes para implementação

1. Definir um asset/composição de assinatura SP reutilizável para evitar divergência entre UI e exportação.
2. Preservar nitidez/proporção do brasão, nome Dashboards SP e legibilidade em temas claro/escuro e imagens estreitas.
3. No PDF, conferir compatibilidade do SVG com o renderer vetorial e a largura do novo nome; validar posicionamento/margens em todas as páginas.
4. Atualizar nome acessível e descrição da imagem para Dashboards SP. Se houver link na assinatura, definir seu destino coerente com o produto; o destino SP ainda não foi informado.
5. Conferir traduções dos prefixos e recursos gerados. Registrar novos assets/adapters nas listas canônicas no mesmo conjunto da implementação.

## Critérios de aceite e smoke futuro

- Incorporação/prévia: assinatura com Dashboards SP e brasão; legível nos temas disponíveis e sem sobrepor o gráfico ou seus controles.
- PNG: conferir pergunta e dashboard nos caminhos oferecidos, com exportação grande/pequena e dados/legendas preservados.
- PDF: conferir todas as páginas e cards, nome/brasão nítidos, sem corte ou permanência acidental da assinatura antiga nos pontos abrangidos.
- Acessibilidade: nome acessível coerente; clique/teclado corretos se a assinatura for um link.
- Testes dos componentes/renderers afetados, tipos e builds pertinentes; validar o arquivo exportado, além da prévia no navegador.
- Registrar separadamente casos sem configuração de incorporação/assinaturas; não exigir publicação real para o smoke de prévia.

## Levantamento no projeto — 16/11/2026

Leitura de fontes OSS/enterprise, componentes compartilhados, chamadas de exportação, catálogos e renderers relacionados. Nenhuma alteração de produto, configuração, feature, licença, dado ou asset foi feita. Não foram exercitados navegador, exportações ou envio real nesta rodada de levantamento; todos os smokes propostos abaixo começam como **PENDENTE**.

### Inventário principal do frontend

Os caminhos desta seção são relativos à raiz do repositório.

| ID | Exibição / consumidor | Caminhos confirmados | Comportamento atual / impacto da substituição |
| --- | --- | --- | --- |
| AS-01 | Assinatura compartilhada Powered by | `frontend/src/metabase/embedding/components/LogoBadge/LogoBadge.tsx`, `LogoBadge.module.css`, `metabase_logo_with_text.svg` na mesma pasta | Texto localizado + wordmark Metabase em SVG; `aria-label="Metabase"`; link externo para metabase.com com UTM e domínio derivado do referer. É o ponto central da identidade do rodapé. O nome não usa application-name: o próprio código fixa a marca. |
| AS-02 | Footer de pergunta/dashboard públicos ou incorporados | `frontend/src/metabase/embedding/components/EmbeddingFooter/EmbeddingFooter.tsx`; `frontend/src/metabase/public/components/EmbedFrame/EmbedFrame.tsx`; `frontend/src/metabase/embedding/components/EmbedFooter.styled.tsx` | LogoBadge só aparece com hasEmbedBranding. EmbedFrame deriva isso de hide-embed-branding? e pode manter footer para botões/download mesmo sem marca. Preservar a área de ações e sua responsividade. |
| AS-03 | Consumidores do frame além da prévia | `frontend/src/metabase/public/containers/PublicOrEmbeddedQuestion/PublicOrEmbeddedQuestionView.tsx`; `frontend/src/metabase/public/containers/PublicOrEmbeddedDashboard/PublicOrEmbeddedDashboardView.tsx`; `frontend/src/metabase/public/containers/PublicDocument/PublicDocument.tsx`; `frontend/src/metabase/public/containers/PublicAction/PublicActionLoader.tsx`; `frontend/src/metabase/public/components/PublicError.tsx` e `PublicNotFound.tsx` | A mudança compartilhada pode atingir links públicos, ações, documentos e páginas de erro que usam o frame. Conferir somente o que estiver disponível, sem presumir que todos exibem a marca em todos os estados. PublicDocument também controla withFooter pela configuração de marca. |
| AS-04 | SDK de iframe | `frontend/src/metabase/embedding/embedding-iframe-sdk/components/SdkIframeEmbedRoute.tsx` — EmbedBrandingFooter | Usa o mesmo EmbeddingFooter, com wrapper de estilos próprios; retorna null quando hide-embed-branding? está ativo. Não é o banner de diagnóstico do SDK React. |
| AS-05 | PNG de pergunta ou de card no dashboard | `frontend/src/metabase/redux/downloads.ts` — downloadToImage; `frontend/src/metabase/visualizations/lib/save-chart-image.ts`; `exports-branding-utils.tsx` na mesma pasta | includeBranding = ausência de whitelabel. Exportador usa html2canvas-pro e acrescenta a assinatura no clone do DOM. O utilitário renderiza SVG em data URL, com dimensões por faixa de largura. Não foi encontrado um fluxo de PNG do dashboard inteiro nessa cadeia: o seletor identifica o card. |
| AS-06 | Copiar gráfico como imagem | `frontend/src/metabase/query_builder/components/view/ViewFooter/use-copy-results.ts` → getChartImageBlob em save-chart-image.ts | Compartilha o render de PNG, inclusive includeBranding recebido pelo fluxo. Alterar a composição também afeta a imagem copiada para o clipboard. Não confundir com copiar dados/células. |
| AS-07 | PDF de dashboard/guia no navegador | `frontend/src/metabase/dashboard/components/DashboardHeader/buttons/ExportAsPdfButton.tsx`; `frontend/src/metabase/redux/downloads.ts` — downloadDashboardToPdf; `frontend/src/metabase/visualizations/lib/save-dashboard-pdf.ts` | Usa o mesmo createBrandingElement de PNG, captura DOM e pagina a imagem. Além da imagem da assinatura, adiciona uma anotação clicável na primeira página com URL metabase.com. Trocar apenas o SVG deixa esse destino antigo no arquivo. Não confundir com o endpoint PDF backend. |
| AS-08 | Temas, dimensões e conversão do badge de exportação | `frontend/src/metabase/visualizations/lib/exports-branding-utils.tsx`; `frontend/src/metabase/embedding/theme.module.css` | Sete tamanhos xs/s/m/l/xl/xxl/xxxl, cortes em 200/600/960/1280/1600/1920 px. xs omite o prefixo e centraliza o logo. Proporção atual fixa em 4.0625, texto Made with em Lato e imagem criada sem alt explícito. A composição SP precisa de proporção própria, acessibilidade adequada e conteúdo serializado autossuficiente. |

### PDF backend e canais — dependências do resultado final

Estas exibições não são componentes do frontend, mas podem continuar mostrando a marca antiga mesmo após corrigir todos os pontos acima.

| ID | Fluxo | Caminhos confirmados | Implicação para o plano |
| --- | --- | --- | --- |
| AS-09 | PDF gerado no servidor | `src/metabase/channel/render/pdf.clj`; `resources/fonts/pdf/metabase_logo_with_text.svg`; endpoint POST `/api/dashboard/:id/pdf` em `src/metabase/dashboards_rest/api.clj` | Asset independente da cópia frontend. Desenha Made with localizado e logo vetorial no topo direito de cada página, condicionado à ausência de whitelabel. Fonte, largura e parser são tratados no backend; atualizar o frontend não altera este PDF. |
| AS-10 | Anexos PDF de assinaturas/canais | `src/metabase/channel/impl/email.clj` — dashboard-pdf-attachment; `src/metabase/channel/impl/slack.clj` — dashboard-pdf | Reutilizam render-dashboard-to-pdf. A correção AS-09 chega a esses anexos, mas a entrega real depende de canal configurado. Não afirmar que os smokes locais de PDF validam o envio. |
| AS-11 | Corpo HTML de e-mail | `src/metabase/channel/email/dashboard_subscription.hbs`; `notification_card.hbs` na mesma pasta; contexto em `src/metabase/notification/payload/core.clj` | Assinatura própria com Made with, application_logo_url, nome Metabase literal e link metabase.com. Depende de context.include_branding, que respeita whitelabel. Não reutiliza LogoBadge nem exports-branding-utils. Tratar como extensão a confirmar; o PDF anexo e o corpo do e-mail são itens diferentes. |
| AS-12 | Mensagem de assinatura no Slack | `src/metabase/channel/impl/slack.clj` | Texto Made with Metabase com emoji é independente da assinatura no PDF anexo. Não faz parte automaticamente da substituição visual no frontend; registrar a decisão de escopo antes de alterá-lo. |

### Marca adjacente: preservar ou decidir separadamente

| Ocorrência | Onde | Tratamento proposto |
| --- | --- | --- |
| Nomes de arquivos PNG/PDF começam com Metabase quando branded | getChartFileName e getDashboardPdfFileName em `frontend/src/metabase/redux/downloads.ts` | Visível ao baixar, mas separado da assinatura dentro do arquivo. Confirmar se será Dashboards SP também; não alterar silenciosamente na implementação visual. O filename do endpoint PDF backend já segue outra regra. |
| Texto explicativo Powered by Metabase em setup | `frontend/src/metabase/home/components/EmbedHomepage/StaticEmbedContent.tsx`; `frontend/src/metabase/common/components/upsells/UpsellMetabaseBanner.tsx` | Explicação/oferta, não o badge. A política SP já controla os ramos comerciais. Não remover gates ou reativar blocos para implementar a marca; revisar coerência só nos ramos efetivamente exibidos. |
| Textos técnicos/de licenciamento sobre incorporação | `frontend/src/metabase/public/components/widgets/LegaleseStep/LegaleseStep.tsx`; `frontend/src/metabase/embedding/embedding-iframe-sdk-setup/components/AuthenticationCard/EnableGuestEmbedsSection.tsx` | Não são assinaturas visuais. Manter referências técnicas ao produto e textos existentes; fora da troca localizada de nome/logo. |
| Banner de erro/configuração do SDK | `frontend/src/embedding-sdk-bundle/lib/usage-problem.ts`; `components/private/SdkUsageProblem/SdkUsageProblemBanner.tsx` no mesmo bundle | Exibe This embed is powered by Metabase / Metabase SDK apenas em diagnóstico. Usa DefaultLogoIcon, já SP, mas mantém o nome técnico do SDK. Não substituir esses diagnósticos como se fossem o footer normal. |
| Watermark Development | `frontend/src/metabase/visualizations/components/Visualization/Watermark/Watermark.tsx`; `frontend/src/metabase/static-viz/watermark.svg` e seus consumidores | Mecanismo development_mode, distinto de Made with/Powered by. Não alterar nem desativar nesta tarefa. |
| Ícones gerais, plugin de logo, Sobre e assets de carregamento | `frontend/src/metabase/common/components/LogoIcon/LogoIcon.tsx`; `enterprise/frontend/src/metabase-enterprise/whitelabel/components/LogoIcon.tsx`; `frontend/src/metabase/nav/components/AboutModal/AboutModal.tsx`; asset `resources/frontend_client/app/instance-loading-page/img/metabase-logo.svg` | LogoIcon padrão já aponta ao brasão SP. Manter plugins e telas gerais fora do escopo. A existência do asset de carregamento, por si só, não comprova sua exibição; não foi encontrado consumidor direto desse SVG na busca desta rodada. |

Não fazer substituição global de Metabase em código, nomes de API, SDK, drivers, consultas, identificadores, URLs técnicas, catálogos ou documentação upstream.

## Achados técnicos para a composição SP

1. **Asset atual do brasão:** `resources/frontend_client/app/assets/img/logo.svg`, 288.203 bytes, viewBox `0 0 370.206 430.138`. Tem 432 paths, 15 polylines e oito rects; parte das cores está em atributos próprios e parte é herdada. O brasão sozinho é vertical, diferente do wordmark horizontal atual.
2. **Logo Metabase tem duas cópias:** SVG frontend e `resources/fonts/pdf/metabase_logo_with_text.svg`, ambos com viewBox `0 0 87 22` nesta revisão. Renomear/substituir uma cópia não atualiza a outra.
3. **Parser PDF limitado:** brand-logo extrai viewBox e grupos `<g fill="...">` com paths por regex; desenha somente os paths extraídos. Não interpreta integralmente rect/polyline, fills individuais e herança de cor do brasão. Copiar o SVG SP para o recurso PDF atual não garante fidelidade e pode perder partes/cores.
4. **Composição proposta:** assinatura horizontal com brasão colorido proporcional + texto Dashboards SP, mantendo os prefixos localizados. Produzir um asset autossuficiente para exportações, sem fetch de imagens/estilos externos durante a captura. Reutilizar a mesma fonte de identidade, com derivação documentada para os renderers, sem modificar o brasão global.
5. **PDF:** avaliar asset vetorial normalizado para o parser ou adaptação pontual do renderer. Converter rect/polyline e tornar fills explícitos se essa for a solução escolhida. Uma alternativa raster em alta resolução exigiria conferência de nitidez; não escolher automaticamente apenas para contornar o parser. O prefixo no PDF usa o sistema de fontes do próprio renderer, não herda Rawline/CSS da aplicação.
6. **Cores no navegador/exportação:** a UI de LogoBadge usa variáveis específicas para o logo Metabase e um fundo dark próprio. O PNG usa SVG serializado em base64; cores/wordmark devem sobreviver à serialização, aos dois temas e ao canvas. Não recolorir o brasão inteiro por currentColor.
7. **Links e acessibilidade:** definir destino para o badge e para a anotação PDF frontend. Atualizar nome acessível, alt quando aplicável e comportamento de foco/teclado. Não deixar Dashboards SP apontando para uma URL comercial antiga por omissão.
8. **Localização:** Powered by já traduz como Desenvolvido por; Made with já traduz como Feito com em pt-BR. Manter essas chaves é a proposta inicial; Dashboards SP é identidade fixa da assinatura, não substituição do nome configurável do site. Só regenerar catálogos se houver mudança real nas chaves/mensagens.

## Plano proposto de implementação

| Etapa | Entrega | Validação antes de seguir |
| --- | --- | --- |
| 1. Decisões e composição | Definir destino do link, escopo de filenames/canais e composição visual; reutilizar brasão existente com wordmark SP | Conferir proporção, tamanho mínimo e temas; provar compatibilidade do asset com canvas/PDF antes de generalizar |
| 2. Footer compartilhado | Aplicar identidade em LogoBadge e seus estilos, mantendo hasEmbedBranding/hide-embed-branding? e os wrappers | Testes LogoBadge, PublicApp e SdkIframeEmbedRoute; casos de presença/ausência, prefixo, acessibilidade e destino do link |
| 3. Exportações frontend | Atualizar composição/dimensões em exports-branding-utils; tratar a anotação de link de save-dashboard-pdf; manter PNG e clipboard compartilhados | Testes dos utilitários e captura real de PNG/clipboard/PDF em tamanhos pequenos/grandes, temas e múltiplas páginas |
| 4. PDF backend | Atualizar o recurso e sua leitura/desenho conforme a prova vetorial; preservar include-branding? e cabeçalho | Testes PDF de parsing/desenho/gates e arquivos reais A4/Letter/multipágina; conferir brasão, nome e conteúdo |
| 5. Integrações confirmadas | Exercitar anexos compartilhados; alterar corpo de e-mail/Slack somente se confirmado no escopo | Testes do canal afetado e envio em homologação quando houver infraestrutura; registrar trechos não executados |
| 6. Transporte e fechamento | Incluir todos os novos assets/adapters/testes nas listas canônicas; verificar tipos/lint e builds pertinentes | Frontend, static-viz e pacote atualizado; validar o artefato exportado, registrar evidência por cenário e restaurar o estado de version.properties ao voltar ao dev |

A composição poderá ficar em um módulo/asset dedicado à assinatura SP, compartilhado por UI/exportação onde tecnicamente compatível. Não espalhar literais, dimensões e destino por vários componentes. Os caminhos definitivos e novos arquivos serão definidos na implementação, com seus consumidores registrados nas listas.

### Decisões abertas antes da implementação

- **Link:** qual URL institucional deve abrir ao clicar na assinatura? Se a preferência for não haver link, confirmar essa decisão para UI e anotação do PDF frontend.
- **Escopo adjacente:** trocar também o prefixo Metabase dos nomes de arquivos? Incluir marca no corpo de e-mail e texto do Slack, ou somente os anexos que compartilham o PDF?
- **Direção visual proposta:** manter Desenvolvido por / Feito com, usar brasão colorido e nome fixo Dashboards SP; validar uma amostra pequena e grande antes de aplicar a todos os fluxos. Ainda não há mockup/asset novo aprovado nesta rodada.

## Proposta de validação — lotes de cinco

**Estado inicial de todos os casos: PENDENTE.** Este roteiro é planejamento; nenhum OK foi inferido da leitura de código ou dos smokes de saopaulov64.

### Lote 1 — assinatura na interface

| ID | Como validar | Resultado esperado |
| --- | --- | --- |
| AS-SM-01 | Prévia de incorporação de pergunta, sem publicar apenas para testar | Desenvolvido por, brasão e Dashboards SP corretos; gráfico, parâmetros e controles preservados |
| AS-SM-02 | Prévia de dashboard com guias/filtros e espaço reduzido | Marca legível sem sobreposição; filtros, guias e download continuam funcionando |
| AS-SM-03 | Abrir pergunta/dashboard públicos já disponibilizados para teste | Mesma identidade do badge; rotas e acesso existentes preservados |
| AS-SM-04 | Conferir o iframe SDK disponível, temas claro/escuro e teclado | Wrapper e footer corretos; nome acessível/foco e link conforme decisão; sem alterar gates |
| AS-SM-05 | Conferir cenários com marca exibida/oculta e consumidores auxiliares disponíveis (documento/ação/erro) | A marca respeita as condições atuais; footer com ações funciona mesmo sem badge. Recurso não disponível fica pendente ou não aplicável justificado |

### Lote 2 — exportações frontend

| ID | Como validar | Resultado esperado |
| --- | --- | --- |
| AS-SM-06 | PNG de pergunta e PNG de card no dashboard | Feito com + identidade SP, sem logo/wordmark antigo no badge; dados/legendas e recorte preservados |
| AS-SM-07 | PNG nas faixas pequenas e grandes, incluindo xs abaixo de 200 px quando reproduzível | Proporção correta, sem corte; comportamento aprovado de omitir prefixo no xs mantido; nome ainda legível |
| AS-SM-08 | PNG em temas claro e escuro; conferir escala e reabrir o arquivo | Brasão fiel, wordmark contrastante, cores resolvidas no SVG/canvas e imagem íntegra |
| AS-SM-09 | Copiar gráfico como imagem e colar em ferramenta compatível | Identidade e conteúdo iguais ao render PNG; falha de permissão do clipboard não é confundida com falha de marca |
| AS-SM-10 | Exportar dashboard/guia pelo botão do navegador, com mais de uma página | PDF com layout/dados preservados e nova identidade nos pontos em que o exportador a inclui; anotação da primeira página com destino aprovado ou ausente conforme decisão |

### Lote 3 — PDF backend, integrações e regressão

| ID | Como validar | Resultado esperado |
| --- | --- | --- |
| AS-SM-11 | PDF backend A4 e Letter, com várias páginas | Brasão e Dashboards SP nítidos em todas as páginas, sem sobrepor título/cards; prefixo localizado correto |
| AS-SM-12 | Conferir gating de whitelabel e marca ocultável nos renderers afetados | Regras preservadas: sem forçar marca onde antes era ocultada nem remover a marca onde deveria aparecer |
| AS-SM-13 | Assinatura por e-mail e/ou Slack com PDF anexo em ambiente configurado | Anexo usa marca nova; corpo/mensagem seguem o escopo confirmado; envio e links funcionam. Sem canal, registrar pendência |
| AS-SM-14 | SVG/PNG/PDF com pt-BR e outro locale disponível; assets em subdiretório se aplicável | Prefixos e proporção corretos, sem recurso externo ausente, erro de fonte, 404 ou retorno da marca antiga no badge |
| AS-SM-15 | Conferir testes/builds, acessibilidade e o pacote final; revisar assinaturas antigas remanescentes | Código empacotado corresponde ao validado; nomes/links conforme escopo; diagnósticos, referências técnicas e watermark Development preservados |

Registrar por ID: OK/FAIL/PENDENTE/NÃO APLICÁVEL, fluxo, usuário/perfil, tema, tamanho, locale, evidência e motivo dos trechos não exercitados. Sem feature/canal/banco de teste, não aprovar por ausência de exibição.

### Testes existentes para usar como base

- `frontend/src/metabase/embedding/components/LogoBadge/LogoBadge.unit.spec.tsx`: hoje valida prefixo e URL/UTM; ampliar para a identidade SP e estados relevantes.
- `frontend/src/metabase/public/containers/PublicApp/PublicApp.unit.spec.tsx`: presença/ausência do prefixo conforme configuração; manter cobertura de gates.
- `frontend/src/metabase/embedding/embedding-iframe-sdk/components/SdkIframeEmbedRoute.unit.spec.tsx`: integração do footer no wrapper do SDK.
- `frontend/src/metabase/visualizations/lib/exports-branding-utils.unit.spec.ts`: dimensões, estrutura e data URL; conferir também o conteúdo real serializado, sem se limitar a qualquer data URL válida.
- `frontend/src/metabase/visualizations/lib/save-chart-image.unit.spec.ts`: captura PNG e render compartilhado pelo clipboard.
- `frontend/src/metabase/visualizations/lib/save-dashboard-pdf.unit.spec.ts`: paginação/render/link no PDF frontend.
- `test/metabase/channel/render/pdf_test.clj`: grupos/cores do asset, paths desenháveis, geração de PDF e gating. As expectativas atuais fixam 87×22 e três grupos de cores Metabase; precisam refletir o novo contrato, não apenas aceitar um arquivo não vazio.
- Se e-mail/Slack entrarem no escopo: testes de canal e payload em `test/metabase/channel/impl/email_test.clj`, `slack_test.clj` e `test/metabase/notification/payload/core_test.clj`.

### Proteção para próximos upgrades

Hoje `exports-branding-utils.tsx` e `save-dashboard-pdf.ts` já aparecem em lists/dual-changed.txt. Os caminhos de LogoBadge/SVG e do PDF backend/recurso não foram encontrados como entradas exatas nessa busca nas listas. Na implementação, registrar explicitamente cada adapter/asset/teste alterado no bucket adequado; não considerar o transporte completo apenas porque o arquivo principal foi listado. As regras e a evidência por consumidor devem acompanhar o inventário, conforme aprendizado do AUD-011.
