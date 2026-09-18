# Estratégia de atualização do Metabase com customizações SP

**Público:** time que vai planejar e executar EDD-1355, EDD-1356, EDD-1361 e EDD-1362.  
**Objetivo:** atualizar o Metabase com risco controlado, sem perder customizações SP, e deixar um processo reproduzível para as próximas releases.

---

## Cenário atual

### O que é este repositório

- Remote principal: `bradoctech/metabase`
- Branch principal do fork: **`saopaulo`**
- Base de código hoje: **Metabase 0.60.x** (commit de referência: _“Atualizado SP com o upstream da v0.60”_)
- Alvo desejado (EDD-1355): linha atual **63.x** (ex.: tag [`v0.63.18`](https://github.com/metabase/metabase/releases))

### O que já existe no histórico

| Item                           | Situação                                                                     |
| ------------------------------ | ---------------------------------------------------------------------------- |
| Upgrade para 0.60              | Já aplicado em `saopaulo`                                                    |
| Tentativa de upgrade para 0.61 | Branch `origin/update_with_upstream_61` — **não** foi mergeada em `saopaulo` |
| Script de merge assistido      | `bin/merge-upstream-61-preserve-sp.sh` (na branch 61) — padrão a generalizar |
| Customizações SP               | Dezenas de commits `feat[EDD-…]` em cima da 0.60 (~150 arquivos tocados)     |

### Como as customizações estão organizadas hoje

Há **pouco isolamento**. A maior parte é edição direta no código upstream.

| Tipo                         | Exemplos                                                                       | Conflito em update                                 |
| ---------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------- |
| **SP-owned** (quase isolado) | `sp-colors.ts`, logos `logo-sp-gov.*`, `fonts.saopaulo.styled.ts`              | Baixo — dá para restaurar automaticamente (`ours`) |
| **Adapter** (tema no core)   | `light.ts`, headers, home styled, CSS modules                                  | Alto — precisa merge 3-way                         |
| **Behavior**                 | datagrid pin, truncate/`toTitleCase`, badges home, filtros QB, stubs de upsell | Alto — patch consciente                            |
| **i18n**                     | `locales/pt-BR.po` + strings                                                   | Médio — merge de `.po` / revisão                   |

### O que **não** funciona bem como estratégia principal

- Baixar a tag `v0.63.18` numa branch limpa e só “diffar” com `saopaulo`: o diff mistura **3 majors de upstream** com as customizações SP e não serve para reaplicar com segurança.
- Substituir a árvore do projeto pelo código da release e recolocar customizações na mão: perde histórico e aumenta o risco de esquecer mudanças.
- Refatorar **todo** o tema/marca na 0.60 **antes** do salto para 63: a API de tema/cores pode mudar no meio do caminho e gerar retrabalho.

### O que funciona

1. Tratar o fork como histórico git e fazer **merge** de `upstream/release-x.N.x` (ou tag `v0.N.M`).
2. Classificar customizações em buckets e automatizar o que for SP-owned.
3. Usar um update real (EDD-1355) como **prova de conceito** do processo (EDD-1356).
4. Refatorar tema/marca **depois** do update, na estrutura da versão nova, para baratear o _próximo_ upgrade.

---

## Sequência correta de atuação

```text
1) EDD-1361 — inventário + isolamento mínimo
       ↓
2) EDD-1356 — processo MVP (pode começar em paralelo com 1)
       ↓
3) EDD-1355 — update real = PoC da 1356
       ↓
4) EDD-1362 — tema/marca pós-update
       ↓
5) EDD-1356 v2 — endurecer script/doc com aprendizados da 1355
```

### 1. EDD-1361 — preparar o fork para updates (escopo curto)

**Não** é o redesign completo de DS. É só o que reduz atrito sem depender da API de tema da 63:

- classificar customizações nos buckets SP-owned / adapter / behavior;
- criar o manifesto inicial (`path → EDD → bucket → risco`);
- quick wins seguros na 0.60 (tokens em `sp-colors`, evitar hex solto, centralizar default de font/logo onde for óbvio);
- **não** reescrever home, dashboard ou datagrid inteiros ainda.

Detalhe da issue: [issue-edd-1361.md](./issue-edd-1361.md).

### 2. EDD-1356 — automatizar / semi-automatizar o transporte

Formalizar o processo reproduzível (evolução do script de 61):

```text
snapshot → merge upstream → restore SP-owned → report manuais → verify
```

- Pode começar em paralelo com a EDD-1361, usando o inventário parcial.
- Entrega MVP **antes** ou no início da 1355, para a 1355 já consumir o processo.
- Não precisa estar “perfeita” antes do primeiro merge — o PoC é que vai endurecê-la.

### 3. EDD-1355 — atualizar o Metabase (PoC do processo)

- Branch de trabalho a partir de `saopaulo`.
- Merge de `upstream/release-x.63.x` ou tag `v0.63.18` (avaliar salto direto vs 60→61→62→63 conforme risco).
- Executar o fluxo da 1356: restore automático + relatório do que exige intervenção manual.
- Reaplicar/adaptar adapters e behavior patches.
- Validar customizações SP, dashboards e fluxos do Trilhas.
- **Registrar** conflitos reais — isso vira entrada da EDD-1362 e da 1356 v2.

Dependência explícita: a 1355 **usa** o processo da 1356 (mesmo em MVP).

### 4. EDD-1362 — refatorar tema/marca na base já atualizada

Depois do merge na 63:

- encolher a lista `dual-changed` de tema/marca;
- um ponto de injeção de tema / tokens / font;
- arquivos upstream só referenciam tokens SP, não valores hardcoded.

Objetivo: o **próximo** update (64, 65…) ter bem menos conflitos de visual.  
Detalhe da issue: [issue-edd-1362.md](./issue-edd-1362.md).

### 5. Fechar o ciclo na EDD-1356

Atualizar script, listas (`restore-ours` / `dual-changed`), runbook e checklist com o que a 1355 mostrou na prática.

---

## Dependências entre as issues

```text
                    ┌─────────────────────┐
                    │ EDD-1361            │
                    │ inventário +        │
                    │ quick wins          │
                    └──────────┬──────────┘
                               │ alimenta
              ┌────────────────┼────────────────┐
              ▼                                 ▼
     ┌─────────────────┐               ┌─────────────────┐
     │ EDD-1356 (MVP)  │──────────────▶│ EDD-1355        │
     │ processo/script │  usado por    │ update = PoC    │
     └────────┬────────┘               └────────┬────────┘
              │                                 │
              │        aprendizados             │
              │◄────────────────────────────────┤
              ▼                                 ▼
     ┌─────────────────┐               ┌─────────────────┐
     │ EDD-1356 v2     │               │ EDD-1362        │
     │ processo maduro │               │ tema pós-update │
     └─────────────────┘               └─────────────────┘
```

| Issue        | Depende de                           | Alimenta          |
| ------------ | ------------------------------------ | ----------------- |
| EDD-1361     | —                                    | 1356, 1355        |
| EDD-1356 MVP | EDD-1361 (inventário mínimo)         | 1355              |
| EDD-1355     | 1356 MVP + EDD-1361                  | EDD-1362, 1356 v2 |
| EDD-1362     | 1355 (base nova + mapa de conflitos) | próximos upgrades |
| EDD-1356 v2  | 1355                                 | releases futuras  |

---

## Se a 1355 for urgente

Caminho mínimo (ainda na mesma estratégia, com escopo menor na 1361):

```text
EDD-1361 mínima → MVP 1356 → 1355 → EDD-1362 → 1356 v2
```

Não pule o inventário nem o report de manuais: sem isso a 1355 vira atualização ad hoc e a 1356 não tem PoC útil.

---

## Princípios que guiam a sequência

1. **Isolar o que é token/marca**; automatizar o transporte do que é patch; aceitar merge manual só nos adapters.
2. **Não refatorar tema grande na 0.60** como pré-requisito do salto para 63.
3. **Um update real** valida o processo — a 1355 é o modelo de uso da 1356.
4. **Documentar conflitos** durante a 1355; isso é entregável, não efeito colateral.
5. Preferir merge git do upstream a “download e substituir”.

---

## Referências úteis neste repo

- Branch de tentativa 61: `origin/update_with_upstream_61`
- Script legado de merge: `bin/merge-upstream-61-preserve-sp.sh` (nessa branch)
- Tokens SP: `frontend/src/metabase/ui/colors/constants/sp-colors.ts`
- Tema light (adapter crítico): `frontend/src/metabase/ui/colors/constants/themes/light.ts`
- Releases oficiais: [github.com/metabase/metabase/releases](https://github.com/metabase/metabase/releases)
- Upgrade operacional (app DB): [Upgrading Metabase](https://www.metabase.com/docs/latest/installation-and-operation/upgrading-metabase)

---

## Próximo passo sugerido

1. Revisar [manifesto-customizacoes.md](./manifesto-customizacoes.md) (EDD-1361).
2. Configurar remote `upstream` e completar o diff vs `release-x.60.x` (pendência do manifesto).
3. Seguir para MVP da EDD-1356 e depois EDD-1355; EDD-1362 só após o upgrade.
