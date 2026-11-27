# Smoke da saopaulov64 — barras laterais do Data Studio e do Monitor

**Pré-requisitos** — instância com a branch `saopaulov64`, perfil SP e uma conta com acesso ao Data Studio e ao Monitor. Comece no tema claro.

| ID | Cenário | Estado |
| --- | --- | --- |
| SB-01 | Seleção e hover no Data Studio | OK — confirmado pelo usuário |
| SB-02 | Seleção e hover no Monitor | OK — confirmado pelo usuário |
| SB-03 | Foco, menu recolhido e tema escuro | OK — confirmado pelo usuário |

## SB-01 — Data Studio

1. No seletor de áreas, abra **Data Studio → Guia**.
2. Passe o cursor sobre **Dados conectados**, mantendo **Guia** como item selecionado. Afaste o cursor e depois abra **Dados conectados**.

**Esperado** — fundo `#EBEBEB` no item selecionado e sob o cursor, texto escuro e ícones legíveis, como no menu principal. Ao retirar o cursor, o item sem seleção volta ao fundo normal. Ao navegar, o destaque acompanha a página aberta.

## SB-02 — Monitor

1. No seletor de áreas, abra **Monitor → Tarefas em segundo plano**.
2. Passe o cursor sobre **Jobs agendados** e tire um print com os dois estados. Depois clique em **Jobs agendados**.

**Esperado** — os estados selecionado e hover usam o mesmo cinza do menu principal, com texto escuro. Após o clique, o destaque acompanha a navegação.

## SB-03 — Foco, recolhimento e tema escuro

1. Nas duas áreas, recolha a barra lateral. Use `Tab` para focar um item e `Enter` para abri-lo. Expanda a barra novamente.
2. No tema escuro, repita a seleção e o hover e compare o destaque com o do menu principal.

**Esperado** — foco visível, navegação disponível pelo teclado e destaque perceptível com a barra recolhida. No tema escuro, o fundo segue o token do menu principal para o tema, com texto e ícones legíveis.

## Retorno do smoke

Indique `OK`, `FALHA`, `PARCIAL` ou `PENDENTE` por ID. Se alguma etapa ficar em aberto, informe o cenário e o motivo.

```text
Ambiente/tema:
SB-01 —
SB-02 —
SB-03 —
```
