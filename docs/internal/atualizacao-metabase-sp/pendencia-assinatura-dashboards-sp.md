# Tarefa posterior — assinatura Dashboards SP em incorporação e exportações

**Estado:** modelo visual frontend aprovado pelo usuário em 18/11/2026 no escopo testado; links da assinatura removidos na interface e no PDF frontend. PDF backend, corpos HTML de e-mail e mensagens de assinatura do Slack receberam a composição SP, sem link, em 18/11/2026. Testes automatizados aprovados. PDF backend aprovado visualmente pelo usuário via endpoint/DevTools no cenário executado; e-mail e complementos de PDF ficam para homologação. Slack permanece no escopo implementado, com validação real opcional e sem exigir vínculo.

**Solicitação:** usuário durante TS-12, em 14/11/2026.

**Branch de trabalho:** `EDD-1523v64`; origem da solicitação: `saopaulov64`.

**Revisão inspecionada:** `14811769fe277dfd2fde7126f5970aed4de5210a`.

**Contexto:** [roteiro de smoke](./smoke-saopaulov64.md) e [plano de reaplicação](./reaplicacao-saopaulov64.md).

## Objetivo

Substituir a identidade Metabase nas assinaturas visuais de incorporação e exportação por **Dashboards SP**, acompanhada do **brasão do Estado de São Paulo** já utilizado no fork.

Exemplos desejados: “Desenvolvido por [brasão] Dashboards SP” na incorporação e “Feito com [brasão] Dashboards SP” nas exportações, respeitando o prefixo/localização de cada fluxo. O requisito confirmado é trocar o nome Metabase e sua marca pela identidade Dashboards SP; padronização dos prefixos pode ser definida na implementação.

Nenhuma alteração de produto foi realizada ao registrar esta tarefa. A assinatura atual não invalida o aceite TS-12 da política comercial.

## Composição de texto e imagem — definição de 18/11/2026

A imagem deve conter **somente o brasão SP**. Prefixos e nome do produto ficam em elementos de texto separados:

- Incorporação: `Desenvolvido por` (texto) → brasão (imagem) → `Dashboards SP` (texto).
- Exportação: `Feito com` (texto) → brasão (imagem) → `Dashboards SP` (texto).

O nome Metabase hoje faz parte dos paths do SVG com wordmark; por isso é preciso substituir esse asset inteiro pelo brasão e acrescentar o novo nome como texto. Não criar uma imagem com a frase completa ou incluir Dashboards SP dentro do asset do brasão.

Na geração do PNG, essa separação existe no DOM antes de html2canvas-pro fazer a captura. O arquivo PNG final é uma imagem rasterizada: seus textos não se tornam texto selecionável/editável dentro do arquivo. Isso não exige transformar previamente os elementos de texto em um logo. A visibilidade atual do prefixo em xs permanece um comportamento a preservar conforme o roteiro; o nome Dashboards SP deve integrar a composição textual.

### Asset e dimensões do Metabase antes do teste visual

**Arquivo:** [metabase_logo_with_text.svg](../../../frontend/src/metabase/embedding/components/LogoBadge/metabase_logo_with_text.svg). É SVG, não um PNG de origem, e reúne símbolo e nome Metabase.

- Atributos do arquivo: `height="32"`, `viewBox="0 0 87 22"`; sem atributo width explícito.
- Na implementação original de incorporação, LogoBadge.tsx informava `height={32}` e não informa width explicitamente.
- Na implementação original de exportação PNG, [exports-branding-utils.tsx](../../../frontend/src/metabase/visualizations/lib/exports-branding-utils.tsx) calcula `LOGO_WIDTH = LOGO_HEIGHT × 4.0625`, com `LOGO_HEIGHT = ly`. Essas dimensões se aplicam ao símbolo e nome juntos, não somente ao símbolo.

