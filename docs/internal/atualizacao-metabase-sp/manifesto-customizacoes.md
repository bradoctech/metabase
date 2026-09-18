# Manifesto de customizações SP

**Issue:** EDD-1361  
**Branch:** `EDD-1361`  
**Base do fork:** `saopaulo` / Metabase **0.60.x**  
**Gerado para:** alimentar EDD-1355, EDD-1356 e EDD-1362

---

## Resumo

| Bucket       | Qtd. de paths |
| ------------ | ------------: |
| **SP-owned** |            21 |
| **Adapter**  |           124 |
| **Behavior** |            40 |
| **Total**    |           185 |

| Risco no merge | Qtd. |
| -------------- | ---: |
| baixo          |   21 |
| médio          |   43 |
| alto           |  121 |

### Método

1. Commits `feat[EDD-…]` em `HEAD` (map path → EDD).
2. Cruzamento com listas `default_dual_changed` / `default_restore_ours` do script legado `bin/merge-upstream-61-preserve-sp.sh` (branch `origin/update_with_upstream_61`).
3. Heurística de bucket (arquivo SP-named, docs internas, datagrid/eixos, i18n, estilo em core).
4. Paths que não existem mais no tree foram omitidos.

### Pendência resolvida: diff vs `upstream/release-x.60.x`

**Causa do erro `no merge base`:** o clone local é _shallow_ e o primeiro `git fetch upstream release-x.60.x` trouxe só o tip da branch, sem histórico compartilhado com o fork.

**Correção aplicada:**

```bash
git fetch --deepen=2000 upstream release-x.60.x
```

Depois disso, o merge-base existe e o diff funciona:

```bash
git diff --name-only upstream/release-x.60.x...HEAD
```

**Resultado (EDD-1361):** ~836 paths no three-dot diff; **~183** cruzam com commits `feat[EDD-…]` (alinhado a este manifesto). Os demais (~650) são sobretudo ruído do sync 0.60 / docs / CI / deps — **não** são customizações SP faltando no inventário por EDD.

Paths `feat[EDD]` ausentes do diff (irrelevantes ou já removidos): rascunhos antigos renomeados; `lib/colors/.../sp-colors.ts` (não existe no tree); um CSS de footer possivelmente movido.

**Manter o remote:** `upstream` → `https://github.com/metabase/metabase.git` (somente leitura). Para a EDD-1355: `git fetch upstream release-x.63.x`.

---

## Índice por EDD de origem

| EDD      | Resumo                                              | Paths neste manifesto |
| -------- | --------------------------------------------------- | --------------------: |
| EDD-564  | Login/UI align + highlight em tabelas               |                     6 |
| EDD-565  | Filtros do QB restritos pelos filtros já aplicados  |                    10 |
| EDD-577  | Ajustes visuais / DS                                |                    15 |
| EDD-578  | Ajustes visuais / DS                                |                    15 |
| EDD-579  | Home badges, Rawline, tabs, datagrid padding, cores |                    31 |
| EDD-580  | Pathname/img + ajustes pós-v0.60                    |                    11 |
| EDD-791  | Header de painéis / ocultar logo                    |                    17 |
| EDD-792  | Cards de dashboard conforme DS + datagrid           |                    13 |
| EDD-793  | Paleta de cores DS SP                               |                     6 |
| EDD-944  | Datagrid: pin de colunas + destaque de linha        |                    11 |
| EDD-969  | TitleCase / truncate em eixos e tooltips            |                     6 |
| EDD-999  | Tratamento de valores null                          |                     4 |
| EDD-1092 | SP_PALETTE_COLORS em mais charts                    |                     6 |
| EDD-1110 | Aba Detalhamentos (demo Abono)                      |                     5 |
| EDD-1240 | Traduções pt-BR / strings da view user              |                    39 |
| EDD-1243 | Abono permanência — mock, estrutura e docs          |                     6 |
| EDD-1361 | Inventário e isolamento mínimo (esta issue)         |                     5 |

---

## Paths críticos

### Tema / cores / fonte

