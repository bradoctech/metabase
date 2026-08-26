# Viabilidade: dashboard “Abono de Permanência” no Metabase

Análise do que o Metabase já cobre nativamente e do que precisaria ser implementado para aproximar os modelos solicitados (card composto de evolução e dashboard de quatro colunas).

**Público:** time de produto/engenharia que vai adaptar o mockup ao Metabase.  
**Escopo:** um dashboard por objeto validado (exemplo: Abono de Permanência), com título, filtro de período e quatro colunas na mesma linha.

---

## Resposta direta

A **estrutura** do dashboard (título, filtro de período, quatro colunas, clique para detalhar) dá para montar com recursos nativos.

O mockup trata cada coluna como um **widget composto**: vários tipos de gráfico, ícones e layout interno no mesmo card. No Metabase, um card é **uma question** e **um tipo de visualização**. A adaptação realista é:

- layout nativo + **várias questions por coluna**;
- implementação nova só onde o visual do mockup for obrigatório.

Não existe plugin público para registrar um chart custom sem alterar o código. Dá para criar visualizações novas no frontend deste repositório, pelo mesmo caminho do Combo e do Scatter (`registerVisualization`).

---

## O que o mockup pede

### Cabeçalho

- Título do objeto à esquerda (exemplo: **Abono de Permanência**).
- Seletor de período na mesma barra (mês/ano até mês/ano).
- O check de “aplicar” do mockup **não entra**: o Metabase aplica o filtro no próprio select.

### Quatro colunas na mesma linha

1. **Evolução:** KPIs em texto (valor total, média mensal, valor por beneficiário) + gráfico linha (R$ milhões) empilhado sobre barras (pessoas, mil), eixo X mensal compartilhado.
2. **Comparação e Top 3:** dois boxes (Analisado vs Divergências, este com fundo vermelho) + três mini barras (por motivo, órgão, mês).
3. **Análise de divergências:** scatter/bolhas com quadrantes, labels nas bolhas, clique na bolha abre o detalhe.
4. **Detalhe do órgão (Seduc):** lista hierárquica expansível (divergência financeira, pessoal afetado, média mensal) com tabelas internas e drill.

### Card composto isolado (primeiro print)

Um único card com lista de KPIs no topo e, abaixo, o bloco **EVOLUÇÃO** (linha + barras sincronizadas). Esse modelo **não** existe como um único tipo de question.

---

## Como o Metabase organiza cards

| Conceito | Comportamento nativo |
| --- | --- |
| Question / card | Um tipo de visualização (`combo`, `scalar`, `scatter`, `bar`, `pivot`, etc.) |
| Dashboard | Grade de **24 colunas** (`GRID_WIDTH`). Quatro colunas iguais = largura **6** cada |
| Largura | **Fixed width** (padrão) ou **Full width** (melhor para este layout denso) |
| Tipos de card no dashboard | Questions, heading, text (Markdown), link, iframe |
| Filtros | Dashboard inteiro, **heading** da aba, ou card individual |
| Várias séries | Na mesma question (várias métricas) ou sobrepondo questions no mesmo card do dashboard, se compartilharem a dimensão (tempo) |

Documentação relacionada:

- [Introduction to dashboards](../dashboards/introduction.md)
- [Dashboard filters](../dashboards/filters.md)
- [Charts with multiple series](../dashboards/multiple-series.md)
- [Combo charts](../questions/visualizations/combo-chart.md)
- [Dashboard interactivity](../dashboards/interactive.md)

---

## Nativo vs implementar

Legenda: **Nativo** = dá para usar hoje; **Parcial** = cobre o dado, não o visual; **Implementar** = exige código novo.

### Cabeçalho e layout