| Faixa | Largura do conteúdo | Largura calculada do SVG (px) | Altura (px) |
| --- | --- | ---: | ---: |
| xs | abaixo de 200 px | 65 | 16 |
| s | 200 a menos de 600 px | 65 | 16 |
| m | 600 a menos de 960 px | 81,25 | 20 |
| l | 960 a menos de 1280 px | 113,75 | 28 |
| xl | 1280 a menos de 1600 px | 146,25 | 36 |
| xxl | 1600 a menos de 1920 px | 195 | 48 |
| xxxl | a partir de 1920 px | 260 | 64 |

O código também atribui a largura ao atributo HTML img.width, que é inteiro; as larguras fracionárias refletem como 81, 113 e 146 nesse atributo. A tabela mostra a largura calculada passada ao SVG. O canvas de PNG usa scale 2, portanto essas medidas de layout não são a resolução final em pixels do arquivo inteiro.

**Brasão existente:** [logo.svg](../../../resources/frontend_client/app/assets/img/logo.svg), com width 370.21, height 430.14 e viewBox `0 0 370.206 430.138`. Na substituição, preservar a proporção desse brasão; não aplicar a ele o fator horizontal 4.0625 usado pelo wordmark Metabase.

## Evidências e escopo

- Captura do usuário na configuração/prévia de incorporação mostra rodapé “Desenvolvido por” e logo/wordmark Metabase.
- Usuário também identificou assinatura Metabase em exportações PDF e PNG durante os smokes anteriores.
- Inspecionar pergunta e dashboard, prévia e visualização incorporada disponível, além de PNG e PDF. Assinaturas por e-mail entram na conferência se reutilizarem esses renderers e houver ambiente para exercitá-las.
- Manter dados, cores, layouts, parâmetros, tooltips e opções funcionais. Preservar as condições técnicas existentes de exibição e os gates de features/licença; substituir a identidade nos pontos de assinatura.
- A mudança é localizada nesses elementos visuais; nomes de drivers, consultas, mensagens técnicas e referências internas ao projeto não devem ser alvo de substituição global.

## Pontos de entrada do levantamento anterior à implementação

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

1. Reutilizar o asset do brasão apenas como imagem. Manter o prefixo e Dashboards SP como texto separado, com composição reutilizável entre UI e exportação.
2. Preservar nitidez/proporção do brasão, nome Dashboards SP e legibilidade em temas claro/escuro e imagens estreitas.
3. No PDF, conferir compatibilidade do SVG com o renderer vetorial e a largura do novo nome; validar posicionamento/margens em todas as páginas.
4. Atualizar nome acessível e descrição da composição. Por decisão de 18/11/2026, a assinatura não tem link; não criar foco/ação de navegação para esse elemento.
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
4. **Composição definida pelo usuário em 18/11/2026:** prefixo localizado em texto, seguido do brasão colorido como imagem e do nome Dashboards SP novamente em texto. Não gerar uma imagem contendo o prefixo ou o nome. No PNG, usar elementos de texto no DOM e serializar apenas o brasão de forma autossuficiente, sem fetch externo durante a captura. Reutilizar a mesma fonte de identidade, sem modificar o brasão global.
5. **PDF:** avaliar asset vetorial normalizado para o parser ou adaptação pontual do renderer. Converter rect/polyline e tornar fills explícitos se essa for a solução escolhida. Uma alternativa raster em alta resolução exigiria conferência de nitidez; não escolher automaticamente apenas para contornar o parser. O prefixo no PDF usa o sistema de fontes do próprio renderer, não herda Rawline/CSS da aplicação.
6. **Cores no navegador/exportação:** a UI de LogoBadge usa variáveis específicas para o logo Metabase e um fundo dark próprio. O PNG usa SVG serializado em base64; as cores do brasão devem sobreviver à serialização; prefixo e nome são texto no DOM, com contraste nos dois temas e captura correta no canvas. Não recolorir o brasão inteiro por currentColor.
7. **Links e acessibilidade:** definir destino para o badge e para a anotação PDF frontend. Atualizar nome acessível, alt quando aplicável e comportamento de foco/teclado. Não deixar Dashboards SP apontando para uma URL comercial antiga por omissão.
8. **Localização:** Powered by já traduz como Desenvolvido por; Made with já traduz como Feito com em pt-BR. Manter essas chaves é a proposta inicial; Dashboards SP é identidade fixa da assinatura, não substituição do nome configurável do site. Só regenerar catálogos se houver mudança real nas chaves/mensagens.

