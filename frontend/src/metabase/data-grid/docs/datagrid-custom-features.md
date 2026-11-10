# DataGrid — Funcionalidades Customizadas

Documentação das features adicionadas ao componente `DataGrid` além das capacidades originais.

**saopaulov64 — 09/11/2026:** pin de sessão, hover sincronizado e marcação por clique reaplicados sobre a base oficial 64. A tabela da pergunta e o fluxo “ver registros” consomem o mesmo componente; não dependem do CSS administrativo.

---

## 1. Hover e marcação de linha

### Hover sem clique

Passar o mouse por uma linha aplica `hoveredRow` com `--mb-color-background-menu-hover`. O estado é compartilhado no DataGrid e aplicado a todas as partes da mesma linha, incluindo colunas fixadas e linhas fixadas. Ao sair da linha, o hover é removido; isso não dispara o callback de clique nem altera a seleção de células.

### Marcação por clique (Row Highlight)

### O que faz

Ao clicar em qualquer célula da tabela, a linha inteira recebe um destaque visual com `--mb-color-background-menu-hover`. Isso facilita a leitura horizontal e a comparação de valores entre colunas.

O comportamento é de **toggle**:

- Clique em uma linha → linha fica destacada
- Clique em outra linha → destaque move para a nova linha
- Clique na linha já destacada → destaque é removido

### Como funciona

O estado é gerenciado internamente no `DataGrid` com `useState<number | null>` e um `useRef` para evitar stale closures no handler. O `onBodyCellClick` original continua funcionando normalmente (o popover de filtro e demais ações não são afetados).

A classe `.activeRow` é aplicada no `[role="row"]` correspondente tanto no quadrante de colunas fixadas quanto no quadrante central (os dois renderizam o mesmo `row.origin.index`).

### Arquivos modificados

| Arquivo                                   | Mudança                                                        |
| ----------------------------------------- | -------------------------------------------------------------- |
| `components/DataGrid/DataGrid.tsx`        | `activeRowIndex` state + `handleBodyCellClickWithRowHighlight` |
| `components/DataGridRow/DataGridRow.tsx`  | Prop `activeRowIndex`, aplica `S.activeRow`                    |
| `components/DataGrid/DataGrid.module.css` | Classe `.activeRow` com a cor de fundo                         |

### CSS

```css
/* DataGrid.module.css */
.row {
  &.activeRow {
    background-color: var(--mb-color-background-menu-hover);
  }
}
```

### Nenhuma API pública necessária

Esta feature é completamente autocontida no `DataGrid`. Não requer nenhuma prop extra de quem consume o componente.

---

## 2. Congelamento de colunas (Column Freeze)

### O que faz

Permite que o usuário congele colunas a partir da interface, ao estilo do "Congelar Painéis" do Excel. As colunas congeladas ficam fixadas à esquerda e permanecem visíveis durante o scroll horizontal.

O botão de ação aparece no canto direito do header de cada coluna ao passar o mouse:

- **`↓` (chevrondown)** — coluna não está congelada; clique para congelar até esta coluna (inclusive as anteriores)
- **`↑` (chevronup)** — coluna está congelada (ícone sempre visível na cor de marca SP); clique para remover o congelamento de todas as colunas

### Como funciona

O `useDataGridInstance` mantém um estado `dynamicPinnedDataCount` que sobrescreve o `pinnedLeftColumnsCount` vindo das props externas após interação durante a sessão. O hook oficial `useColumnPinningByCount` permanece intacto, incluindo seu limite de largura. As colunas auxiliares são somadas no momento do cálculo, sem integrar a contagem de colunas de dados solicitada pelo usuário. Quando o usuário clica no botão de um header:

1. Se a coluna **já está fixada** → `setPinnedLeftColumnsCount(0)` → remove todos os congelamentos
2. Se **não está fixada** → encontra o índice desta coluna na ordem das data columns → chama `setPinnedLeftColumnsCount(index + 1)` → congela esta coluna e todas à esquerda

