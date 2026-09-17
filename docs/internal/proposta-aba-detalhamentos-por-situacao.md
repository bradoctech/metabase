# Apresentação: Aba Detalhamentos por Situação

**Produto:** Abono de Permanência  
**Escopo:** proposta de UX + protótipo navegável no Metabase local  
**Data:** 15/09/2026  
**Status:** Pronto para validação / apresentação à equipe  
**Protótipo local:** `http://localhost:3001/dashboard/10-abono-de-permanencia` → aba **Detalhamentos por Situação**

---

## 1. Em uma frase

Criamos um **hub de navegação por situação de negócio**: o analista escolhe um card (ex.: “Servidores com divergência”) e o **detalhe abre abaixo do próprio grupo**, sem sair da página, mantendo os filtros globais do dashboard.

---

## 2. Problema (contexto da issue)

Na aba atual de homologação (**Detalhamento por Servidor**), a investigação depende de:

- KPIs + **tabelas-preview** (~200 linhas)
- Vários gráficos empilhados na mesma aba

Isso obriga o analista a “vasculhar” um painel longo em vez de ir direto à visão detalhada da situação que precisa investigar.

### Objetivo de negócio

| Como analista… | quero… | para… |
|----------------|--------|-------|
| do painel de Abono de Permanência | uma aba com cards navegáveis por situação | chegar rápido às visões de investigação **sem depender** das tabelas resumidas |

---

## 3. O que foi entregue neste protótipo

### 3.1 Onde está

| Ambiente | O quê |
|----------|--------|
| **Local** | Dashboard demo **Abono de Permanência** (`/dashboard/10-…`) |
| Aba 1 | **Visão analítica** — mock anterior (4 colunas) preservado |
| Aba 2 | **Detalhamentos por Situação** — hub + detalhe in-page |

### 3.2 Comportamento escolhido (versão final)

Após validar duas opções nativas do Metabase:

| Opção | Resultado |
|-------|-----------|
| Abrir detalhe em **nova página** (dashboard filho) | Funcionou (filtros na URL), mas tira o analista do contexto |
| **Modal/dialog** nativo | **Não existe** no Metabase para outro dashboard/pergunta |
| **Cross-filter in-page** ← adotado | Clique atualiza o painel de detalhe **abaixo do grupo**, na mesma aba |

### 3.3 Como os filtros funcionam

| Filtro | Comportamento |
|--------|----------------|
| **Período** / **Órgão** | Continuam no **mesmo** dashboard (já aplicados aos cards ligados a eles) |
| **Situação clicada** | Atualiza um filtro por grupo via **cross-filter** e preenche o painel **Detalhe — &lt;grupo&gt;** |

Fluxo para apresentar:

1. Abrir a aba **Detalhamentos por Situação**
2. Clicar em um card (ex.: barra “Servidores com divergência”)
3. Observar o bloco **Detalhe — Divergências** atualizar **sem mudar de página**

---

## 4. Estrutura da aba (o que a equipe verá)

```
[Período] [Órgão]  …filtros globais…

Detalhamentos por Situação
Clique em um card → detalhe do grupo atualiza abaixo (cross-filter)

▶ DIVERGÊNCIAS
   [card] [card] [card]
   ┌─ Detalhe — Divergências ─────────────────────────┐
   │ Situação selecionada + tabela/texto placeholder  │
   └──────────────────────────────────────────────────┘

▶ ELEGIBILIDADE
   [card] [card] [card] [card]
   ┌─ Detalhe — Elegibilidade ────────────────────────┐
   │ …                                                │
   └──────────────────────────────────────────────────┘

▶ SITUAÇÕES ESPECÍFICAS
   [card] [card] [card] [card]
   ┌─ Detalhe — Situações específicas ────────────────┐
   │ …                                                │
   └──────────────────────────────────────────────────┘

▶ REGRA LEGISLATIVA
   [card]
   ┌─ Detalhe — Regra legislativa ────────────────────┐
   │ …                                                │
   └──────────────────────────────────────────────────┘
```

---

## 5. Catálogo de cards (nomenclatura de negócio)

### Divergências

| Card | Indicador mock | Papel do detalhe (no cliente) |
|------|----------------|-------------------------------|
| Servidores com divergência | 3.811 | Tabela completa (substitui preview) |
| Divergência da contribuição previdenciária | — | Visão filtrada |
| Detalhamento das ocorrências da contribuição previdenciária | — | Ranking/tabela completa |

### Elegibilidade