## Plano proposto de implementação

| Etapa | Entrega | Validação antes de seguir |
| --- | --- | --- |
| 1. Decisões e composição | Adotar assinatura sem link e definir escopo de filenames/canais; compor prefixo em texto + brasão existente como imagem + Dashboards SP em texto | Conferir proporção, tamanho mínimo e temas; provar compatibilidade do asset com canvas/PDF antes de generalizar |
| 2. Footer compartilhado | Aplicar identidade em LogoBadge e seus estilos, mantendo hasEmbedBranding/hide-embed-branding? e os wrappers | Testes LogoBadge, PublicApp e SdkIframeEmbedRoute; casos de presença/ausência, prefixo, acessibilidade e destino do link |
| 3. Exportações frontend | Atualizar composição/dimensões em exports-branding-utils; tratar a anotação de link de save-dashboard-pdf; manter PNG e clipboard compartilhados | Testes dos utilitários e captura real de PNG/clipboard/PDF em tamanhos pequenos/grandes, temas e múltiplas páginas |
| 4. PDF backend | Atualizar o recurso e sua leitura/desenho conforme a prova vetorial; preservar include-branding? e cabeçalho | Testes PDF de parsing/desenho/gates e arquivos reais A4/Letter/multipágina; conferir brasão, nome e conteúdo |
| 5. Integrações confirmadas | Exercitar anexos compartilhados; alterar corpo de e-mail/Slack somente se confirmado no escopo | Testes do canal afetado e envio em homologação quando houver infraestrutura; registrar trechos não executados |
| 6. Transporte e fechamento | Incluir todos os novos assets/adapters/testes nas listas canônicas; verificar tipos/lint e builds pertinentes | Frontend, static-viz e pacote atualizado; validar o artefato exportado, registrar evidência por cenário e restaurar o estado de version.properties ao voltar ao dev |

A composição poderá ficar em um módulo/asset dedicado à assinatura SP, compartilhado por UI/exportação onde tecnicamente compatível. Não espalhar literais, dimensões e destino por vários componentes. Os caminhos definitivos e novos arquivos serão definidos na implementação, com seus consumidores registrados nas listas.

### Decisões de implementação

- **Link — decidido em 18/11/2026:** assinatura sem link. Removidos o anchor do LogoBadge e a anotação comercial do PDF frontend. Não remover links funcionais de gráficos, dados ou navegação; a ausência de link é da assinatura.
- **Escopo confirmado:** corpos de e-mail e assinatura Slack incluídos na implementação de 18/11/2026. Por decisão posterior do usuário, teste real do Slack é opcional, sem exigir vínculo. Prefixos dos nomes de arquivos permanecem fora desta alteração.
- **Direção visual definida em 18/11/2026:** Desenvolvido por / Feito com e Dashboards SP devem continuar como texto, com somente o brasão como imagem entre os dois. Validar amostras pequena/grande e manter a proporção do brasão. O aceite dessa composição não equivale ao aceite de uma implementação ou de um novo mockup.

## Proposta de validação — lotes de cinco

**Estado inicial do roteiro: PENDENTE.** A consolidação abaixo registra os retornos posteriores; os testes automatizados e o aceite geral do modelo não aprovam automaticamente todos os cenários manuais.

### Lote 1 — assinatura na interface

