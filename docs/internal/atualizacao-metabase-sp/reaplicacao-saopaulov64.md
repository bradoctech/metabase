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
2. **Marca e tema — aplicada; perfil SP validado pelo usuário:** tokens, Rawline, assets, LogoIcon/brasão, ocultamento de SpLogo, login e adapters de tema claros/escuros.
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
- Hook do VS Code: corrigida a falha `bun: not found` usando `mise exec` quando disponível, incluindo a instalação em `$HOME/.local/bin/mise`. O fallback continua sendo Bun no PATH. Todas as verificações do hook foram preservadas.
- Hook completo executado com `PATH=/usr/bin:/bin`: **aprovado**, incluindo lint-staged e a checagem de marcadores de bloqueio de commit. Nenhum commit foi criado pelo teste.
- Smoke visual da sidebar: **aprovado pelo usuário em 08/11/2026**, com captura da aplicação carregada e dos itens de navegação, incluindo Lixeira, sem a mensagem de erro anterior. A evidência confirma a recuperação da sidebar; não inclui navegação para a lixeira nem operações de arquivar/restaurar/excluir.
- Build de produção e smoke completo: **pendentes para a entrega do transporte SP**; a etapa 2 foi aplicada e as etapas 3–6 ainda não foram executadas.

Comando do teste isolado (sem aliases de inicialização de servidor):

```bash
mise exec -- clojure -J-Xmx1536m -J-Dmb.run.mode=test -M -e \
  '(load-file "test/metabase/collections/models/collection_name_test.clj") (let [result (clojure.test/run-tests (quote metabase.collections.models.collection-name-test))] (System/exit (if (zero? (+ (:fail result) (:error result))) 0 1)))'
```


## Marca e tema — aplicação sobre a 64 oficial

Paths desta leva: [marca-tema-saopaulov64.txt](./marca-tema-saopaulov64.txt). Os adapters selecionados foram comparados com a base oficial compartilhada `0d0fbd1edd9`: não sofreram mudanças oficiais até `bb612fac416`, permitindo transportar os patches SP sem reverter avanços do upstream.

Aplicado nesta leva:

- Tokens SP e injeção final nos temas claro/escuro; paleta padrão de séries SP e exportação da paleta para futuros adapters do Visualizer.
- Brasão em `LogoIcon`, favicons e assets do login SP. As ilustrações genéricas permanecem nas cores oficiais, conforme a decisão abaixo. O mecanismo de override do logo por plugins permanece.
- Fontes Rawline (18 variantes, WOFF e TTF), carregadas em `GlobalStyles`; registro nos tipos/mapa de fontes e default do backend. Fontes explícitas do embedding e arquivos de fonte personalizados continuam com precedência no seletor.
- Login com painel SP, formulário e botões; regra de ocultamento de `.SpLogo`. Os headers de dashboard e os logos próprios de Data Studio/Monitor serão tratados nas etapas correspondentes.

Adaptações além da cópia da referência:

- A declaração de Rawline na referência não tinha consumidor global. Foi conectada ao carregamento global usando o caminho da instância, inclusive em subdiretórios.
- Os tokens de tema da referência ainda usavam `color-mix`, incompatível com o contrato atual de renderização no servidor. As misturas SP agora são calculadas com `Color` e os tokens são emitidos em HSLA literal; os testes oficiais de temas permanecem intactos.
- Ajustes de formatação das declarações de fonte para as regras atuais de lint.

Validações desta leva:

- Autenticação e temas: 8 suítes, 25 testes aprovados.
- Testes adicionais de login/marca e fontes: 2 suítes, 16 testes aprovados (a suíte de login também está na execução anterior).
- ESLint e Stylelint (CSS e styled): aprovados; formatação corrigida nos arquivos apontados.
- Assets referenciados pelo login/brasão e os 36 arquivos de fonte: nenhum ausente.
- TypeScript: `mise exec -- bun run type-check-pure` **aprovado, código 0**. A tentativa inicial com `bunx tsc` esgotou o heap de 4 GiB; esse comando invocava o compilador antigo. O script de build-check e o runbook foram alinhados ao comando oficial do package.json, que usa TypeScript 7.
- `git diff --check`, sintaxe Bash do script e formatação dos 22 arquivos TS/TSX/CSS desta leva: aprovados.
- Perfil visual SP: aprovado pelo usuário nesta conversa. A confirmação geral não discrimina cada cenário do roteiro; a restauração posterior das ilustrações foi verificada por igualdade dos arquivos com a base oficial. Build de produção: pendente.

Para validar visualmente: login em desktop e tela estreita, brasão na AppBar, carregamento de Rawline na aba Network, temas claro/escuro e contraste dos botões. Ainda não esperar home/cards, datagrid, filtros, gráficos e traduções com todos os ajustes SP: essas etapas seguem pendentes. A existência da paleta base SP não substitui a integração dos color pickers do Visualizer.


## Decisão — manter as ilustrações coloridas oficiais (08/11/2026)

**Questão levantada pelo usuário:** por que as imagens genéricas em `resources/frontend_client/app/img/` passaram de coloridas para preto e branco durante o transporte de marca/tema?

**Levantamento:** foram copiados os arquivos da referência `EDD-1523`, que já continha as versões monocromáticas. O histórico consultado para `questions_illustration.png`, `dashboard_illustration.png` e `empty.png` aponta para `ae389c2767c` (`added SP customizations`), anterior à auditoria EDD-1523. Não foi localizada justificativa específica de design na documentação consultada para retirar as cores. Portanto, não tratar a cópia desses arquivos como um requisito confirmado do perfil SP ou da auditoria EDD-1523.

**Decisão do usuário:** manter as ilustrações genéricas coloridas da base oficial. Brasão, favicons, fontes, tokens e imagens específicas do login SP continuam com as customizações desta etapa.

**Aplicação:** restaurados 24 PNGs diretamente de `metabase-64-oficial` (`bb612fac416`), cobrindo os nomes abaixo e as variantes `@2x`:

- `dashboard_illustration`
- `empty`
- `empty_dashboard`
- `empty_question`
- `list_illustration`
- `metrics_illustration`
- `new_metric`
- `notebook_mode_illustration`
- `questions_illustration`
- `segments_illustration`
- `simple_mode_illustration`
- `sql_illustration`

**Prevenção nos próximos transportes:** removidos esses paths da lista de arquivos aplicados nesta leva. Na lista canônica `lists/sp-extra.txt`, o padrão amplo `resources/frontend_client/app/img/*` foi substituído pelos quatro assets `login_*` usados pelo layout SP. Não copiar novamente as versões monocromáticas com base no inventário histórico ou nos relatórios `.merge-sp/`; esta decisão prevalece para as ilustrações genéricas.

**Verificação:** os 24 arquivos restaurados são idênticos, byte a byte, aos da base oficial e deixaram de aparecer no diff da branch. Os quatro assets do login SP foram preservados. Não houve mudança de código, banco, commit ou push nesta correção de assets.