O `handlePinColumn` no `DataGrid` trata os utility columns (row ID, seleção etc.) de forma transparente, somando-os automaticamente para que o consumidor só precise pensar em colunas de dados.

### API pública

Para habilitar esta feature ao consumir `useDataGridInstance`, basta não fazer nada — ela já está disponível via `setPinnedLeftColumnsCount` no retorno do hook. O `DataGrid` recebe e conecta tudo automaticamente:

```tsx
const tableProps = useDataGridInstance({ data, columnsOptions, ... });

// tableProps.setPinnedLeftColumnsCount está disponível e é repassado ao DataGrid
<DataGrid {...tableProps} />
```

> **Nota:** O botão de congelamento só é renderizado quando `setPinnedLeftColumnsCount` está presente no `DataGrid`. Se a integração omitir essa prop, o botão não aparece. Congelar colunas é um ajuste local de apresentação, sem relação com permissão de editar dados.

### Arquivos modificados

| Arquivo                                        | Mudança                                                                      |
| ---------------------------------------------- | ---------------------------------------------------------------------------- |
| `hooks/use-column-pinning-by-count.ts` | Mantido oficial; preserva o limite de 90% da largura |
| `hooks/use-data-grid-instance.tsx` | Mantém contagem dinâmica de dados e expõe `setPinnedLeftColumnsCount` |
| `types.ts`                                     | `setPinnedLeftColumnsCount?: (count: number) => void` em `DataGridInstance`  |
| `components/DataGrid/DataGrid.tsx`             | Prop recebida, `handlePinColumn` implementado, repassado ao header           |
| `components/DataGridHeader/DataGridHeader.tsx` | Prop `onPinColumn`; renderiza o botão por coluna |
| `components/SortableHeader/SortableHeader.tsx` | Prop `pinButton?: React.ReactNode` renderizada após o resize handle          |
| `components/DataGrid/DataGrid.module.css`      | Classes `.pinButton` e `.pinButtonPinned`                                    |

### CSS

```css
/* DataGrid.module.css */

/* Botão invisível por padrão, aparece no hover da linha do header */
.pinButton {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  opacity: 0;
  transition:
    opacity 0.15s,
    background-color 0.15s;
}

/* Colunas congeladas mantêm o botão sempre visível na cor de marca */
.pinButtonPinned {
  opacity: 1;
  color: var(--mb-color-brand);
}

.row:hover .pinButton {
  opacity: 1;
}
```

### Comportamento com `pinnedLeftColumnsCount` externo

A prop `pinnedLeftColumnsCount` em `useDataGridInstance` continua funcionando como o estado inicial. O estado dinâmico só sobrescreve após a primeira interação do usuário pelo botão. Não é persistido como configuração da pergunta ou do usuário. Se não houver interação, o comportamento é idêntico ao original.


## 3. Acessibilidade, traduções e limites

- Botões de congelamento com `type="button"`, nome acessível, estado `aria-pressed` e títulos traduzíveis; textos pt-BR “Congelar até esta coluna” e “Descongelar colunas”.
- Botões visíveis também no foco por teclado e em dispositivos sem hover. A ação de pin não abre o menu de cabeçalho nem inicia seu arraste.
- Limite oficial: as colunas fixadas não devem ocupar mais de 90% da largura do grid. Em tabelas estreitas, um pedido para congelar várias colunas pode resultar em menos colunas efetivamente fixadas.
- Descongelar remove o pin das colunas de dados; colunas auxiliares, como o índice da linha, mantêm seu comportamento oficial.
- Redimensionamento, reordenação, seleção/cópia, callbacks de célula e zoom de linha permanecem conectados às APIs originais.
- Footer de 50 px transportado da referência SP. O scaffolding de padding horizontal zero da referência foi omitido por não alterar o comportamento original.

Roteiro visual desta branch: `docs/internal/atualizacao-metabase-sp/smoke-saopaulov64.md`, cenários DG-01 a DG-08. Os testes automatizados não substituem o aceite visual.