| ID | Como validar | Resultado esperado |
| --- | --- | --- |
| AS-SM-01 | Prévia de incorporação de pergunta, sem publicar apenas para testar | Desenvolvido por, brasão e Dashboards SP corretos; gráfico, parâmetros e controles preservados |
| AS-SM-02 | Prévia de dashboard com guias/filtros e espaço reduzido | Marca legível sem sobreposição; filtros, guias e download continuam funcionando |
| AS-SM-03 | Abrir pergunta/dashboard públicos já disponibilizados para teste | Mesma identidade do badge; rotas e acesso existentes preservados |
| AS-SM-04 | Conferir o iframe SDK disponível, temas claro/escuro e teclado | Wrapper e footer corretos; nome acessível correto, assinatura sem link e controles funcionais com foco preservado; sem alterar gates |
| AS-SM-05 | Conferir cenários com marca exibida/oculta e consumidores auxiliares disponíveis (documento/ação/erro) | A marca respeita as condições atuais; footer com ações funciona mesmo sem badge. Recurso não disponível fica pendente ou não aplicável justificado |

### Lote 2 — exportações frontend

| ID | Como validar | Resultado esperado |
| --- | --- | --- |
| AS-SM-06 | PNG de pergunta e PNG de card no dashboard | Feito com e Dashboards SP como textos separados do brasão no DOM; PNG capturado com identidade SP, sem wordmark antigo; dados/legendas e recorte preservados |
| AS-SM-07 | PNG nas faixas pequenas e grandes, incluindo xs abaixo de 200 px quando reproduzível | Proporção correta, sem corte; comportamento aprovado de omitir prefixo no xs mantido; nome ainda legível |
| AS-SM-08 | PNG em temas claro e escuro; conferir escala e reabrir o arquivo | Brasão fiel, prefixo e Dashboards SP contrastantes como texto no DOM, cores resolvidas no SVG/canvas e imagem íntegra |
| AS-SM-09 | Copiar gráfico como imagem e colar em ferramenta compatível | Identidade e conteúdo iguais ao render PNG; falha de permissão do clipboard não é confundida com falha de marca |
| AS-SM-10 | Exportar dashboard/guia pelo botão do navegador, com mais de uma página | PDF com layout/dados preservados e nova identidade nos pontos em que o exportador a inclui; sem anotação clicável na assinatura da primeira página |

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

## Teste visual aplicado — 18/11/2026

**Autorização do usuário:** aplicar agora apenas como teste visual, após definir prefixo e nome como texto separado da imagem.

- **Incorporação:** LogoBadge usa DefaultLogoIcon com altura 32 px, reutilizando o brasão existente, e um span com o nome Dashboards SP; o prefixo localizado continua em outro span. O nome fica em Rawline, 16 px, peso 700. As condições de exibição não foram alteradas.
- **PNG:** o helper serializa somente o SVG do brasão como data URL; prefixo e Dashboards SP são spans separados no DOM. A proporção da imagem usa 370.206 / 430.138, sem reaproveitar a proporção do wordmark antigo. Exemplo m: imagem de 17 × 20 px e nome em texto de 13 px. O tamanho xs continua sem prefixo, mas agora mantém Dashboards SP como texto.
- **PDF frontend:** recebe a composição por compartilhar o mesmo helper. Isso é efeito do consumidor existente; não representa aceite visual desse PDF.
- **Mantidos para esta experiência:** links/UTMs atuais, nomes dos arquivos e gates. O destino institucional foi substituído pela decisão posterior de assinatura sem link, registrada abaixo. Não foram alterados PDF backend, e-mail ou Slack; esses pontos podem continuar mostrando a marca antiga.
- **Verificação:** cinco suítes, 31 testes aprovados com Jest em Node; ESLint, Stylelint e formatação aprovados. A primeira tentativa de Jest forçado no runtime Bun falhou antes de executar testes por incompatibilidade do runner; a repetição em Node passou, sem mudar as regras ou desativar testes. Não houve build de produção, geração de JAR, commit ou deploy neste teste.

