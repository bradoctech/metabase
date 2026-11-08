# Reaplicação SP na base oficial 64 — saopaulov64

## Decisão atual — 08/11/2026

- Base: `metabase-64-oficial`, commit `bb612fac416eb1dde36c32e5a2d224280d09d7b6`.
- Trabalho: `saopaulov64`, criada pelo usuário a partir dessa base.
- Referência de aprendizado e patches: `EDD-1523`, commit `4e2e1364fef` (inclui a auditoria posterior à `metabasev64`).
- Reaplicar mudanças selecionadas em novos commits. Não fazer merge das branches antigas nem cherry-pick de commits grandes de upgrade.
- A troca futura de `saopaulo` não faz parte desta etapa. Sua execução exige definir a estratégia de publicação; um PR normal para a branch v60 ainda exibirá todo o avanço do upstream.

## Como trabalhar nesta branch

As instruções anteriores de merge 60→64 ficam como histórico. Aqui a base já é a 64 oficial: não executar `snapshot → merge → restore` com `saopaulo` como origem. O `scan --apply` histórico também não deve ser usado para transportar as customizações.

Usar as quatro listas canônicas como inventário de candidatos. Antes de cada transporte, comparar o patch da referência com a base oficial; nos adapters e behavior, preservar as mudanças mais recentes do upstream. Arquivos apenas presentes na referência exigem avaliação de dependências. As cópias em `.merge-sp/` são relatórios locais antigos, não fonte de verdade.

O [inventário TSV](./inventario-saopaulov64.tsv) cruza as listas com o diff entre as duas referências acima. Não é uma lista de tudo que deve ser copiado: globs de assets e docs também incluem arquivos oficiais; caminhos ausentes na referência podem ser mudanças recentes do upstream. Um path pode aparecer em mais de um bucket. Mudanças fora das listas exigem avaliação separada, não cópia automática.

| Bucket | Candidatos no diff |
| --- | ---: |
| restore-ours | 31 |
| dual-changed | 158 |
| behavior-manual | 41 |
| sp-extra | 118 |

## Etapas e estado

1. **Fundação — aplicada, teste de regressão e smoke visual aprovados:** documentação e script históricos recuperados, `.merge-sp/` ignorado, correção pontual do schema de nomes localizados de coleções. Nenhum commit ou push automático.
2. **Marca e tema — pendente:** tokens, Rawline, assets, LogoIcon/brasão, ocultamento de SpLogo, login e adapters de tema claros/escuros.
3. **Home e dashboard — pendente:** badges/cards, dashcards DS, layout e componentes associados.
4. **Comportamentos — pendente:** pin/hover do datagrid, cascata de filtros, nulls, eixos/title case/tooltips e paletas, incluindo Visualizer.
5. **Traduções e política SP — pendente:** catálogo pt-BR, ajuda de drivers, links/upsells, Data Studio e Monitor, conforme EDD-1523. Preservar verificações reais de permissões/licença.
6. **Entrega — pendente:** produção (backend/drivers, static-viz, tsc, FE), smoke canônico e auditoria. Não declarar o transporte concluído antes dessas validações.

## Lixeira: diagnóstico e patch

`GET /api/collection/trash` retornou 500 no teste do usuário. A função oficial `trash-collection` fornece o nome da coleção como `UserLocalizedString`, mas `CollectionInstance` aceitava apenas `:string`. O ajuste permite `[:or :string ms/LocalizedString]`, como no patch de `9a5d9784c20`, sem transportar as demais mudanças daquele commit.

A correção não muda o banco nem as permissões. Validar funções de coleção com nomes comuns e localizados e reabrir a sidebar no ambiente do usuário. Nenhum reset de banco é necessário para aplicar o patch.

## Validação desta etapa

- Teste isolado `collection-name-test`: **1 teste, 6 asserções, 0 falhas e 0 erros**, em modo de teste com validação Malli ativa. Exercita nomes comuns e traduções adiadas de Trash/Library em `children-location` e `shared-tenant-collection?`, sem consultas ao banco.
- `git diff --check`: aprovado para os arquivos já versionados alterados.
- `bash -n bin/merge-upstream-preserve-sp.sh`: aprovado; script recuperado apenas como referência, sem executar merge/restore/scan.
- `.merge-sp/`: confirmado como ignorado pelo Git.
- Smoke visual da sidebar: **aprovado pelo usuário em 08/11/2026**, com captura da aplicação carregada e dos itens de navegação, incluindo Lixeira, sem a mensagem de erro anterior. A evidência confirma a recuperação da sidebar; não inclui navegação para a lixeira nem operações de arquivar/restaurar/excluir.
- Build de produção e smoke completo: **pendentes para a entrega do transporte SP**; as etapas 2–6 ainda não foram executadas.

Comando do teste isolado (sem aliases de inicialização de servidor):

```bash
mise exec -- clojure -J-Xmx1536m -J-Dmb.run.mode=test -M -e \
  '(load-file "test/metabase/collections/models/collection_name_test.clj") (let [result (clojure.test/run-tests (quote metabase.collections.models.collection-name-test))] (System/exit (if (zero? (+ (:fail result) (:error result))) 0 1)))'
```
