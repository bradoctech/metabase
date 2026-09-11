# Análise: filtros em cascata na DataGrid / Query Builder

Como os filtros se comportam no Metabase ao selecionar um valor — em especial se as opções dos demais filtros (ex.: filtros de coluna) se atualizam conforme a pré-seleção — e o suporte a cascata no Query Builder.

**Público:** time de produto/engenharia.  
**Escopo:** DataGrid, filtros do Query Builder, drill “Filter by this column” e Linked Filters de dashboard.

---

## Resposta direta

No **Query Builder**, no **Filter Panel** e no drill **“Filter by this column”**, os value pickers **fazem cascata**: ao escolher um valor no filtro A, as opções do filtro B são restringidas pelos filtros irmãos já aplicados no mesmo stage (mesma base de `chain-filter` dos Linked Filters de dashboard).

Cascata de opções em **dashboards** continua via **Linked Filters** (configuração explícita de pais/filhos).

---

## O DataGrid não tem filtros próprios

`frontend/src/metabase/data-grid/` é só apresentação (virtualização, sort, pin, resize). A tabela (`TableInteractive`) usa esse grid e aplica filtros via:

- **query** do Query Builder / Filter Panel;
- **drill** “Filter by this column”;
- **parâmetros** de dashboard.

Não há dropdown de filtro por coluna no header no estilo Excel.

---

## Comportamento

| Contexto | Cascata nas opções do dropdown? | Comportamento |
| --- | --- | --- |
| Query Builder / Filter Panel | **Sim** | Sibling filters do mesmo stage viram constraints em `POST /api/field/:id/filtered-values` |
| Drill “Filter by this column” | **Sim** | Mesmo `FilterValuePicker` / `FilterPickerBody` |
| Parâmetros de pergunta (card) | **Não** | Sem linked filters |
| Dashboard **com** Linked Filters | **Sim** | Opções do filho respeitam o(s) pai(s) configurados |
| Dashboard **sem** Linked Filters | **Não** | Independentes |

Importante distinguir:

- O **resultado da pergunta** (linhas da tabela) sempre é filtrado quando o filtro é aplicado.
- A **lista de valores** dos dropdowns no QB agora também respeita filtros irmãos (string / number / boolean com valores), via chain-filter.

---

## Como os valores do dropdown são buscados

### Query Builder / FilterPicker (com cascata)

Fluxo:

`FilterPicker` → `FilterValuePicker` → `getChainFilterConstraints` → `FieldValuePicker` → RTK Query

- Sem filtros irmãos: `GET /api/field/:id/values` e `GET /api/field/:id/search/:searchFieldId` (comportamento anterior).
- Com filtros irmãos: `POST /api/field/:id/filtered-values` com `constraints` (e `query` opcional para busca).

Arquivos-chave:

- `frontend/src/metabase/querying/filters/utils/chain-filter-constraints.ts`
- `frontend/src/metabase/querying/filters/components/FilterPicker/FilterValuePicker/FilterValuePicker.tsx`
- `frontend/src/metabase/api/field.ts` (`getFilteredFieldValues`)
- `src/metabase/warehouse_schema_rest/api/field.clj` (`POST /:id/filtered-values`)
- `src/metabase/parameters/chain_filter.clj`

Constraints são montadas a partir de `Lib.filters` no mesmo `stageIndex`, excluindo o campo alvo. Operadores sem valor (`is-empty`, `is-null`, …) e filtros de data/coordenada ainda não entram na conversão (v1).

### Dashboard Linked Filters

Fluxo:

1. `parameter.filteringParameters` define os pais.
2. `getFilteringParameterValuesMap()` monta `{ parentId: value }`.
3. `fetchDashboardParameterValues` inclui isso na request.
4. Backend `chain-filter` restringe valores via FKs / mesma tabela.

Documentação de produto: [Linked filters](../dashboards/linked-filters.md).

---

## Limitações (paridade com Linked Filters)

A cascata do QB reutiliza `chain-filter`, então herda as mesmas limitações de metadata:

- depende de relacionamento no **metadata da tabela** (mesma tabela ou FK);
- não “enxerga” joins/filtros de models/questions da mesma forma que a query;
- não funciona com custom columns sem `fieldId`;
- filtros de data relativa/excluída, time e coordinate ainda não viram constraints no FE (v1).

---

## Conclusão prática

1. Filtros do **QB / Filter Panel / drill de coluna** passam a cascatear opções via `filtered-values` + `chain-filter`.
2. Cascata em **dashboard** continua sendo **Linked Filters**.
3. Evoluções futuras possíveis: cobrir mais tipos de filtro no conversor FE, ou um endpoint “query-context values” se o produto precisar refletir joins/stages/models na lista.