| Path                                                         | EDDs                                            | Bucket                                                           | Risco |
| ------------------------------------------------------------ | ----------------------------------------------- | ---------------------------------------------------------------- | ----- |
| `frontend/src/metabase/ui/colors/constants/sp-colors.ts`     | EDD-577,EDD-791,EDD-793                         | SP-owned                                                         | baixo |
| `frontend/src/metabase/ui/colors/constants/themes/light.ts`  | EDD-564,EDD-577,EDD-578,EDD-579,EDD-791,EDD-793 | Adapter                                                          | alto  |
| `frontend/src/metabase/ui/colors/constants/themes/dark.ts`   | —                                               | (presente no tree / script; fora do mapa feat ou sem commit EDD) | —     |
| `frontend/src/metabase/ui/colors/constants/accent-colors.ts` | EDD-793                                         | Adapter                                                          | alto  |
| `frontend/src/metabase/ui/colors/groups.ts`                  | EDD-793                                         | Adapter                                                          | alto  |
| `frontend/src/metabase/ui/colors/types/color-keys.ts`        | EDD-577,EDD-578,EDD-793                         | Adapter                                                          | alto  |
| `frontend/src/metabase/ui/colors/theme-from-color-scheme.ts` | —                                               | (presente no tree / script; fora do mapa feat ou sem commit EDD) | —     |
| `frontend/src/metabase/css/core/fonts.saopaulo.styled.ts`    | (sem feat[EDD] direto — presente no tree)       | SP-owned                                                         | baixo |

### Assets de marca

| Path                                                       | Bucket   | Risco |
| ---------------------------------------------------------- | -------- | ----- |
| `resources/frontend_client/app/assets/img/logo-sp-gov.png` | SP-owned | baixo |
| `resources/frontend_client/app/assets/img/logo-sp-gov.svg` | SP-owned | baixo |
| `resources/frontend_client/app/assets/img/logo-sp.svg`     | SP-owned | baixo |

### i18n

| Path                                    | EDDs                     | Bucket            | Risco |
| --------------------------------------- | ------------------------ | ----------------- | ----- |
| `locales/pt-BR.po`                      | EDD-578,EDD-792,EDD-1240 | Adapter           | médio |
| Demais arquivos tocados só por EDD-1240 | EDD-1240                 | Adapter (strings) | médio |

_Total de paths com EDD-1240 neste manifesto: 39_

### Behavior (amostra crítica)