**Para conferir no ambiente local:** recarregar o frontend; abrir a prévia de incorporação de pergunta/dashboard nos temas disponíveis; exportar uma pergunta/card como PNG e conferir prefixo + brasão + nome, com tamanho normal e estreito. Abrir o PNG salvo, além de olhar a prévia. O PNG final é rasterizado, embora os textos continuem separados da imagem no DOM usado na captura. Retornar OK/FAIL com tema, tamanho e captura. Os smokes AS-SM seguem pendentes até o aceite do usuário, sem presumir validação pelo teste automatizado.

**Prévia isolada conferida em Chromium:** imagens do brasão carregaram nos dois temas; prefixo e nome permanecem em spans no helper. Na amostra, incorporação usa altura 32 px (largura calculada pelo navegador aproximadamente 28 px) e exportação m usa 17 × 20 px. Captura e checks locais em `.merge-sp/assinatura-visual-2026-11-18/`; isso não substitui o aceite na aplicação nem comprova a exportação final por html2canvas. A primeira autorização automática dessa prévia expirou antes de executar; a repetição com a preparação separada concluiu normalmente.

## Aceite do modelo e remoção de links — 18/11/2026

O usuário confirmou que o modelo ficou OK onde testou e autorizou continuar com ele. Esse aceite aprova a direção visual nos cenários relatados, sem aprovar automaticamente todas as saídas AS-SM nem os canais ainda não exercitados.

Removidos o ExternalLink e a construção de UTM/referer do LogoBadge: a composição passa a um div sem ação de clique ou foco de link. Também removida a anotação pdf.link da assinatura no PDF frontend; não basta trocar a imagem e deixar uma área clicável apontando ao Metabase. Links funcionais de conteúdo não foram alvo da mudança. Cinco suítes/31 testes aprovaram a revisão; lint e formatação aprovados. O teste do LogoBadge agora verifica ausência do link.

Na etapa frontend acima, PDF backend e canais ainda não haviam sido alterados. A implementação posterior está registrada a seguir; nenhum envio real ou mudança de SMTP/Slack foi efetuado pelo agente.

## Implementação dos três pontos restantes — 18/11/2026

Autorização do usuário: aplicar o padrão SP nos três pontos restantes e substituir integralmente as assinaturas Metabase identificadas no inventário. A composição mantém o prefixo localizado como texto, o brasão como imagem e Dashboards SP como texto; não contém link comercial ou institucional.

