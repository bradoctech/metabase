# Estratégia — salto `saopaulo` (0.60) → Metabase 0.64

**Branch de trabalho:** `metabasev64` (criada a partir de `origin/saopaulo`)  
**Referência de aprendizado (não é a base do merge):** `EDD-1359` (PoC 60→63 + tema 1362 + revisita 1356-v2)  
**Decisão de produto (daily):** begnini — evitar publicar o histórico sujo das majors intermediárias (61/62/63); partir de base fresca e ir à 64.

---

## 1. Por que não continuar na `EDD-1359`

A `EDD-1359` cumpriu o papel de **PoC do processo** (script, listas, smoke, tema). O tip dela já passa por merges 61→62→63 e carrega histórico intermediário.

Para levar o fork a **0.64** com histórico mais limpo:

| Usar | Não usar como base |
| ---- | ------------------ |
| Tip atual de `saopaulo` (0.60.x) | Tip / merges da `EDD-1359` / `EDD-1355` |
| Pacote de **processo** da 1359 (docs, script, lists) | Árvore completa já adaptada à 63 como ponto de partida do merge |
| `upstream/release-x.64.x` (ou tag `v0.64.x`) como alvo | Continuar etapa 63→64 em cima da PoC |

A `EDD-1359` permanece no remoto como **referência**: como o dual-changed ficou na 63, tema `sp-theme`, smoke canónico, e lições do `scan`/`build-check`.

---

## 2. Interpretação da orientação do begnini

Transcrição (resumo): clonar/usar a **64 limpa** e fazer o trabalho nela, evitando merge do histórico sujo das versões anteriores.

**Como alinhamos com a EDD-1356 (sem reinventar):**

1. Branch fresca a partir de **`saopaulo`** (60).
2. Trazer só o **pacote de processo** (ver §3).
3. Um salto assistido **60→64** com `bin/merge-upstream-preserve-sp.sh`  
   (`BASE_REF=upstream/release-x.60.x`, `UPSTREAM_REF=upstream/release-x.64.x`).
4. Resultado desejado: tip alinhado à 64 + customizações SP, **sem** commits de merge 61/62/63 no caminho publicado.

Isso **não** é “baixar a tag e reaplicar SP só no olho” como método principal — continua sendo merge + restore + scan + verify + build-check + smoke (runbook). A diferença é o **salto único** e a **base limpa** (`saopaulo`), não a cadeia da PoC.

---

## 3. O que levar da `EDD-1359` (pacote de processo)

Já copiado para `metabasev64` no bootstrap desta branch:

| Asset | Motivo |
| ----- | ------ |
| `docs/internal/atualizacao-metabase-sp/` (inteira) | Manual IA, INSTRUÇÕES, runbook, manifesto, smoke, notas 60→63, edd-1356-v2, 1362 |
| `bin/merge-upstream-preserve-sp.sh` | Script v2 (`scan`, `build-check`, `sp-extra`) |
| `lists/*` (dentro da pasta docs) | SP protegido: restore-ours / dual-changed / behavior-manual / sp-extra |

**Usar só como referência** (adaptar na 64; não copiar cego a árvore 63):

- Código já portado na 1359 (tema, dual-changed maduro, patches AGPL, eixos 969, etc.)
- Notas de etapa e “onde costuma quebrar” no checklist de smoke

**Não trazer como base do salto:**

- Tip completo / histórico de merge da `EDD-1359`
- Artefactos locais (`.merge-sp/` antigo da PoC, hot-update do FE, etc.)

---

## 4. Plano de execução (ordem)

### Pré-check (humano)

1. `git fetch origin` e `git fetch upstream` (o agente muitas vezes não tem SSH).
2. Confirmar tip: `origin/saopaulo` e existência de `upstream/release-x.64.x` (ou tag).
3. BE/FE dev **parados** antes de `build-check`.

### Bootstrap (já feito nesta branch)