| Path                                                                                     | EDDs            | Risco | Nota                                           |
| ---------------------------------------------------------------------------------------- | --------------- | ----- | ---------------------------------------------- |
| `frontend/src/metabase-types/api/field.ts`                                               | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/api/field.ts`                                                     | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGrid/DataGrid.module.css`                | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGrid/DataGrid.tsx`                       | EDD-792,EDD-944 | alto  | feature comportamental                         |
| `frontend/src/metabase/data-grid/components/DataGridHeader/DataGridHeader.tsx`           | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGridRow/DataGridRow.tsx`                 | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/Footer/Footer.module.css`                    | EDD-792         | alto  | datagrid custom                                |
| `frontend/src/metabase/data-grid/components/SortableHeader/SortableHeader.tsx`           | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/constants.ts`                                           | EDD-579,EDD-792 | alto  | datagrid custom                                |
| `frontend/src/metabase/data-grid/docs/datagrid-custom-features.md`                       | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/hooks/use-column-pinning-by-count.ts`                   | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/hooks/use-data-grid-instance.tsx`                       | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/types.ts`                                               | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/home/components/HomePopularSection/HomePopularSection.module.css` | EDD-578         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomePopularSection/HomePopularSection.tsx`        | EDD-579         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomeRecentSection/HomeRecentSection.module.css`   | EDD-578         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomeRecentSection/HomeRecentSection.tsx`          | EDD-579         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/visualizations/echarts/cartesian/option/utils.ts`                 | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/shared/components/RowChart/RowChart.unit.spec.tsx` | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/shared/components/RowChartView/RowChartView.tsx`   | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/test/__support__/server-mocks/field.ts`                                        | EDD-565         | alto  | EDD(s) de comportamento                        |

_Total Behavior: 40 paths (lista completa abaixo)._

---

## Listas para o processo EDD-1356

Sugestão inicial alinhada ao script 61 + este inventário:

### Candidatos a `restore-ours` (SP-owned)

```
docs/internal/abono-demo/README.md
docs/internal/abono-demo/build_sqlite.py
docs/internal/abono-demo/dash_10_backup_20260821_083836.json
docs/internal/abono-demo/seed_abono_demo.py
docs/internal/abono-demo/seed_detalhamentos_tab.py
docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md
docs/internal/atualizacao-metabase-sp/README.md
docs/internal/atualizacao-metabase-sp/estrategia-sequencia.md
docs/internal/atualizacao-metabase-sp/issue-edd-1361.md
docs/internal/atualizacao-metabase-sp/issue-edd-1362.md
docs/internal/filtros-cascata-datagrid.md
docs/internal/proposta-aba-detalhamentos-por-situacao.html
docs/internal/proposta-aba-detalhamentos-por-situacao.md
docs/internal/proposta-aba-detalhamentos-por-situacao.pdf
docs/internal/viabilidade-dashboard-abono-permanencia.md
docs/internal/viabilidade-dashboard-abono-permanencia.pdf
frontend/src/metabase/css/core/fonts.saopaulo.styled.ts
frontend/src/metabase/ui/colors/constants/sp-colors.ts
resources/frontend_client/app/assets/img/logo-sp-gov.png
resources/frontend_client/app/assets/img/logo-sp-gov.svg
resources/frontend_client/app/assets/img/logo-sp.svg
```

### Candidatos a `dual-changed` (Adapter de alto risco / wiring de tema)

Priorizar no merge 3-way (além da lista do script 61):

```
frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.module.css
frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.tsx
frontend/src/metabase/home/components/HomeCaption/HomeCaption.styled.tsx
frontend/src/metabase/home/components/HomeContent/HomeContent.tsx
frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.module.css
frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.tsx
frontend/src/metabase/home/components/HomeHelpCard/HomeHelpCard.tsx
frontend/src/metabase/home/components/HomeLayout/HomeLayout.tsx
frontend/src/metabase/home/components/HomeModelCard/HomeModelCard.styled.tsx
frontend/src/metabase/home/components/HomeModelCard/HomeModelCard.tsx
frontend/src/metabase/home/components/HomeXrayCard/HomeXrayCard.styled.tsx
frontend/src/metabase/home/components/HomeXraySection/HomeXraySection.styled.tsx
frontend/src/metabase/nav/components/NewItemButton/NewItemButton.styled.tsx
frontend/src/metabase/nav/components/search/SearchButton/SearchButton.module.css
frontend/src/metabase/nav/containers/MainNavbar/SidebarItems/SidebarItems.styled.tsx
frontend/src/metabase/public/components/EmbedFrame/EmbedFrame.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/ViewTitleHeader.module.css
frontend/src/metabase/query_builder/components/view/ViewHeader/components/AdHocQuestionLeftSide/AdHocQuestionLeftSide.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/components/HeaderBreadcrumbs/HeaderBreadcrumbs.module.css
frontend/src/metabase/query_builder/components/view/ViewHeader/components/HeaderBreadcrumbs/HeaderBreadcrumbs.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/components/QuestionDataSource/utils.tsx
frontend/src/metabase/query_builder/components/view/ViewHeader/components/SavedQuestionLeftSide/SavedQuestionLeftSide.tsx
frontend/src/metabase/ui/colors/constants/accent-colors.ts
frontend/src/metabase/ui/colors/constants/themes/light.ts
frontend/src/metabase/ui/colors/groups.ts
frontend/src/metabase/ui/colors/types/color-keys.ts
frontend/src/metabase/visualizations/components/settings/ChartSettingColorPicker/ChartSettingColorPicker.tsx
frontend/src/metabase/visualizations/components/settings/ChartSettingSegmentsEditor/ChartSettingSegmentsEditor.tsx
frontend/src/metabase/visualizations/components/settings/ChartSettingSeriesOrder.tsx
frontend/src/metabase/visualizations/components/settings/ChartSettingsTableFormatting/constants.ts
```

---

## Quick wins (EDD-1361)

| Item                                                                                                                              | Decisão                               | Justificativa                                                                               |
| --------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------- | ------------------------------------------------------------------------------------------- |
| Trocar hex SP duplicados em `light.ts` por referências `spColors.*` onde o token já existe (`#FF161F`, `sp-red`, `sp-gray`, etc.) | **Aplicar**                           | Baixo risco; não muda valores; encolhe drift de tokens                                      |
| Centralizar `"Rawline"` (~18 arquivos) num único default/setting                                                                  | **Adiar** → EDD-1362                  | Muitos call sites em viz/static-viz; melhor com validação visual e ponto de injeção de tema |
| Diff completo vs `upstream/release-x.60.x`                                                                                        | **Adiar** (pré-requisito operacional) | Remote `upstream` ausente; fetch pontual não concluiu                                       |
| Refatorar home/dashboard/datagrid para overlays                                                                                   | **Adiar** → EDD-1362 / fora de escopo | Escopo explícito da 1361                                                                    |
| Remover hex de medals/upsell (`copper`, `gold`, `upsell-gem`)                                                                     | **Adiar**                             | Não são tokens SP; risco de regressão sem ganho de isolamento SP                            |
| Hex próximos mas não idênticos (`#F2F2F2` vs `bgSecondary` `#F1F1F1`, `#E2E2E2` border card)                                      | **Adiar**                             | Exigem validação visual (servidor local)                                                    |