- **Fonte compartilhada:** `src/metabase/channel/branding.clj` lê o brasão existente `resources/frontend_client/app/assets/img/logo.svg`. Preserva 455 formas, seis cores e proporção original. PDF usa desenho vetorial; e-mail/Slack usam PNG transparente derivado desse mesmo recurso, de 441 × 512 px. Não depende de URL pública ou configuração do logo da instância.
- **PDF backend (AS-09/10):** assinatura no topo direito de cada página, prefixo localizado e nome como texto PDF. Cobre o endpoint de PDF e seus anexos nos canais. Gate de whitelabel preservado.
- **Corpos de e-mail (AS-11):** templates padrão de assinatura de dashboard e alerta de pergunta recebem brasão em anexo inline por CID, prefixo e nome separados. Gate `context.include_branding`, conteúdo e links funcionais preservados.
- **Slack (AS-12):** assinatura acrescentada ao final dos blocos do dashboard, preservando a ordem dos cards. Brasão enviado como arquivo pela integração existente, com prefixo/nome como texto. O elemento de imagem usa `slack_file`, conforme a [documentação do elemento de imagem](https://docs.slack.dev/reference/block-kit/block-elements/image-element/) e do [objeto de arquivo Slack](https://docs.slack.dev/reference/block-kit/composition-objects/slack-file-object/). No modo PDF, a assinatura está no próprio anexo; a entrega como arquivo único e sua legenda funcional permanecem preservadas.

**Cobertura:** os pontos de assinatura controlados identificados no inventário agora usam SP. Nomes técnicos, nomes de arquivos exportados, watermark de desenvolvimento, templates arbitrários do usuário e gates de licença não foram objeto de substituição global. Alertas Slack que não possuíam assinatura não receberam um rodapé novo.

**Verificação automatizada:** 42 testes do renderer PDF, 10 de e-mail e 10 de Slack aprovados (62 testes distintos). Cobrem formas/cores do brasão, PNG transparente, texto extraído de PDF, ausência de anotação de link na assinatura, ambos os templates HTML, CID e gates de ocultação; Slack com upload simulado e preservação de cards/links. Frontend: cinco suítes/31 testes aprovados na etapa anterior. Formatação Clojure e verificação de requires aprovadas.

**Evidências locais ignoradas pelo Git:** `.merge-sp/assinatura-backend-2026-11-18/` contém logs, brasão PNG, HTML dos dois templates e `assinatura-backend-a4-letter.pdf`, prévia de duas páginas (A4 e Letter) com a assinatura real. Página PDF renderizada e inspecionada visualmente. Essa prévia não é um dashboard completo e não aprova entrega por e-mail/Slack.

**Aceite posterior do usuário:** PDF backend gerado pelo código do console do Chrome/DevTools que chama POST `/api/dashboard/:id/pdf`; assinatura considerada satisfatória no arquivo recebido. Isso valida o endpoint real, sem necessidade de repetir pela REPL. Formato do papel, quantidade de páginas e demais variações não foram informados.

**Aberto para homologação:** complementar PDF com dashboard multipágina e papel A4/Letter quando ainda não exercitados; conferir ausência de cortes/sobreposição em cada página. Validar os corpos HTML de assinatura de dashboard e alerta de pergunta, imagem inline e PDF anexo no provedor/captura disponível. A entrega do anexo não é comprovada pelo download direto do endpoint.

**Slack — validação opcional:** implementação e testes automatizados permanecem no escopo. Por decisão do usuário, não exigir vínculo com workspace/canal para fechar o trabalho local. Mensagem e anexo poderão ser conferidos futuramente se já houver integração de teste autorizada; não registrar como aprovado um envio não realizado.

**Pacote:** JAR não foi reconstruído nesta etapa; o pacote anterior não contém essas alterações. Gerar e verificar novo build/JAR no fechamento, preservando o procedimento de `version.properties`. Nenhuma mensagem foi enviada pelo agente.

### Consolidação dos cenários AS-SM

| ID | Estado / evidência disponível | Próxima ação |
| --- | --- | --- |
| AS-SM-01 a 05 | Aceite geral do modelo frontend no escopo relatado; não há discriminação completa por cenário | Registrar quais prévias/rotas, temas e controles foram efetivamente testados; manter cenários não exercitados abertos ou não aplicáveis com motivo |
| AS-SM-06 a 10 | Modelo aprovado onde testado; não equivale a aceite de todas as variações de PNG, clipboard e PDF frontend | Associar os testes já realizados aos IDs, sem exigir sua repetição; registrar variantes ainda não exercitadas |
| AS-SM-11 | PARCIAL: PDF backend real via endpoint/DevTools aprovado pelo usuário | A4/Letter e multipágina permanecem abertos para homologação quando não exercitados |
| AS-SM-12 | Gates cobertos por testes automatizados; aceite manual específico não informado | Conferir apenas em ambiente/perfil compatível; registrar limitação se indisponível |
| AS-SM-13 — e-mail | ABERTO PARA HOMOLOGAÇÃO: corpo dashboard, alerta e PDF anexo | Conferir imagem inline, identidade, links funcionais e entrega |
| AS-SM-13 — Slack | OPCIONAL, sem vínculo obrigatório; sem envio real validado | Conferir somente se houver integração autorizada disponível |
| AS-SM-14 | Cobertura manual completa de locale/subdiretório não informada | Validar conforme configuração do ambiente; marcar não aplicável com motivo quando pertinente |
| AS-SM-15 | Testes automatizados aprovados; novo build/JAR ainda pendente | Gerar pacote e verificar versão, recursos e assinatura no artefato |

Consolidar significa registrar os testes já feitos com seu ID e seus limites. Não exige repetir um cenário já aprovado nem habilitar uma integração indisponível. Aceite visual geral do modelo permanece válido, mas não deve ser convertido em aprovação de rotas, formatos ou canais não exercitados.

## Reprodução local das saídas backend e canais

### Preparação comum

1. Subir FE e BE pelo fluxo de desenvolvimento habitual, autenticado como usuário com acesso ao dashboard. Não gerar JAR para este teste nem trocar o banco local para uma versão de produção.
2. Escolher um dashboard pequeno com dados e anotar seu ID numérico, por exemplo 1. Confirmar que filtros obrigatórios têm valor/default.
3. O PDF backend usa static-viz. O comando clean-dev:js apaga o diretório dist, incluindo lib-static-viz.bundle.js. Se o arquivo estiver ausente ou o PDF acusar erro de bundle, gerar **depois** da limpeza/inicialização do FE:

```bash
mise exec -- env MB_EDITION=oss RSPACK_WORKER_THREADS=1 NODE_OPTIONS=--max-old-space-size=3072 bun --bun run build-release:static-viz
```

Essa etapa isolada não gera resources/version.properties. Se o BE já tiver tentado carregar um bundle ausente, reiniciá-lo e repetir, sem limpar dist novamente depois da geração.

### A. Gerar PDF backend sem SMTP ou Slack

O botão de PDF do dashboard usa o exportador frontend; para comparar o renderer backend, usar POST `/api/dashboard/:id/pdf` ou a função REPL indicada adiante.

1. Na aba autenticada da aplicação local (ex.: localhost:3002), abrir F12 → Console.
2. Executar o trecho abaixo, ajustando dashboardId. Ele usa a sessão da própria aba e obtém o token anti-CSRF de uma resposta autenticada; não requer copiar cookies/tokens para fora do navegador.

```js
const dashboardId = 1;
const sessionResponse = await fetch('/api/user/current', {
  credentials: 'same-origin',
});
if (!sessionResponse.ok) throw new Error('Entre novamente na aplicação.');
const headers = { 'Content-Type': 'application/json' };
const csrf = sessionResponse.headers.get('X-Metabase-Anti-CSRF-Token');
if (csrf) headers['X-Metabase-Anti-CSRF-Token'] = csrf;
const response = await fetch(`/api/dashboard/${dashboardId}/pdf`, {
  method: 'POST',
  credentials: 'same-origin',
  headers,
  body: JSON.stringify({ parameters: [], paper_size: 'a4' }),
});
if (!response.ok) throw new Error(await response.text());
const url = URL.createObjectURL(await response.blob());
const download = document.createElement('a');
download.href = url;
download.download = `dashboard-${dashboardId}-backend.pdf`;
document.body.appendChild(download);
download.click();
download.remove();
setTimeout(() => URL.revokeObjectURL(url), 60000);
```

3. Abrir o arquivo baixado e conferir a marca no topo direito. Após reiniciar o BE com as alterações, esperar prefixo localizado, brasão e Dashboards SP, sem link, em todas as páginas.
4. Repetir com paper_size letter e, se disponível, dashboard com múltiplas páginas. parameters vazio usa os defaults do dashboard; preencher parâmetros explicitamente se necessário para o cenário.

Alternativa em uma REPL **já conectada ao BE em execução**, sem iniciar um segundo processo sobre o mesmo H2:

```clojure
(require '[metabase.channel.render.pdf :as pdf])
;; dashboard-id, user-id, parâmetros, arquivo de saída, papel
(pdf/render-dashboard-to-pdf-file 1 1 [] "/tmp/dashboard-1-backend.pdf" :a4)
```

Ajustar também o ID do usuário na alternativa REPL. Ambas as opções executam consultas com as permissões desse usuário; não enviam mensagens nem criam assinatura recorrente.

### B. Corpo de e-mail e PDF anexo com captura local

O repositório já define MailDev em dev/docker-compose.yml: SMTP 1025 e interface web 1080, publicados somente em 127.0.0.1.

1. Com Docker disponível, na raiz do projeto iniciar **somente** esse serviço:

```bash
docker compose -f dev/docker-compose.yml --profile pulse up -d maildev
```

2. Abrir `http://localhost:1080` para confirmar a interface de captura.
3. Na aplicação local → Admin → Configurações → E-mail → Configurar SMTP: host localhost, porta 1025, segurança Nenhuma/None, sem autenticação; definir um remetente de teste. Isso considera o BE executado diretamente no host/WSL, como no fluxo atual. BE dentro de container exige hostname/rede adequados; localhost dentro dele não aponta ao host.
4. Usar o teste de SMTP se desejar confirmar a conexão. Esse teste envia uma mensagem de texto simples, **não** o template de assinatura: ele não comprova o corpo de e-mail que estamos avaliando.
5. Abrir o dashboard → Assinaturas → E-mail, escolher um destinatário de teste e ligar **Anexar um PDF do dashboard**. Não ativar Somente anexos se a intenção é ver também o corpo HTML. Opções podem variar pela tradução; o controle no código é Attach a PDF of the dashboard.
6. Clicar **Enviar e-mail agora**. O MailDev recebe a mensagem; abrir sua visualização HTML e conferir o prefixo localizado, brasão e Dashboards SP, sem link na assinatura. Abrir também o PDF anexo e comparar com o item A.
7. Para comparar sem anexos, desligar a opção PDF e enviar outro teste. Não é necessário salvar um agendamento recorrente apenas para usar o envio de teste.

O PDF anexo reutiliza o renderer backend. O corpo HTML é separado: dashboard_subscription.hbs; alertas de pergunta usam notification_card.hbs. O MailDev valida o conteúdo capturado, não a entrega/renderização em todos os provedores de e-mail reais. Encerrar somente o serviço de captura quando terminar, se não for mais utilizado:

```bash
docker compose -f dev/docker-compose.yml --profile pulse stop maildev
```

### C. Mensagem do Slack e PDF anexo

É possível enviar a partir do BE local, mas ver a mensagem real exige workspace/canal de teste e integração Slack válidos. Não foi encontrado um equivalente offline ao MailDev para reproduzir a interface real do Slack nesta tarefa.

1. Usar a configuração local em Admin → Configurações → Slack e um workspace de teste; garantir que o app tenha acesso ao canal de destino.
2. Dashboard → Assinaturas → Slack → escolher o canal de teste.
3. Primeiro deixar **Enviar dashboard como PDF** desligado e clicar **Enviar para Slack agora**. Conferir a mensagem com os blocos/gráficos e o texto de marca. A disponibilidade do trecho de marca depende do gate whitelabel atual.
4. Ligar **Enviar dashboard como PDF** e enviar outro teste. Esse controle grava include_pdf; baixar o PDF recebido e comparar com A. A opção depende da permissão de download dos cards.
5. Registrar separadamente mensagem e arquivo. No fluxo PDF, o código usa mensagem de arquivo/caption em vez de todos os blocos de imagens; não exigir layout idêntico entre os dois modos.

Para esse envio de saída não é necessário tornar localhost público apenas para que o backend chame a API do Slack; callbacks/eventos do app são uma integração separada. Sem workspace/token/canal, é possível inspecionar código/payload em testes, mas o smoke de envio e visualização real deve permanecer pendente.

### D. Prévia técnica sem envio, disponível no modo dev

Com a mesma sessão autenticada, há GET `/dev/preview/preview-dashboard/1` e `/dev/preview/preview-card/ID`. Eles mostram o conteúdo renderizado para canais, mas **não** o envelope HTML completo de e-mail, o PDF backend ou a mensagem real do Slack. Não utilizá-los como substitutos dos itens A/B/C.

Todos esses comandos são um roteiro para execução pelo usuário; o agente não iniciou containers, não configurou integrações e não enviou mensagens nesta rodada.