- [x] Branch `metabasev64` a partir de `origin/saopaulo`
- [x] Pacote docs + script + lists a partir de `EDD-1359`
- [x] Este documento de estratégia

### Commit de bootstrap (usuário)

Commit separado só do pacote de processo + este doc (não misturar com o merge 64).

### Merge 60→64

```bash
export SP_REF=origin/saopaulo          # ou HEAD após o commit de bootstrap
export BASE_REF=upstream/release-x.60.x
export UPSTREAM_REF=upstream/release-x.64.x
export WORK_BRANCH=metabasev64
export BACKUP_TAG=saopaulo-pre-64x

bash bin/merge-upstream-preserve-sp.sh snapshot
bash bin/merge-upstream-preserve-sp.sh merge
bash bin/merge-upstream-preserve-sp.sh restore
bash bin/merge-upstream-preserve-sp.sh report
# resolver dual-changed + behavior-manual (usar EDD-1359 / manifesto como referência)
bash bin/merge-upstream-preserve-sp.sh scan
bash bin/merge-upstream-preserve-sp.sh scan --apply   # stale/missing/orphan; híbridos um a um
bash bin/merge-upstream-preserve-sp.sh verify
bash bin/merge-upstream-preserve-sp.sh build-check    # backend + static-viz + tsc + frontend
# smoke: checklist-smoke-test.md
```

**Diário da leva (orphans, riscos EDD-969 / RowChartView, híbridos):** [notas-etapa-60-64.md](./notas-etapa-60-64.md).  
`scan --apply` já rodou nesta branch (stale=0 orphan=0; hybrid=71 pendente).

### Depois do merge estável

- Atualizar `INSTRUCOES-AGENTE.md` / `manual-orientar-ia.md` (estado: base 64 nesta branch).
- PR com título alinhado à issue (se houver EDD); destino a combinar (`saopaulo` ou branch de integração).
- Manter `EDD-1359` no remoto como arquivo histórico da PoC 63.

---

## 5. Riscos deste salto

| Risco | Mitigação |
| ----- | --------- |
| Mais conflitos que 63→64 (4 majors de uma vez) | Aceito pela decisão de árvore limpa; listas + manifesto + tip 1359 como mapa |
| Listas desatualizadas vs paths da 64 | `scan` marca hybrid/stale; ajustar lists no mesmo PR |
| Código tema 1362 não existe em `saopaulo` | Reaplicar adapters na 64 (referência 1359), não esperar que o merge “traga” a refatoração sozinho |
| Dev ok / build quebra | `build-check` completo obrigatório antes do PR |
| SSH do agente | `fetch` / `push` pelo humano |

---

## 6. Nome da branch e issues

- Branch local/remota sugerida: **`metabasev64`** (combinado nesta conversa).
- Se surgir issue Linear/Jira, renomear ou abrir PR com prefixo `EDD-XXXX` sem mudar o conteúdo do plano.
- Issues de processo já existentes (1355/1356/1361/1362) documentam a PoC; este salto é a **próxima entrega** sobre `saopaulo` limpa.

---

## 7. Como orientar a IA neste salto

Entrada: [manual-orientar-ia.md](./manual-orientar-ia.md) + [INSTRUCOES-AGENTE.md](./INSTRUCOES-AGENTE.md).

Prompt sugerido:

> Leia `docs/internal/atualizacao-metabase-sp/INSTRUCOES-AGENTE.md` e `estrategia-salto-60-64.md`. Estamos na branch `metabasev64` (base `saopaulo` 60 → alvo 64). Não use `EDD-1359` como base de merge; use-a só como referência de processo e patches. Siga o runbook com `UPSTREAM_REF` 64. Não reinvente a estratégia.

---

## 8. Atualizar este arquivo quando

- Fechar o merge 60→64 (resultado do `verify` / `build-check` / smoke)
- Mudar o destino do PR ou o nome da branch/issue
- Descobrir paths novos obrigatórios nas lists após o `scan` da 64