---

## Inventário completo por bucket

### SP-owned (21)

| Path                                                            | EDDs                                      | Risco | Nota                              |
| --------------------------------------------------------------- | ----------------------------------------- | ----- | --------------------------------- |
| `docs/internal/abono-demo/README.md`                            | EDD-1110,EDD-1243                         | baixo | docs internas / demos             |
| `docs/internal/abono-demo/build_sqlite.py`                      | EDD-1243                                  | baixo | docs internas / demos             |
| `docs/internal/abono-demo/dash_10_backup_20260821_083836.json`  | EDD-1243                                  | baixo | docs internas / demos             |
| `docs/internal/abono-demo/seed_abono_demo.py`                   | EDD-1243                                  | baixo | docs internas / demos             |
| `docs/internal/abono-demo/seed_detalhamentos_tab.py`            | EDD-1110                                  | baixo | docs internas / demos             |
| `docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md`    | EDD-1361                                  | baixo | docs internas / demos             |
| `docs/internal/atualizacao-metabase-sp/README.md`               | EDD-1361                                  | baixo | docs internas / demos             |
| `docs/internal/atualizacao-metabase-sp/estrategia-sequencia.md` | EDD-1361                                  | baixo | docs internas / demos             |
| `docs/internal/atualizacao-metabase-sp/issue-edd-1361.md`       | EDD-1361                                  | baixo | docs internas / demos             |
| `docs/internal/atualizacao-metabase-sp/issue-edd-1362.md`       | EDD-1361                                  | baixo | docs internas / demos             |
| `docs/internal/filtros-cascata-datagrid.md`                     | EDD-565                                   | baixo | docs internas / demos             |
| `docs/internal/proposta-aba-detalhamentos-por-situacao.html`    | EDD-1110                                  | baixo | docs internas / demos             |
| `docs/internal/proposta-aba-detalhamentos-por-situacao.md`      | EDD-1110                                  | baixo | docs internas / demos             |
| `docs/internal/proposta-aba-detalhamentos-por-situacao.pdf`     | EDD-1110                                  | baixo | docs internas / demos             |
| `docs/internal/viabilidade-dashboard-abono-permanencia.md`      | EDD-1243                                  | baixo | docs internas / demos             |
| `docs/internal/viabilidade-dashboard-abono-permanencia.pdf`     | EDD-1243                                  | baixo | docs internas / demos             |
| `frontend/src/metabase/css/core/fonts.saopaulo.styled.ts`       | (sem feat[EDD] direto — presente no tree) | baixo | arquivo SP-named / asset de marca |
| `frontend/src/metabase/ui/colors/constants/sp-colors.ts`        | EDD-577,EDD-791,EDD-793                   | baixo | arquivo SP-named / asset de marca |
| `resources/frontend_client/app/assets/img/logo-sp-gov.png`      | EDD-791                                   | baixo | arquivo SP-named / asset de marca |
| `resources/frontend_client/app/assets/img/logo-sp-gov.svg`      | EDD-791                                   | baixo | arquivo SP-named / asset de marca |
| `resources/frontend_client/app/assets/img/logo-sp.svg`          | (sem feat[EDD] direto — presente no tree) | baixo | arquivo SP-named / asset de marca |