| Card | Indicador mock | Papel do detalhe (no cliente) |
|------|----------------|-------------------------------|
| Cargo comissionado recebendo abono indevidamente | 3.808 | Tabela detalhada |
| Detalhamento dos vínculos que não permitem abono | 3.291 | Lista + contexto de vínculos |
| Terceirizados que não podem receber | — | Visão filtrada |
| Exclusivamente comissionados que não podem receber | 0 | Visão dedicada |

### Situações específicas

| Card | Indicador mock | Papel do detalhe (no cliente) |
|------|----------------|-------------------------------|
| Servidores estabilizados com abono implantado | R$ 2.447.568,66 | Visão detalhada |
| Casos em análise judicial | — | Visão detalhada |
| Casos de transição / após | 1.067 | Visão detalhada |
| Cargo ou categoria extinta | 2.143 | Visão detalhada |

### Regra legislativa

| Card | Indicador mock | Papel do detalhe (no cliente) |
|------|----------------|-------------------------------|
| Cargos com restrição legal de elegibilidade parcial | — | Visão + valores por cargo |

> Indicadores são **mock de referência** (derivados dos prints de homologação, período nov/2025). No local, o SQLite demo não é a base do cliente.

---

## 6. Critérios de aceite × status no protótipo

| Critério da issue | Status no mock local |
|-------------------|----------------------|
| Nova aba (ou substituição de *Detalhamento por Servidor*) | **Atendido** — aba *Detalhamentos por Situação* no dashboard Abono |
| Cards clicáveis com títulos padronizados | **Atendido** |
| Organização por grupos semânticos | **Atendido** — 4 grupos |
| Cada card direciona à visão detalhada | **Atendido (mock)** — painel abaixo do grupo; no cliente vira pergunta/tabela real |
| Reaproveita filtros globais | **Atendido** — Período/Órgão no mesmo dashboard + situação via cross-filter |
| Nomenclatura compreensível para não técnico | **Atendido** — títulos do levantamento do cliente |
| Elimina dependência das tabelas-preview | **Atendido na proposta** — hub não usa preview; detalhe real fica para homologação |
| Presente no painel de Abono Permanência | **Atendido** no demo local (mesma ideia para o painel do cliente) |

---

## 7. Decisões técnicas relevantes (para a equipe)

1. **Sem modal nativo** — Metabase não abre outro dashboard/pergunta em dialog; cross-filter foi a melhor opção nativa para “detalhe no contexto”.
2. **Cards do hub** — gráficos de barra horizontal (1 categoria) para o clique conseguir enviar o nome da situação no cross-filter (limitação do scalar puro).
3. **Detalhe atual** — placeholder (texto + tabela mock). Em homologação/produção, trocar pelo destino real (pergunta salva / tabela completa).
4. **Aba Visão analítica** — o mock anterior foi **preservado** na aba 1 para comparação na demo.

---

## 8. Como reproduzir / atualizar o protótipo

```bash
python3 docs/internal/abono-demo/seed_detalhamentos_tab.py \
  --url http://localhost:3001 \
  --email SEU_ADMIN@empresa.com \
  --password 'sua-senha' \
  --dashboard-id 10
```

Documentação do seed: [`docs/internal/abono-demo/README.md`](../internal/abono-demo/README.md)

URL típica após o seed:

`http://localhost:3001/dashboard/10-abono-de-permanencia?orgao=Seduc&periodo=2025-07-01~2025-12-31`

(selecionar a aba **Detalhamentos por Situação**, ou usar o `&tab=…` impresso pelo script)

---

## 9. Próximos passos sugeridos (pós-apresentação)

1. Validar com negócio: **aba nova** vs **substituir** *Detalhamento por Servidor* em homologação.
2. Definir destinos reais (IDs de perguntas/tabelas) por card — priorizar um MVP (ex.: só Divergências).
3. Trocar os placeholders pelos detalhes reais, mantendo cross-filter + filtros globais.
4. Ajustar visual dos cards (se quiser aproximar mais de “card KPI” sem perder o clique).
5. Decidir o que acontece com a aba analítica longa atual (manter em outra aba, arquivar, ou reduzir).

---

## 10. Resumo para fechar a apresentação

- **Problema:** investigação lenta via previews numa aba densa.  
- **Proposta:** hub por grupos semânticos + detalhe no contexto.  
- **Prova:** protótipo local navegável com cross-filter e filtros globais.  
- **Pedido à equipe:** validar o modelo e apontar os cards P1 para ligar aos dados reais em homologação.
