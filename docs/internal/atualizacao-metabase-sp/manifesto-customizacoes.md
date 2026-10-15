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

Listas **versionadas** (fonte de verdade do script):

- [`lists/restore-ours.txt`](./lists/restore-ours.txt)
- [`lists/dual-changed.txt`](./lists/dual-changed.txt)
- [`lists/behavior-manual.txt`](./lists/behavior-manual.txt)

Runbook: [runbook-atualizacao.md](./runbook-atualizacao.md) · Script: `bin/merge-upstream-preserve-sp.sh`

Espelho abaixo (mantido para leitura rápida; preferir os `.txt` ao editar):

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
| Diff completo vs `upstream/release-x.60.x`                                                                                        | **Feito** (EDD-1361)                  | Remote `upstream` + deepen; ~183 paths EDD no three-dot diff                                |
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

## Conflitos reais da EDD-1355 (entrada EDD-1362 / 1356 v2)

Registrado após a PoC 60→61→62→63. Detalhe narrativo: [notas-etapa-62-63.md](./notas-etapa-62-63.md).

### O que o script ainda não automatiza bem (1356 v2)

- Detecção/restauração de arquivos **stuck** e **órfãos** após `restore`.
- Exclusão explícita de paths curated no restore stuck (evitar sobrescrever login/tema SP).
- Sinalização de arquivos **híbridos** (API de uma major + body de outra).

### O que a 1362 deve isolar primeiro (tema/marca)

| Prioridade | Tema | Motivo |
| ---------- | ---- | ------ |
| Alta | Tokens SP ↔ tokens 63 (`background_page-*`, `core-*`, accents) | Maior atrito em dual-changed a cada major |
| Alta | `DEFAULT_ACCENT_COLORS` + `SP_PALETTE_COLORS` (charts / Visualizer) | Regressão fácil se o picker voltar a `getAccentColors()` |
| Média | Login / AuthLayout / DS de form | Perdido em restore stuck na 63 |
| Média | SpLogo hide (`layout.module.css`) vs LogoIcon brasão | Dois conceitos distintos; ambos dual-changed |
| Baixa / behavior | Datagrid, eixos 969, cascata, home badges | Continuar em `behavior-manual` até API estabilizar |

Métrica alvo da 1362: reduzir contagem de paths **Adapter** ligados a tema/marca vs. a tabela de Resumo acima; registrar antes/depois aqui.

### Status EDD-1362: **concluída**

Objetivo desta leva (cliente único SP, baratear updates) atendido. Resumo: [edd-1362.md](./edd-1362.md) · PDF: [edd-1362-metricas.pdf](./edd-1362-metricas.pdf).

**Adiado / multi-cliente:** renomear `--mb-color-sp-*` (e correlatos) no CSS/JS do core para tokens semânticos do Metabase. Valores já estão no `sp-theme`; a troca de nomes só ganha prioridade com outros clientes/temas ou se o smoke exigir menos `dual-changed` de CSS.

### Linha de base EDD-1362 (antes)

Medido na `EDD-1362` @ `ffc1bd9f565` contra `upstream/release-x.63.x` (7387f79).

| Métrica | Antes | Depois |
| ------- | ----- | ------ |
| `dual-changed.txt` — paths (FE / total) | 37 / 41 | 47 / 52 |
| `sp-extra.txt` — código FE ainda não classificado | 20 | 0 |
| Arquivos core fora de `ui/colors/` usando tokens SP (`--mb-color-sp-*`, `spColors`, `SP_PALETTE_COLORS`) | 18 (30 refs) | 18 (30 refs) — Passo 4 só classificou |
| Linhas com hex/rgba adicionadas em `ui/colors/` fora de arquivos SP-owned (`sp-colors.ts` / `sp-theme.ts`) | 94 | 0 |
| Chaves `sp-*` em `color-keys.ts` (core) | 28 | 0 (`SpColorKey`) |
| `behavior-manual.txt` — paths | 40 | 45 |
| Diff `light.ts`+`dark.ts`+`groups.ts`+`color-keys.ts` vs upstream (linhas) | ~650 | 7 (2+2+0+3) |