### Adapter (124)

| Path                                                                                                                              | EDDs                                            | Risco | Nota                                        |
| --------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------- | ----- | ------------------------------------------- |
| `.husky/pre-commit`                                                                                                               | EDD-580                                         | médio | classificação inicial — revisar             |
| `bun.lock`                                                                                                                        | EDD-580                                         | médio | infra/build — dual-changed no script 61     |
| `frontend/src/metabase-types/api/mocks/settings.ts`                                                                               | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/admin/datamodel/components/FormLabel/FormLabel.styled.tsx`                                                 | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/admin/performance/components/ModelPersistenceConfiguration.tsx`                                            | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/permissions/components/PermissionsPageLayout/PermissionsPageLayout.tsx`                              | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/settings/auth/components/AuthCard/AuthCard.tsx`                                                      | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/settings/components/Email/BaseSMTPConnectionForm.tsx`                                                | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/settings/components/SettingsLdapForm.tsx`                                                            | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/settings/components/widgets/GroupMappingsWidget/GroupMappingsWidgetView.tsx`                         | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/settings/slack/SlackConfiguration.tsx`                                                               | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/admin/tools/components/LogLevelsModal/LogLevelsModal.tsx`                                                  | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/archive/components/ArchivedEntityBanner/ArchivedEntityBanner.tsx`                                          | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/auth/components/AuthButton/AuthButton.styled.tsx`                                                          | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/auth/components/AuthLayout/AuthLayout.styled.tsx`                                                          | EDD-564,EDD-577,EDD-580                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/auth/components/AuthLayout/AuthLayout.tsx`                                                                 | EDD-580                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/auth/components/Login/Login.tsx`                                                                           | EDD-577                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/auth/components/LoginForm/LoginForm.tsx`                                                                   | EDD-577                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/common/components/CronExpressioInput/CronExpressionInput.tsx`                                              | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/common/components/OnboardingStepper/OnboardingStepperStep.tsx`                                             | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/common/components/TabButton/TabButton.styled.tsx`                                                          | EDD-579                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/common/components/tree/TreeNode.styled.tsx`                                                                | EDD-578                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/css/admin.module.css`                                                                                      | EDD-564,EDD-944                                 | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/css/components/buttons.module.css`                                                                         | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/css/core/colors.module.css`                                                                                | EDD-564                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/css/core/inputs.module.css`                                                                                | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/css/core/layout.module.css`                                                                                | EDD-791                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/dashboard/components/ClickMappings/utils.ts`                                                               | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/dashboard/components/DashCard/DashCard.module.css`                                                         | EDD-792                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/dashboard/components/DashCard/DashCard.tsx`                                                                | EDD-792                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.module.css`                                       | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/dashboard/components/DashboardHeader/DashboardHeaderView.tsx`                                              | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/dashboard/containers/AutomaticDashboardApp/AutomaticDashboardApp.module.css`                               | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/dashboard/containers/AutomaticDashboardApp/AutomaticDashboardApp.tsx`                                      | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/databases/components/DatabaseConnectionUri/DatabaseConnectionStringField.tsx`                              | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/embedding/embedding-iframe-sdk-setup/components/SdkIframeEmbedSetupModal.tsx`                              | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/embedding/embedding-iframe-sdk/components/SdkIframeError.tsx`                                              | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/forms/components/FormField/FormField.tsx`                                                                  | EDD-577                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/home/components/CustomHomePageModal/CustomHomePageModal.tsx`                                               | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/home/components/EmbedHomepage/EmbedJsContent.tsx`                                                          | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/home/components/EmbedHomepage/StaticEmbedContent.tsx`                                                      | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/home/components/HomeCaption/HomeCaption.styled.tsx`                                                        | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeContent/HomeContent.tsx`                                                               | EDD-578,EDD-580                                 | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.module.css`                                                      | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeGreeting/HomeGreeting.tsx`                                                             | EDD-578,EDD-580                                 | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeHelpCard/HomeHelpCard.tsx`                                                             | EDD-564                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeLayout/HomeLayout.tsx`                                                                 | EDD-580                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/home/components/HomeModelCard/HomeModelCard.styled.tsx`                                                    | EDD-578,EDD-580                                 | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeModelCard/HomeModelCard.tsx`                                                           | EDD-580                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/home/components/HomeXrayCard/HomeXrayCard.styled.tsx`                                                      | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/HomeXraySection/HomeXraySection.styled.tsx`                                                | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/home/components/Onboarding/Onboarding.tsx`                                                                 | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/list-view/components/ListView/ListViewConfiguration.tsx`                                                   | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/metabot/components/MetabotManagedProviderLimit.tsx`                                                        | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/metabot/state/actions.ts`                                                                                  | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/nav/components/NewItemButton/NewItemButton.styled.tsx`                                                     | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/nav/components/search/SearchButton/SearchButton.module.css`                                                | EDD-564                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/nav/components/search/SearchButton/SearchButton.tsx`                                                       | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/nav/containers/MainNavbar/SidebarItems/SidebarItems.styled.tsx`                                            | EDD-578                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/notifications/PulsesListSidebar.tsx`                                                                       | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/palette/components/PaletteResults.tsx`                                                                     | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/parameters/components/ParameterValueWidget.module.css`                                                     | EDD-791                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/public/components/EmbedFrame/EmbedFrame.tsx`                                                               | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/query_builder/components/DataSelector/saved-entity-picker/SavedEntityPicker.jsx`                           | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/query_builder/components/template_tags/TagEditorHelp/TagEditorHelp.tsx`                                    | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/ViewTitleHeader.module.css`                                       | EDD-579,EDD-791                                 | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/AdHocQuestionLeftSide/AdHocQuestionLeftSide.tsx`       | EDD-579,EDD-791                                 | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/HeaderBreadcrumbs/HeaderBreadcrumbs.module.css`        | EDD-791                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/HeaderBreadcrumbs/HeaderBreadcrumbs.tsx`               | EDD-791                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/QuestionDataSource/utils.tsx`                          | EDD-791                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/SavedQuestionLeftSide/SavedQuestionLeftSide.tsx`       | EDD-791                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/query_builder/components/view/ViewHeader/components/ViewTitleHeaderRightSide/ViewTitleHeaderRightSide.tsx` | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/querying/components/DataReference/DatabasePane.tsx`                                                        | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/querying/components/QueryVisualization/QueryVisualization.jsx`                                             | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/questions/components/CopyCardForm/CopyCardForm.tsx`                                                        | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/rich_text_editing/tiptap/extensions/shared/NativeQueryModal.tsx`                                           | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/search/components/filters/NativeQueryFilter/NativeQueryLabel.tsx`                                          | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/static-viz/components/FunnelChart/utils/funnel.ts`                                                         | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/Gauge/Gauge.tsx`                                                                     | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/Gauge/GaugeContainer.tsx`                                                            | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/Legend/Legend.tsx`                                                                   | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/Legend/utils.ts`                                                                     | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/RowChart/RowChart.tsx`                                                               | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/RowChart/theme.ts`                                                                   | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/components/Text/Text.tsx`                                                                       | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/static-viz/lib/rendering-context.ts`                                                                       | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/styled-components/selectors.ts`                                                                            | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/transforms/components/JobEditor/ScheduleSection/ScheduleSection.unit.spec.tsx`                             | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/ui/colors/constants/accent-colors.ts`                                                                      | EDD-793                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/ui/colors/constants/themes/light.ts`                                                                       | EDD-564,EDD-577,EDD-578,EDD-579,EDD-791,EDD-793 | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/ui/colors/groups.ts`                                                                                       | EDD-793                                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/ui/colors/types/color-keys.ts`                                                                             | EDD-577,EDD-578,EDD-793                         | alto  | dual-changed no script 61 (tema/UI wiring)  |
| `frontend/src/metabase/ui/components/buttons/Button/Button.module.css`                                                            | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/ui/components/inputs/Checkbox/Checkbox.config.ts`                                                          | EDD-577                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/ui/components/inputs/Checkbox/Checkbox.module.css`                                                         | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/ui/components/inputs/Input/Input.module.css`                                                               | EDD-577                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/ui/components/navigation/Tabs/Tab.module.css`                                                              | EDD-579                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/visualizations/components/ChartWithLegend.tsx`                                                             | EDD-792                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/ScalarValue/ScalarValue.tsx`                                                     | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/ScalarValue/utils.ts`                                                            | EDD-580                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/Visualization/Visualization.styled.tsx`                                          | EDD-792                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/visualizations/components/Visualization/Visualization.tsx`                                                 | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/visualizations/components/legend/LegendCaption/LegendCaption.styled.tsx`                                   | EDD-792                                         | alto  | estilo em arquivo upstream                  |
| `frontend/src/metabase/visualizations/components/settings/ChartNestedSettingSeriesMultiple.jsx`                                   | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/settings/ChartNestedSettingSeriesSingle.tsx`                                     | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/settings/ChartSettingColorPicker/ChartSettingColorPicker.tsx`                    | EDD-793                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/settings/ChartSettingSegmentsEditor/ChartSettingSegmentsEditor.tsx`              | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/settings/ChartSettingSeriesOrder.tsx`                                            | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/components/settings/ChartSettingsTableFormatting/constants.ts`                              | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/echarts/cartesian/option/axis.ts`                                                           | EDD-792,EDD-969                                 | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/echarts/cartesian/option/series.ts`                                                         | EDD-792                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/lib/exports-branding-utils.tsx`                                                             | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/lib/save-dashboard-pdf.ts`                                                                  | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/shared/components/RowChart/utils/layout.ts`                                                 | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/visualizations/CartesianChart/padding.ts`                                                   | EDD-792                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/visualizations/Map/Map.jsx`                                                                 | EDD-1092                                        | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/visualizations/Progress/Progress.tsx`                                                       | EDD-792                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/visualizations/RowChart/utils/theme.ts`                                                     | EDD-579                                         | alto  | customização visual em core                 |
| `frontend/src/metabase/visualizations/visualizations/SmartScalar/compute.ts`                                                      | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `frontend/src/metabase/visualizer/components/DataImporter/ColumnsList/ColumnsList.tsx`                                            | EDD-1240                                        | médio | strings/traduções em componentes (EDD-1240) |
| `locales/metabase.po`                                                                                                             | EDD-1240                                        | médio | i18n — merge de .po                         |
| `locales/pt-BR.po`                                                                                                                | EDD-578,EDD-792,EDD-1240                        | médio | i18n — merge de .po                         |
| `package.json`                                                                                                                    | EDD-580                                         | médio | lockfile/deps                               |
| `test/metabase/channel/render/png_test.clj`                                                                                       | EDD-579                                         | médio | classificação inicial — revisar             |

### Behavior (40)

| Path                                                                                                               | EDDs            | Risco | Nota                                           |
| ------------------------------------------------------------------------------------------------------------------ | --------------- | ----- | ---------------------------------------------- |
| `frontend/src/metabase-types/api/field.ts`                                                                         | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/api/field.ts`                                                                               | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/common/components/AdminContentTable/AdminContentTable.tsx`                                  | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGrid/DataGrid.module.css`                                          | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGrid/DataGrid.tsx`                                                 | EDD-792,EDD-944 | alto  | feature comportamental                         |
| `frontend/src/metabase/data-grid/components/DataGridHeader/DataGridHeader.tsx`                                     | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/DataGridRow/DataGridRow.tsx`                                           | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/components/Footer/Footer.module.css`                                              | EDD-792         | alto  | datagrid custom                                |
| `frontend/src/metabase/data-grid/components/SortableHeader/SortableHeader.tsx`                                     | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/constants.ts`                                                                     | EDD-579,EDD-792 | alto  | datagrid custom                                |
| `frontend/src/metabase/data-grid/docs/datagrid-custom-features.md`                                                 | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/hooks/use-column-pinning-by-count.ts`                                             | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/hooks/use-data-grid-instance.tsx`                                                 | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/data-grid/types.ts`                                                                         | EDD-944         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/home/components/HomePopularSection/HomePopularSection.module.css`                           | EDD-578         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomePopularSection/HomePopularSection.tsx`                                  | EDD-579         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomeRecentSection/HomeRecentSection.module.css`                             | EDD-578         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/components/HomeRecentSection/HomeRecentSection.tsx`                                    | EDD-579         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/home/utils.ts`                                                                              | EDD-579         | alto  | badges/home dinâmicos (comportamento + estilo) |
| `frontend/src/metabase/querying/filters/components/FilterPicker/FilterValuePicker/FilterValuePicker.tsx`           | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/querying/filters/components/FilterPicker/FilterValuePicker/FilterValuePicker.unit.spec.tsx` | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/querying/filters/utils/chain-filter-constraints.ts`                                         | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/querying/filters/utils/chain-filter-constraints.unit.spec.ts`                               | EDD-565         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/components/TableInteractive/TableInteractive.tsx`                            | EDD-999         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/echarts/cartesian/option/utils.ts`                                           | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/shared/components/RowChart/RowChart.unit.spec.tsx`                           | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/shared/components/RowChartView/RowChartView.tsx`                             | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/visualizations/BoxPlot/BoxPlot.tsx`                                          | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/visualizations/CartesianChart/CartesianChart.tsx`                            | EDD-969         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/visualizations/Scalar/Scalar.tsx`                                            | EDD-999         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/visualizations/Scalar/Scalar.unit.spec.tsx`                                  | EDD-999         | alto  | EDD(s) de comportamento                        |
| `frontend/src/metabase/visualizations/visualizations/SmartScalar/SmartScalar.tsx`                                  | EDD-999         | alto  | EDD(s) de comportamento                        |
| `frontend/test/__support__/server-mocks/field.ts`                                                                  | EDD-565         | alto  | EDD(s) de comportamento                        |
| `src/metabase/appearance/settings.clj`                                                                             | EDD-579         | alto  | backend/enterprise — revisar                   |
| `src/metabase/channel/render/body.clj`                                                                             | EDD-579         | alto  | backend/enterprise — revisar                   |
| `src/metabase/channel/render/png.clj`                                                                              | EDD-579         | alto  | backend/enterprise — revisar                   |
| `src/metabase/channel/render/preview.clj`                                                                          | EDD-579         | alto  | backend/enterprise — revisar                   |
| `src/metabase/channel/render/style.clj`                                                                            | EDD-579         | alto  | backend/enterprise — revisar                   |
| `src/metabase/warehouse_schema_rest/api/field.clj`                                                                 | EDD-565         | alto  | EDD(s) de comportamento                        |
| `test/metabase/warehouse_schema_rest/api/field_test.clj`                                                           | EDD-565         | alto  | EDD(s) de comportamento                        |

---

## Como atualizar este manifesto

- Após configurar `upstream` e rodar o diff 60.x, acrescentar paths faltantes e reclassificar.
- Após EDD-1355, registrar conflitos reais encontrados (entrada da EDD-1362).
- Após EDD-1362, atualizar contagens de `dual-changed` (métrica antes/depois).
