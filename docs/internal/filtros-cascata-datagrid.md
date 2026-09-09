# Análise: filtros em cascata na DataGrid / Query Builder

Como os filtros se comportam hoje no Metabase ao selecionar um valor — em especial se as opções dos demais filtros (ex.: filtros de coluna) se atualizam conforme a pré-seleção — e se essa atualização em cascata é viável.

**Público:** time de produto/engenharia.  
**Escopo:** DataGrid, filtros do Query Builder, drill “Filter by this column” e Linked Filters de dashboard.

---

## Resposta direta

No **Query Builder** e no drill de coluna da tabela, os filtros são **independentes**: escolher um valor no filtro A **não** restringe as opções do filtro B.

Cascata de opções (Estado → só cidades daquele estado) **já existe** em **dashboards**, via **Linked Filters**.

Trazer o mesmo comportamento para o editor de perguntas / filtros de coluna exigiria **trabalho novo** no frontend (e, se for o caso, wiring adicional no backend). A infra de `chain-filter` do dashboard pode ser reaproveitada em parte.

---

## O DataGrid não tem filtros próprios

`frontend/src/metabase/data-grid/` é só apresentação (virtualização, sort, pin, resize). A tabela (`TableInteractive`) usa esse grid e aplica filtros via:

- **query** do Query Builder / Filter Panel;
- **drill** “Filter by this column”;
- **parâmetros** de dashboard.

Não há dropdown de filtro por coluna no header no estilo Excel.

---

## Comportamento hoje

| Contexto | Cascata nas opções do dropdown? | Comportamento |
| --- | --- | --- |
| Query Builder / Filter Panel | **Não** | Cada dropdown carrega valores do campo de forma independente |
| Drill “Filter by this column” | **Não** | Mesmo `FilterPicker` do QB; fetch independente |
| Parâmetros de pergunta (card) | **Não** | Sem linked filters |
| Dashboard **com** Linked Filters | **Sim** | Opções do filho respeitam o(s) pai(s) configurados |
| Dashboard **sem** Linked Filters | **Não** | Independentes |

Importante distinguir:

- O **resultado da pergunta** (linhas da tabela) **é** filtrado quando o filtro é aplicado.
- O que **não** atualiza no QB é a **lista de valores** dos outros dropdowns — ela continua vindo do campo inteiro (cache / search), sem os outros filtros ativos.

---

## Como os valores do dropdown são buscados

### Query Builder / FilterPicker (independente)

Fluxo:

`FilterPicker` → `FilterValuePicker` → `FieldValuePicker` → RTK Query

Endpoints:

- `GET /api/field/:id/values` — lista cacheada
- `GET /api/field/:id/search/:searchFieldId?value=...` — busca
- `GET /api/field/:id/remapping/:remappedFieldId` — remap

Arquivos-chave:

- `frontend/src/metabase/querying/filters/components/FilterPicker/FilterValuePicker/FilterValuePicker.tsx`
- `frontend/src/metabase/querying/common/components/FieldValuePicker/FieldValuePicker.tsx`
- `frontend/src/metabase/api/field.ts`
- `src/metabase/warehouse_schema_rest/api/field.clj`

`useGetFieldValuesQuery(fieldId)` envia **apenas** o ID do campo — **não** envia outros filtros da query.

### Dashboard Linked Filters (cascata)

Fluxo:

1. `parameter.filteringParameters` define os pais.
2. `getFilteringParameterValuesMap()` monta `{ parentId: value }`.
3. `fetchDashboardParameterValues` inclui isso na request.
4. Backend `chain-filter` restringe valores via FKs / mesma tabela.

Endpoints:

- `GET /api/dashboard/:id/params/:param-key/values?...`
- `GET /api/dashboard/:id/params/:param-key/search/:query?...`
- `GET /api/dashboard/params/valid-filter-fields` — quais campos podem se vincular
- `POST /api/dataset/parameter/values` — edição (sem constraints de linked filter)

Arquivos-chave:

- `frontend/src/metabase/parameters/actions.ts`
- `frontend/src/metabase/parameters/utils/dashboards.ts` (`getFilteringParameterValuesMap`)
- `frontend/src/metabase/parameters/components/ParameterLinkedFilters/ParameterLinkedFilters.tsx`
- `frontend/src/metabase/parameters/components/widgets/ParameterFieldWidget/FieldValuesWidget/FieldValuesWidget.tsx`
- `src/metabase/parameters/chain_filter.clj`
- `src/metabase/parameters/dashboard.clj`
- `src/metabase/dashboards_rest/api.clj`

Documentação de produto: [Linked filters](../dashboards/linked-filters.md).

### Parâmetros de card

`GET /api/card/:id/params/:param-key/values` — **sem** constraints de outros parâmetros (`card-param-values` em `src/metabase/queries/card.clj`).

---

## Filtros “de coluna” na tabela

Não há filtro no header da coluna. O caminho atual é o drill **“Filter by this column”** (`column-filter-drill.tsx`), que abre o mesmo `FilterPickerBody` do Query Builder e usa o mesmo fetch independente de field values.

---

## Cascata é possível no QB / DataGrid?

**Sim, em termos de produto/engenharia**, mas **não** está implementada hoje nesses contextos.

| Contexto | Cascata hoje? | Caminho |
| --- | --- | --- |
| Dashboard com Linked Filters | Sim | Já funciona |
| Query Builder / Filter Panel | Não | Feature nova |
| Drill “Filter by this column” | Não | Feature nova (mesmo picker) |
| DataGrid em si | N/A | Sem filtros próprios |

Reaproveitamento possível:

- Backend: lógica de `chain-filter` (já usada em dashboards).
- Frontend: passar filtros já aplicados como constraints ao buscar valores, em vez de só `GET /api/field/:id/values`.

Limitações já documentadas nos Linked Filters (e que provavelmente se aplicariam a uma cascata no QB se reutilizar a mesma base):

- depende de relacionamento no **metadata da tabela** (mesma tabela ou FK);
- não “enxerga” joins/filtros de models/questions da mesma forma;
- não funciona com custom columns / algumas fontes de valores customizadas.

---

## Conclusão prática

1. Hoje, filtros do **QB / coluna na tabela** são **independentes** — outro filtro não altera as opções disponíveis no dropdown.
2. Cascata **já existe** só em **dashboard Linked Filters**, via `filteringParameters` + `chain-filter`.
3. Cascata no Filter Panel / drills **não** está implementada; é viável, mas exige desenvolvimento — idealmente reaproveitando a infra de chain-filter.

Se a necessidade for só em dashboard, use **Linked Filters**. Se for no editor de perguntas ou nos filtros disparados pela tabela, trate como feature nova.