**Passo 2 — módulo de tema SP** (`ui/colors/constants/sp-theme.ts` + `ui/colors/types/sp-color-keys.ts`, ambos `restore-ours`):

- `light.ts` / `dark.ts` = upstream 63 + 2 linhas (import + `...SP_*_THEME_COLORS`); `color-keys.ts` = upstream + 3 linhas (`| SpColorKey`); `accent-colors.ts` = 22 linhas; `theme-from-color-scheme.ts` voltou ao upstream (saiu de `dual-changed`).
- Hex/rgba adicionados em `ui/colors/` fora de arquivos SP: 94 → 3 (restavam em `groups.ts`; ver Passo 3). Chaves `sp-*` no `color-keys.ts` core: 28 → 0.
- Validação: tema derivado (`deriveFullMetabaseTheme`) claro idêntico; no escuro, `icon-*` voltaram ao valor 63 (eram resíduo da 60) e entraram 14 tokens `sp-*` que faltavam. Accents e `SP_PALETTE_COLORS` idênticos. `color-keys.d.css` igual + `--mb-color-sp-gray-medium` (já usado, não declarado).
- Removidos por não terem efeito: `core-brand`/`core-filter`/`core-summarize` (o `deriveFullMetabaseTheme` sobrescreve) e `background-highlight/hover/selected` via `--mb-color-brand` (equivalente a `core-brand`).
- Testes: `charts.unit.spec.ts` e `groups.unit.spec.ts` falham igual antes e depois (3 casos esperam as cores do Metabase).

**Passo 3 — `groups.ts` volta ao upstream:**

- A reescrita SP (fallbacks via `LIGHT_THEME_ACCENT_COLORS` / `ACCENT_COLOR_NAMES_MAP`, ~111 linhas) era workaround antigo. Com accents SP já em `sp-theme` → `accent-colors` → tema derivado, `color("accentN")` resolve hex SP corretamente.
- Arquivo restaurado ao upstream 63 (0 linhas de diff). Saiu de `dual-changed` (FE 34 → 33; total 39 → 38). Hex fora de arquivos SP em `ui/colors/`: 3 → 0.
- Dump de `getMain/Light/DarkAccentColors` e `getAccentColors` idêntico antes/depois. `verify` limpo. Mesmas 3 falhas de teste (expectam paleta Metabase).

**Passo 4 — classificar os 20 FE de `sp-extra.txt`:**

| Destino | Qtd | Paths / motivo |
| ------- | --- | -------------- |
| `dual-changed` | 14 | Login/AuthLayout/LoginForm (EDD-577); Button/FormField; DashCard/ChartWithLegend/LegendCaption/series (EDD-792); NestedSettingSeries\* + siblings ColorPicker (SP_PALETTE); HomeXrayCard.tsx (junto do `.styled`); SettingsLdapForm (`t\`\``) |
| `behavior-manual` | 6 | `axis.ts` (EDD-969, junto de CartesianChart/BoxPlot/utils); LastEditInfoLabel + QuestionDataSource + SavedQuestionLeftSide/hooks (endurecimento crash pós-63) |
| `restore-ours` | 0 | Nenhum (todos existem no upstream com patch SP) |

`sp-extra` fica só com infra/marca/`locales/metabase.po` + globs. Dual sobe 38→52 porque esses adapters **já existiam** e estavam fora das 3 listas; não é drift novo. `verify` limpo.

Como medir de novo: `git diff upstream/release-x.63.x -- <path>` nas linhas `+`, contando `#hex`/`rgba(` e `sp-*`/`spColors`/`SP_PALETTE`; e `rg -l 'mb-color-sp-|"sp-[a-z]|spColors|SP_PALETTE' frontend/src enterprise/frontend/src` excluindo `ui/colors/`.

Achados do levantamento:

