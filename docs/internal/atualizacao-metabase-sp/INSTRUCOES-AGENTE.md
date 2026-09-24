# Instruções para o agente — atualização Metabase SP

**Como usar:** no início de uma nova conversa sobre EDD-1355, EDD-1356, EDD-1361, EDD-1362, tema SP ou upgrade do fork, peça ao agente para ler este arquivo (e, se precisar de detalhe, os outros `.md` desta pasta) antes de planejar ou editar código.

**Pasta:** `docs/internal/atualizacao-metabase-sp/`  
**Última consolidação de contexto:** etapa **62→63** da EDD-1355 na branch `EDD-1355`; login/boot OK, smoke detalhado rodado com **3 pendências abertas** (filtros cascata QB, paleta 1092 no Visualizer, datagrid via "ver registros" — ver [notas-etapa-62-63.md](./notas-etapa-62-63.md)); EDD-1361/1356 MVP já na base; notas anteriores em [notas-etapa-61-62.md](./notas-etapa-61-62.md) e [notas-etapa-60-61.md](./notas-etapa-60-61.md).

---

## Objetivo do trabalho

Atualizar o fork Metabase São Paulo / Trilhas para uma versão mais recente **preservando customizações SP**, e criar um processo **reproduzível / semi-automatizado** para próximos upgrades — sem depender de “baixar a release e recolocar tudo na mão”.

---

## Fatos já verificados no repositório

Trate isto como verdade até alguém atualizar este arquivo após nova verificação:

| Fato                     | Detalhe                                                                                                                                              |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Remote do fork           | `origin` → `git@github.com:bradoctech/metabase.git`                                                                                                  |
| Remote oficial           | `upstream` → `https://github.com/metabase/metabase.git` (fetch de releases; não é destino SP)                                                        |
| Branch principal do fork | `saopaulo` — ainda **0.60.x** até a EDD-1355 mergear de volta                                                                                        |
| Branch da PoC de upgrade | `EDD-1355` — tip com merge `upstream/release-x.63.x` + fixups; smoke detalhado com 3 pendências (ver [notas-etapa-62-63.md](./notas-etapa-62-63.md)) |
| Backup da etapa 60→61    | Tag `saopaulo-pre-61x`                                                                                                                               |
| Backup da etapa 61→62    | Tag `saopaulo-pre-62x`                                                                                                                               |
| Script de merge          | `bin/merge-upstream-preserve-sp.sh` (EDD-1356); **restore estreito** após lição da 61                                                                |
| Alvo final da EDD-1355   | Linha **63.x** (caminho em etapas 61→62→63; não pular para 63 com adapters 61 quebrados)                                                             |
| Customizações            | Commits `feat[EDD-…]` + listas em `lists/`; isolamento ainda parcial                                                                                 |

### Arquivos SP / críticos (amostra)

- Tokens: `frontend/src/metabase/ui/colors/constants/sp-colors.ts`
- Tema adapter: `frontend/src/metabase/ui/colors/constants/themes/light.ts` (e correlatos dark/accent)
- Fontes: `frontend/src/metabase/css/core/fonts.saopaulo.styled.ts`; `"Rawline"` hardcoded em vários viz/static-viz
- Assets: `resources/frontend_client/app/assets/img/logo.svg` (brasão / LogoIcon) e `logo-sp-gov.*` (SpLogo nos headers — oculto)
- i18n: `locales/pt-BR.po` (+ rebuild local `resources/frontend_client/app/locales/*.json` via `./bin/i18n/build-translation-resources` quando mudar `.po`)
- Behavior: datagrid (pin + hover), eixos (`toTitleCase` / `AXIS_LABEL_MAX_CHARS`), home badges/cards, filtros cascata QB (`chain-filter-constraints`), stubs de upsell, dashcards DS (EDD-792), paleta charts (EDD-1092)

### Logos São Paulo (dois conceitos distintos)