| Pedido | Status | Como fazer / o que falta |
| --- | --- | --- |
| Quatro blocos na mesma linha | **Nativo** | Grade 24 colunas; **Full width** |
| Título do objeto | **Nativo** | Heading card |
| Filtro de período (mês a mês) | **Nativo** | Date picker no **heading** (não no dashboard inteiro, se o filtro for só desta aba) |
| Aplicar com botão check | **Não usar** | O Metabase aplica no select |
| Título + date range no mesmo controle visual do print | **Parcial** | Heading + widget à direita. Não fica “colado” como no mockup |
| Uma moldura única por coluna envolvendo vários gráficos | **Implementar** | Nativo empilha cards soltos, cada um com a própria borda |

**Implementar?** Não vale um componente só para o chrome do cabeçalho. O Date picker nativo cobre o comportamento.

### Coluna 1 — Evolução (KPIs + linha + barras)

| Pedido | Status | Como fazer / o que falta |
| --- | --- | --- |
| Linha (R$) + barras (pessoas) no mesmo eixo X | **Nativo** | Visualização **Combo**. Por série: line, bar ou area |
| Linha em cima, barras embaixo | **Nativo** | **Stack series** (`graph.split_panels`) |
| Escalas diferentes (milhões vs milhares) | **Nativo** | Split y-axis se as séries estiverem sobrepostas; painéis separados já isolam a escala |
| Labels nos pontos e nas barras | **Nativo** | **Show values on data points** |
| Duas ou mais métricas + agrupamento temporal | **Nativo** | 2+ métricas e 1–2 agrupamentos, ou 1 métrica e 2 agrupamentos |
| Três KPIs (total, média, por beneficiário) | **Parcial** | Três cards **Number** (`scalar`) ou **Trend** (`smartscalar`). Sem layout “label à esquerda / valor à direita” numa lista |
| KPIs + gráfico no **mesmo** card | **Implementar** | Uma question = um tipo de viz |
| Ícones `$` / pessoa no eixo | **Implementar** | Só texto de eixo |
| Ícone olho nos pontos | **Implementar** | Sem anotações custom em pontos |

**Combo no código:** `frontend/src/metabase/visualizations/visualizations/ComboChart/`.  
**Stack series:** setting `graph.split_panels` em `frontend/src/metabase/visualizations/lib/settings/graph.ts`.