- **Entradas obsoletas em `dual-changed.txt`:** sem diff vs upstream: `Dockerfile` (raiz), `bun.lock`, `deps.edn`, `AutomaticDashboardApp.tsx`. Inexistente: `NewItemButton.styled.tsx`. Removidas da lista (41 → 36).
- **Customização SP perdida:** `NewItemButton.styled.tsx` (EDD-578: texto/ícone `sp-white`, peso 600) foi removido no upstream; o botão "Novo" voltou ao estilo padrão. Reaplicar no componente atual se o smoke confirmar.
- **Doc SP perdida:** `frontend/src/metabase/data-grid/docs/datagrid-custom-features.md` (EDD-944) foi apagada em `bbf8960726e` (restore 61). Recuperada de `saopaulo-pre-61x` e movida de `behavior-manual` para `restore-ours` (arquivo só SP).
- **AGPL (`MB_SOURCE_CODE_URL`) mal classificado:** `config/core.clj` e `version/settings.clj` estavam em `restore-ours`, mas são arquivos upstream com patch SP. O `settings.clj` carregava linhas antigas (`:encryption :when-encryption-key-set` no `site-uuid-for-version-info-fetching`, `log/error` da 60). O log AGPL do startup em `core/core.clj` (commit `69bd2c88f2e`) tinha sido perdido. Os três foram refeitos como upstream 63 + patch SP e movidos para `dual-changed`.
- **`.github/` e `.gitignore`:** alinhados ao upstream 63 (20 desatualizados, 9 órfãos, 2 híbridos; nenhum commit SP neles). O `.gitignore` mantém só a linha SP `.merge-sp/` e entrou em `dual-changed`. Com isso o `verify` passou a fechar limpo (`stale=0 orphan=0 hybrid=0`).
- `groups.ts` — **resolvido no Passo 3**: restaurado ao upstream; saiu de `dual-changed`.

### Pendências `tsc` (fora do escopo de tema da EDD-1362)

O build de produção **não** roda `tsc --noEmit`. Medido na `EDD-1362` após Scalar + `triggerEvent`: **7 erros** (eram 15). **Não bloqueiam o fechamento da 1362.** Tratar na revisita da **EDD-1356** (pós-merge da 1362): corrigir os 7 e incluir `tsc` no `build-check`.

| # | Arquivo | Erro | Impacto | Status |
| - | ------- | ---- | ------- | ------ |
| 1–4 | `visualizations/shared/components/RowChart/RowChart.unit.spec.tsx` | `userEvent` sem import (EDD-969) | Specs quebram | pendente |
| 5 | `visualizations/visualizations/TreemapChart/TreemapGroupsPicker.tsx` | passa `isSortable` ao `ChartSettingSeriesOrder` SP, que não tem a prop da 63 | Reordenar grupos no Treemap pode falhar | pendente |
| 6 | `query_builder/.../HeaderBreadcrumbs/HeaderBreadcrumbs.tsx` | `false \| null \| undefined` onde espera `DataSourcePart` | Só tipo; smoke visual OK | pendente |
| 7 | `home/components/HomeModelCard/HomeModelCard.tsx` | importa `IconName` de `metabase/ui` (na 63 é `iconNames`) | Só tipo | pendente |
| — | `Scalar.tsx` + spec | `t` sem import + `never[]` no mock | Card número sem linhas → `ReferenceError` | **feito** (`c11eed5`) |
| — | `echarts/cartesian/option/axis.ts` | `triggerEvent` + formatter | Sem efeito em runtime; tipagem ECharts 6.1 | **feito** (`c9d0340`) |

Como revalidar: com BE/FE parados, `NODE_OPTIONS=--max-old-space-size=5120 bunx tsc --noEmit` e conferir `grep -c 'error TS'`.

---

## Como atualizar este manifesto

- Após configurar `upstream` e rodar o diff 60.x, acrescentar paths faltantes e reclassificar.
- Após EDD-1355, registrar conflitos reais encontrados (entrada da EDD-1362) — **seed acima**.
- Após EDD-1362, atualizar contagens de `dual-changed` (métrica antes/depois) — **feito**; issue concluída (ver acima).
