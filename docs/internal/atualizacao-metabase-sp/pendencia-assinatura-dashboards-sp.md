# Tarefa posterior — assinatura Dashboards SP em incorporação e exportações

**Estado:** registrada, implementação pendente para depois do smoke atual.  
**Solicitação:** usuário durante TS-12, em 14/11/2026.  
**Branch atual:** saopaulov64.  
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

Esses pontos orientam o levantamento futuro e não representam inventário exaustivo. A marca de desenvolvimento de static-viz (`hasDevWatermark`) é um mecanismo distinto da assinatura Made with/Powered by; avaliar pela finalidade antes de alterar assets de watermark.

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