1. **LogoIcon / brasão (nav + login)** — `DefaultLogoIcon` em `frontend/src/metabase/common/components/LogoIcon/LogoIcon.tsx` deve carregar `app/assets/img/logo.svg` (Brasão do Estado de SP), **não** o SVG inline de pontos do Metabase. Na 60→61 o merge restaurou o logo upstream; sintoma: diamante de pontos no AppBar e no login. **Reaplicar o componente SP** (import `getSubpathSafeUrl` de `metabase/urls` na 61+). Arquivo em `lists/dual-changed.txt`.
2. **SpLogo / logo-gov no header de painéis** — [PR #64](https://github.com/bradoctech/metabase/pull/64) (`feat[EDD-791]`): o `<img logo-sp-gov>` **permanece** no JSX (`DashboardHeaderView`, etc.) com `className={CS.SpLogo}`; o ocultamento é **`display: none`** em `.SpLogo` em `layout.module.css`. Sintoma de regressão do hide: logo-gov **volta a aparecer** ao lado do título. `layout.module.css` está em `dual-changed.txt`.

- Assets `logo.svg` / `logo-sp-*` continuam SP-owned; ocultar SpLogo ≠ trocar o LogoIcon.
- **Não** confundir: “faltou o brasão no lugar do logo Metabase” → item 1; “apareceu de novo o logo-gov no header do dashboard” → item 2.

### Buckets acordados para classificar customizações

1. **SP-owned** — restaurar com `ours` no merge (tokens, assets, docs internas) — só o que está em `lists/restore-ours.txt` + padrões seguros do script.
2. **Adapter** — merge 3-way (tema wiring, home styled, headers, `.po`) — `lists/dual-changed.txt`.
3. **Behavior** — patch/feature (datagrid, title-case, badges, filtros cascata, upsells) — `lists/behavior-manual.txt`.

---

## Decisões de estratégia (não reabrir sem motivo)

1. **Não** usar como fluxo principal: baixar `v0.63.18` numa branch limpa e só diffar com `saopaulo`.
2. **Sim** usar: remote `upstream` + **merge** de `release-x.N.x` / tag, com restore assistido.
3. Diff útil para inventário SP: `upstream/release-x.60.x...saopaulo` (não `saopaulo` vs 63).
4. Isolar 100% das customizações como “config” **não é realista**; isolar tema/marca **sim** (parcial).
5. Refatoração **grande** de tema/marca **depois** do update (EDD-1362), não como gate do salto.
6. EDD-1355 é a **PoC** do processo da EDD-1356.
7. `update_with_upstream_61` está **desatualizada** vs `saopaulo` — não usar sozinha como base.
8. **Estabilizar smoke na major atual** antes da próxima etapa (não ir 62→63 com home/adapters quebrados).
9. Commits de merge grandes: hooks locais podem OOM/falhar em `cljfmt`/`token-scan`; `--no-verify` só em levas intermediárias de infra/restore stuck — **não** em ajustes com risco de lint. Insistir em hooks no PR final / etapa 63.

### Sequência oficial

```text
EDD-1361 (inventário + isolamento mínimo)     ✅
  → EDD-1356 MVP (script + runbook)           ✅ MVP
  → EDD-1355 (update = PoC)                   🔄 62→63 mergeado; smoke detalhado com pendências
  → EDD-1362 (tema/marca pós-update)
  → EDD-1356 v2 (endurecer com aprendizados)
```

Detalhe narrativo: [estrategia-sequencia.md](./estrategia-sequencia.md).  
Runbook de etapas: [runbook-atualizacao.md](./runbook-atualizacao.md).

---

## Issues

| ID           | Papel                                                      | Estado                                                                      |
| ------------ | ---------------------------------------------------------- | --------------------------------------------------------------------------- |
| **EDD-1355** | Atualizar Metabase + reaplicar customizações               | Em andamento — merge **63** feito; smoke detalhado com 3 pendências abertas |
| **EDD-1356** | Automatizar / semi-automatizar transporte de customizações | MVP entregue; v2 após lições da 1355                                        |
| **EDD-1361** | Inventário + quick wins de isolamento                      | Concluída (manifesto publicado)                                             |
| **EDD-1362** | Refatorar tema/marca na base já atualizada                 | Após 1355                                                                   |

---

## Lições das etapas 60→61 e 61→62 (obrigatório para o agente)

### Script / restore

- **`restore` não faz `git add -A`** — isso “resolvia” conflitos com marcadores ainda no arquivo.
- **Não restaurar todo path com drift `BASE…SP`.** Só `lists/restore-ours.txt` + assets/docs internos. Restore largo reverteu milhares de arquivos do upstream 61 para tip pré-61 e quebrou boot/FE.
- Conflitos unmerged **não-manuais** ainda podem preferir SP; revisar se o path é de fato customização.
- Em etapas seguintes na mesma branch: `SP_REF=HEAD` (não `origin/saopaulo` antigo).

### Clojure / backend (smoke)

- Sintomas típicos de restore errado: `typed?` privado (`honey_sql_2` vs `honeysql_guard`), `clojure.core.match` ausente (`custom_migrations` pré-61), settings sem `:encryption`, migration sem `public_uuid_prefix`, vars EE novas ausentes (ex. `semantic-search-vector-strategy` com `settings.clj` stuck pré-N).
- Remédio: trazer do `upstream/release-x.N.x` arquivos **não-curated** que ainda estão iguais ao tip pré-merge; varrer **`src/`**, **`test/`**, **`enterprise/`** e **`modules/`** — não só `src/`. **Preservar** curated (e reaplicar SP por cima quando for adapter/behavior).
- Migrations incompletas: restaurar YAMLs do upstream; H2 local de smoke pode precisar **reset** (`metabase.db.mv.db`) — isso **não** é o banco de produção SP.
- Settings SP (`version/settings.clj`, `config/core.clj`): manter getter AGPL (`mb-source-code-url`) e alinhar opções obrigatórias da major (ex. `:encryption :no`).

### Frontend / bun / CLJS

- Na 61, `metabase/lib/*` virou `metabase/utils/*` e `metabase/redux`. Arquivos pré-61 com imports `metabase/lib/...` quebram o Rspack.
- Após merge grande: restaurar FE não-curated do upstream; **não** apagar paths de `behavior-manual` / `dual-changed` só porque “não existem no upstream” (ex. `chain-filter-constraints`).
- Pares **tsx + styled** dual-changed devem casar (mesmo “lado”). Misturar TSX upstream + styled SP derruba a home (`CardTitlePrimary` / `XrayCardRoot`, etc.).
- `build-hot:js` **não** recompila CLJS. Precisa `bun run build:cljs` / `build-pure:cljs` (ou `build-hot` / `build-hot:js-wait`) quando módulos novos entram ou artefatos em `target/cljs_dev` ficam stale (ex. `analytics.impl.js`, `DEFAULT_CARD_SIZE_JSON`).
- **`package.json` stuck pré-N** com patches/lock da major nova: sintoma típico `patch-package` (Mantine/Rspack versão errada) + SWC plugin incompatível. Restaurar `package.json` + `bun.lock` + `patches/` do upstream da major alvo e `bun install` limpo.
- Na 62, órfãos pré-N (ex. `entities/tables.js`, `utils/formatting/ui.tsx`) quebram o bundle se o restore stuck trouxer só metade do rename. Remover o que o upstream apagou **fora** das listas curated.
- `bun.lock`: preferir o do upstream na major nova; regenerar com `bun install` se lock e `package.json` divergirem.
- Heap do Rspack: o script `build-hot:js` força `NODE_OPTIONS=--max-old-space-size=8192` no `rspack serve`. Um `NODE_OPTIONS=1024` externo **não** sobrescreve isso; `1024` direto no `bunx rspack serve` OOM. No WSL, `RSPACK_WORKER_THREADS=1` + heap ≥4–8 GB costuma ser o piso.

### Customizações que o merge “come” (reaplicar / smoke)

Voltam ao tip upstream com frequência — **priorizar no verify de cada major** (válido na 63):

| Área            | Paths-chave                                                               | Sintoma se perdeu                                                         |
| --------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| LogoIcon brasão | `common/components/LogoIcon/LogoIcon.tsx`                                 | Diamante Metabase no AppBar/login                                         |
| SpLogo hide     | `css/core/layout.module.css` (`.SpLogo`)                                  | logo-gov aparece no header do painel                                      |
| Login / DS      | `auth/components/AuthLayout/*`, `Login*`, `Button`/`Input`/`Checkbox` CSS | Layout login padrão Metabase                                              |
| Hover linha     | `DataGrid.module.css` **e** `css/admin.module.css`                        | Clique marca linha; hover não (admin CSS não carrega na view de pergunta) |
| Dashcards DS    | `DashCard.*`, `LegendCaption`, `padding.ts`, `series.ts`, `Progress`      | Cards sem shadow/legenda SP                                               |
| Eixos 969       | `echarts/cartesian/option/axis.ts` (+ helpers em `utils.ts`)              | Sem TitleCase/truncate nos cartesianos (RowChart pode continuar ok)       |
| Home Xray       | `HomeXrayCard.tsx` + styled                                               | Crash / badge quebrado                                                    |
| i18n            | `locales/pt-BR.po`; títulos LDAP com `t\`` (não string crua)              | Inglês em admin; typo em msgstr                                           |

### Smoke Trilhas (mínimo antes da próxima major)

Checklist canônica e detalhada (com onde cada item costuma quebrar): [checklist-smoke-test.md](./checklist-smoke-test.md). Resumo:

1. Backend sobe (`clojure -M:run:dev:dev-start:…`).
2. FE hot compila sem erros de módulo.
3. Login SP (painel esquerdo + brasão via LogoIcon) / setup (H2 novo após reset é esperado).
4. Home (cards SP / badges) + brasão no AppBar.
5. Dashboard (dashcards DS), filtros cascata, charts (eixos 969 + paleta 1092 — testar também no **Visualizer**), datagrid (pin 944 + hover 564 — testar também via **"ver registros" de uma question**).
6. SpLogo nos headers de painel continua **oculto**; LogoIcon continua **brasão** (ver seção Logos).
7. Amostra i18n admin (LDAP titles traduzidos; e-mail sem typo "Adicionr").

**Lição da 63:** rodar a checklist detalhada, não só a lista de telas — vários itens (eixos 969, i18n LDAP) regridem de forma pontual (um efeito React específico, uma string crua) mesmo com o smoke "básico" passando. Ver [notas-etapa-62-63.md](./notas-etapa-62-63.md) para os achados exatos.

---

## Como o agente deve agir em conversas novas

### Ao começar

1. Ler este arquivo e, se na EDD-1355, [notas-etapa-61-62.md](./notas-etapa-61-62.md) (e [notas-etapa-60-61.md](./notas-etapa-60-61.md) se precisar da etapa anterior).
2. Confirmar branch (`EDD-1355` vs `saopaulo`) e remotes `origin` / `upstream`.
3. Seguir a sequência oficial; não inverter para “refatorar tema grande → depois update” sem o usuário pedir.
4. Não sugerir salto além da próxima major enquanto a atual não passar do smoke mínimo. Após smoke 62 OK, o próximo passo canônico é **62→63**.

### Ao inventariar customizações (EDD-1361)

- Preferir: commits `feat[EDD-…]`, `git diff --name-only` vs `upstream/release-x.60.x`, listas do script.
- Classificar em SP-owned / adapter / behavior.
- Inventário: [manifesto-customizacoes.md](./manifesto-customizacoes.md).

### Ao atualizar versão (1355)

- Branch a partir de `saopaulo` (ou tip que já tenha 1361/1356).
- Por etapa: `snapshot` → `merge` → `restore` → `report` → manuais → `verify` → smoke → commit.
- Restore **só** curated + padrões seguros do script.
- Se boot/FE quebrar com erros de API “antiga”: procurar arquivos WT == tip pré-etapa e != upstream; restaurar upstream nos não-curated.
- Registrar conflitos/lições nas notas da etapa e, no fim, na 1356 v2 / 1362.

### Ao automatizar (1356)

- Usar `bin/merge-upstream-preserve-sp.sh`.
- Listas canônicas em `lists/`.
- Runbook: [runbook-atualizacao.md](./runbook-atualizacao.md).
- Aceitar intervenção manual nos adapters/behavior; automatizar SP-owned.

### Ao refatorar tema (EDD-1362, pós-1355)

- Trabalhar na árvore já atualizada.
- Objetivo: encolher `dual-changed` de visual; tokens SP-owned; menos `"Rawline"`/hex espalhados.

### O que evitar sugerir de novo (já descartado)

- Substituir o tree pela tag e reaplicar na mão como método principal.
- Diff `saopaulo` vs 63 limpo como lista canônica de customizações.
- Refatoração completa de DS na 0.60 como gate obrigatório da 1355.
- Prometer zero conflitos em todo update.
- Restore largo de todo drift BASE…SP.
- Tratar “SpLogo sumiu do header do painel” como regressão (é hide EDD-791); o bug real de marca no AppBar/login é **LogoIcon sem brasão**.
- Ir para a próxima major com home ou boot quebrados “para resolver na etapa seguinte”.

---

## Documentos desta pasta

| Arquivo                                                    | Uso                                              |
| ---------------------------------------------------------- | ------------------------------------------------ |
| [README.md](./README.md)                                   | Índice humano                                    |
| [estrategia-sequencia.md](./estrategia-sequencia.md)       | Cenário + sequência + dependências               |
| [issue-edd-1361.md](./issue-edd-1361.md)                   | Texto oficial / espelho da EDD-1361              |
| [issue-edd-1362.md](./issue-edd-1362.md)                   | Texto oficial / espelho da EDD-1362              |
| [manifesto-customizacoes.md](./manifesto-customizacoes.md) | Inventário path → EDD → bucket → risco           |
| [runbook-atualizacao.md](./runbook-atualizacao.md)         | Como rodar o merge semi-automático               |
| [issue-edd-1356.md](./issue-edd-1356.md)                   | Entrega da EDD-1356                              |
| [notas-etapa-60-61.md](./notas-etapa-60-61.md)             | Diário da etapa 60→61 (EDD-1355)                 |
| [notas-etapa-61-62.md](./notas-etapa-61-62.md)             | Diário da etapa 61→62 (EDD-1355)                 |
| [notas-etapa-62-63.md](./notas-etapa-62-63.md)             | Diário da etapa 62→63 (EDD-1355)                 |
| [checklist-smoke-test.md](./checklist-smoke-test.md)       | Checklist canônica de smoke test (usar sempre)   |
| [lists/](./lists/)                                         | Listas restore-ours / dual-changed / behavior    |
| **Este arquivo**                                           | Bootstrap de contexto para o agente em chat novo |

---

## Como o usuário pode acionar isto numa conversa nova

Sugestão de prompt:

> Leia `docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md` e continue a partir do contexto das issues EDD-1361 / EDD-1355 / EDD-1356 / EDD-1362. Não reinvente a estratégia já decidida.

---

## Atualizar este arquivo quando

- A base de `saopaulo` deixar de ser 0.60.x (ou `EDD-1355` avançar de major)
- Fechar etapa 61 / 62 / 63 (versão alcançada + novas lições)
- O script de merge ou as listas mudarem de contrato (restore, buckets)
- Decisões da sequência oficial mudarem (ex. pular 62)
- Comportamento de marca/logo for redefinido de novo
