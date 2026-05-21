# DataGrid — Funcionalidades Customizadas

Documentação das features adicionadas ao componente `DataGrid` além das capacidades originais.

---

## 1. Marcação de linha ativa (Row Highlight)

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

| Arquivo | Mudança |
|---|---|
| `components/DataGrid/DataGrid.tsx` | `activeRowIndex` state + `handleBodyCellClickWithRowHighlight` |
| `components/DataGridRow/DataGridRow.tsx` | Prop `activeRowIndex`, aplica `S.activeRow` |
| `components/DataGrid/DataGrid.module.css` | Classe `.activeRow` com a cor de fundo |

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
- **`↑` (chevronup)** — coluna está congelada (ícone sempre visível em azul); clique para remover o congelamento de todas as colunas

### Como funciona

O `useColumnPinningByCount` foi estendido com um estado `dynamicPinnedCount` que sobrescreve o `pinnedLeftColumnsCount` vindo das props externas durante a sessão. Quando o usuário clica no botão de um header:

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

> **Nota:** O botão de congelamento só é renderizado quando `setPinnedLeftColumnsCount` está presente no `DataGrid`. Se você não passar a prop (ex: num contexto read-only), o botão não aparece.

### Arquivos modificados

| Arquivo | Mudança |
|---|---|
| `hooks/use-column-pinning-by-count.ts` | `dynamicPinnedCount` state, `setDynamicPinnedCount` exposto |
| `hooks/use-data-grid-instance.tsx` | Conecta `setDynamicPinnedCount` e expõe `setPinnedLeftColumnsCount` |
| `types.ts` | `setPinnedLeftColumnsCount?: (count: number) => void` em `DataGridInstance` |
| `components/DataGrid/DataGrid.tsx` | Prop recebida, `handlePinColumn` implementado, repassado ao header |
| `components/DataGridHeader/DataGridHeader.tsx` | Props `onPinColumn` + `pinnedDataColumnsCount`; renderiza o botão por coluna |
| `components/SortableHeader/SortableHeader.tsx` | Prop `pinButton?: React.ReactNode` renderizada após o resize handle |
| `components/DataGrid/DataGrid.module.css` | Classes `.pinButton` e `.pinButtonPinned` |

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
  transition: opacity 0.15s, background-color 0.15s;
}

/* Colunas congeladas mantêm o botão sempre visível em azul */
.pinButtonPinned {
  opacity: 1;
  color: var(--mb-color-brand);
}

.row:hover .pinButton {
  opacity: 1;
}
```

### Comportamento com `pinnedLeftColumnsCount` externo

A prop `pinnedLeftColumnsCount` em `useDataGridInstance` continua funcionando como o estado inicial. O `dynamicPinnedCount` só sobrescreve após a primeira interação do usuário pelo botão. Se não houver interação, o comportamento é idêntico ao original.