Seção nativa próxima: **KPIs with large chart below** em [dashboard sections](../dashboards/introduction.md#dashboard-sections) — KPIs e gráfico são cards separados, não um único widget.

### Coluna 2 — Analisado vs Divergências + Top 3

| Pedido | Status | Como fazer / o que falta |
| --- | --- | --- |
| Métricas Analisado vs Divergências | **Parcial** | Vários cards **Number** / **Trend** |
| Cor condicional do número | **Nativo** | Number: aba **Conditional colors** |
| Fundo vermelho do box inteiro | **Implementar** | Condicional pinta o número, não o card |
| R$ + pessoas + % no mesmo box | **Implementar** | Um Number = um valor |
| Ícones nos KPIs | **Implementar** | |
| Título “Top 3 divergências” | **Nativo** | Heading ou text card |
| Ícones de ação (home, calendário, user, tag) | **Parcial** | Link cards ou click behavior; não há barra de ícones no header do card |
| Três mini barras lado a lado | **Nativo** | Três questions **Bar** (top 3 por motivo / órgão / mês) |

### Coluna 3 — Scatter / bolhas com quadrantes

| Pedido | Status | Como fazer / o que falta |
| --- | --- | --- |
| Scatter / bubble (X, Y, tamanho) | **Nativo** | **Scatter** + bubble size |
| Cor por categoria (órgão) | **Nativo** | Breakout |
| Clique na bolha → detalhe na coluna 4 | **Nativo** | **Click behavior** → **Update a dashboard filter** (órgão) ligado aos cards da coluna 4 |
| Uma linha de meta no Y | **Parcial** | Goal line; não desenha a cruz dos quatro quadrantes |
| Quadrantes (linhas tracejadas em X e Y) | **Implementar** | Sem `markLine` em ambos os eixos |
| Labels nas bolhas (“Seduc”) | **Implementar** | Tooltip e legenda; sem rótulo no ponto |

Esta é a coluna que **mais se aproxima** do mockup só com nativo, se o time aceitar tooltip no lugar do label e sem quadrantes desenhados.

**Scatter no código:** `frontend/src/metabase/visualizations/visualizations/ScatterPlot/`.  
Docs: [Scatterplots and bubble charts](../questions/visualizations/scatterplot-or-bubble-chart.md).

### Coluna 4 — Detalhe hierárquico do órgão

| Pedido | Status | Como fazer / o que falta |
| --- | --- | --- |
| Título dinâmico (Secretaria da Educação) | **Nativo** | Heading com variável `{{orgao}}` ligada ao filtro |
| Breakdown com subtotais | **Nativo** | **Pivot table** (query builder): grupos, subtotais, expand/collapse |
| Tabelas (categoria, R$, %) | **Nativo** | Table ou Pivot |
| Lista de cargos + contagens | **Nativo** | Table ou **Row** chart |
| Linha “divergência média mensal” | **Nativo** | Number |
| Drill para outro dashboard / question | **Nativo** | Click behavior ou drill-through |
| Accordion com % e valor no header da seção | **Implementar** | Pivot expande grupos; não replica o visual de seções do mockup |

**List view** (`list`) serve para explorar **registros** de um model, não para este breakdown analítico. Ver [Model list view](../data-modeling/models.md#model-list-view).

Pivot: [Pivot tables](../questions/visualizations/pivot-table.md).

---

## Montagem nativa sugerida (espelho funcional)

```
[ Heading: Abono de Permanência ]     [ Date picker no heading ]
[ 3× Number + 1× Combo (stack)  ]     [ 4–6× Number + 3× Bar   ]
[ 1× Scatter / Bubble           ]     [ Heading {{orgao}} + Pivot / Tables ]
```

Interação: clique na bolha **Seduc** → atualiza filtro de órgão → coluna 4 recalcula. Isso já existe e é o equivalente nativo do “detalhamento ao clicar”.

Sobrepor questions no mesmo card do dashboard só ajuda quando as séries compartilham o eixo de tempo (evolução). Não resolve KPIs + gráfico, nem boxes + mini barras, nem scatter + accordion.

---

## O que está além do nativo (lista fechada)

1. Vários tipos de gráfico **no mesmo card** (KPI + combo; dois boxes + três bars).
2. Chrome visual: moldura única da coluna, fundo vermelho do bloco, ícones de unidade/ação, olho nos pontos.
3. Quadrantes + labels em bolhas.
4. Accordion analítico com métricas no header da seção.
5. Filtro de período no pixel do mockup (dois dropdowns + calendário + check na mesma barra do título).

Os `PLUGIN_*` do produto são para features EE (SSO, embedding SDK, etc.). **Não** há hook para registrar um chart de dashboard sem mudar o código.

---

## Dá para implementar componentes novos?

Sim. O registro de visualizações é de primeira classe neste repositório. Não é um plugin externo: é código no frontend.

### Caminho padrão (igual Combo, Scatter, Pivot)

1. Novo identificador em `cardDisplayTypes` — `frontend/src/metabase-types/api/visualization.ts`.
2. Componente React com `VisualizationDefinition`: `identifier`, `getUiName`, `isSensible`, `checkRenderable`, `settings`, tamanhos min/default.
3. `registerVisualization(...)` em `frontend/src/metabase/visualizations/register.js`.
4. Settings no painel de viz (mesmo padrão de `graph.split_panels`).
5. Se houver **subscriptions / export PNG / static viz**, espelhar em `frontend/src/metabase/static-viz/`. Sem isso, e-mail/Slack saem quebrados ou sem o chart.
6. Testes (Jest + E2E), i18n com `ttag`, e tamanhos em `metabase/visualizations/shared/utils/sizes`.

O novo tipo entra no query builder, no dashboard, no visualizer e no embedding, como qualquer chart nativo.

### Três níveis de customização

| Nível | O que é | Esforço | Quando usar |
| --- | --- | --- | --- |
| **A. Só nativo** | Heading + filtro + grade de 4 colunas + várias questions | Baixo | Entregar o dado rápido; aceitar visual Metabase |
| **B. Novos viz no core** | 1–3 displays novos (scatter com quadrantes; KPI+combo; comparison panel; accordion) | Médio a alto | Reuso em vários dashboards / objetos |
| **C. Iframe / app ao lado** | Card iframe com app React próprio; filtros via `{{variáveis}}` no `src` | Médio, paralelo ao core | Pixel-perfect de um relatório, sem carregar o produto |

Iframe: [Iframe cards](../dashboards/introduction.md#iframe-cards). O host precisa estar em `allowed-iframe-hosts`.

### Candidatos a viz novos (se o time for para o nível B)

| Componente | Coluna | Esforço | Valor |
| --- | --- | --- | --- |
| Scatter com `markLine` nos dois eixos + label no ponto | 3 | Baixo a médio | Alto: o modelo de dados já existe |
| `kpi-combo` (lista de métricas + Combo com split panels) | 1 | Médio a alto | Alto só se for template de vários objetos |
| `comparison-panel` (dois boxes + métricas + cor de fundo) | 2 | Médio | Médio |
| `mini-multi-bar` (três top-N no mesmo card) | 2 | Baixo a médio | Baixo: três Bar nativos já resolvem |
| `breakdown-accordion` | 4 | Médio a alto | Médio: Pivot já entrega o dado |

---

## Recomendação

1. **Começar no nível A:** heading + date filter, quatro colunas, Combo com **Stack series**, Numbers, Bars, Scatter, Pivot/Tables, click behavior da bolha para o filtro de órgão.
2. **Customizar só a coluna 3** (quadrantes + labels) se o gráfico de divergências for o centro da análise — melhor custo/benefício.
3. **Viz compostos nas colunas 1, 2 e 4** só se este layout for **template** para muitos objetos (Abono, Licença, etc.), não um dashboard único.
4. **Não implementar** o check do filtro nem ícones decorativos nos eixos, a menos que o pixel-perfect seja requisito contratual. Aí o caminho é nível B (viz novos) ou C (iframe).

---

## Protótipo nativo (dados mock)

Há um seed pronto para apresentar no Metabase local, só com recursos nativos:

- Pasta: [`docs/internal/abono-demo/`](abono-demo/README.md)
- Script: `python3 docs/internal/abono-demo/seed_abono_demo.py --email ... --password ...`

## Referências no código

| Tema | Caminho |
| --- | --- |
| Largura da grade | `frontend/src/metabase/lib/dashboard_grid.js` (`GRID_WIDTH = 24`) |
| Tipos de display | `frontend/src/metabase-types/api/visualization.ts` |
| Registro de viz | `frontend/src/metabase/visualizations/register.js` |
| API de viz | `frontend/src/metabase/visualizations/index.ts` (`registerVisualization`) |
| Combo | `frontend/src/metabase/visualizations/visualizations/ComboChart/` |
| Scatter | `frontend/src/metabase/visualizations/visualizations/ScatterPlot/` |
| Number | `frontend/src/metabase/visualizations/visualizations/Scalar/` |
| Trend | `frontend/src/metabase/visualizations/visualizations/SmartScalar/` |
| Pivot | `frontend/src/metabase/visualizations/visualizations/PivotTable/` |
| Heading / iframe | `.../Heading/`, `.../IFrameViz/` |
| Stack series / split y-axis | `frontend/src/metabase/visualizations/lib/settings/graph.ts` |
| Seções de dashboard | `frontend/src/metabase/dashboard/sections.ts` |
| Static viz (PNG / subscriptions) | `frontend/src/metabase/static-viz/` |
