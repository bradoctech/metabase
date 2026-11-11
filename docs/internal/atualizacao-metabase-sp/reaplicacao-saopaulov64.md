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
3. **Home e dashboard — aplicada, testes/tipos/lint e smoke local relatado aprovados; HD-05/12 adiados para homologação:** badges/cards, dashcards DS, layout e componentes associados.
4. **Comportamentos — datagrid reaplicado com testes/tipos/lint e smoke DG-01 a DG-08 aprovados; filtros cascata reaplicados com testes/tipos/lint aprovados e smoke parcial (FC-01 a FC-04 aprovados; FC-05 a FC-08 em homologação); nulls reaplicados com smoke pendente; gráficos pendentes:** pin/hover do datagrid, cascata de filtros, nulls, eixos/title case/tooltips e paletas, incluindo Visualizer.
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
- Build de produção e smoke completo: **pendentes para a entrega do transporte SP**; marca/tema, home/dashboard e datagrid já foram aplicados e validados no escopo relatado; o smoke de filtros cascata e nulls permanece parcial/pendente; gráficos e as demais etapas continuam pendentes, assim como os cenários adiados para homologação.

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


## Home e dashboard — leva de 09/11/2026

**Referência:** patches selecionados da `EDD-1523` contra o ancestral oficial comum `0d0fbd1edd9`. [Paths desta leva](./home-dashboard-saopaulov64.txt). Não transporta alterações de Onboarding ou da política comercial, que pertencem à etapa posterior.

**Home:** cards SP 215×315 em Recent/Popular e Xray, badges do banco/dashboard/coleção, espaçamento das seções, saudação com nome destacado e sem o logo Metabot, fundo e margem SP. As condições oficiais que escolhem Popular/Recent/Xray e a ilustração personalizada configurada no whitelabel foram preservadas. O card de ajuda recebe hover neutro sem mudar sua política de exibição.

**Dashboard:** sombra SP sem borda nos dashcards; sombra removida quando o fundo está oculto; legenda com peso 600 e espaçamento compacto. Logo-gov mantido no JSX e oculto pela regra `.SpLogo`, com URL que respeita subdiretórios, tanto no header salvo quanto no dashboard automático.

**Adaptações para preservar o upstream atual:**

- Mantidos menus de dashcards, navegação por foco/teclado, descrição de escalar no hover e comportamento de ações. O CSS da referência removia esses estilos atuais e não foi copiado integralmente.
- Padding compacto de 8 px aplicado somente a charts em dashboard; gráficos fora desse contexto mantêm os 14 px oficiais. A primeira execução detectou quatro expectativas de layout quebradas pela cópia do padding global; o ajuste passou a respeitar o contexto e ganhou cobertura de regressão.
- Mantido o `dayjs` configurado pelo projeto.
- Textos dos cards, saudação e legendas usam o token semântico `text-primary` para preservar contraste no tema escuro.
- A referência usava uma classe global `bgMenuHover` que não existe nesta base. Foi criado um módulo CSS local para o hover neutro do card de ajuda.
- Nenhuma ilustração genérica foi substituída; permanece a decisão de manter as versões coloridas oficiais.

**Validações automatizadas:**

- 25 suítes aprovadas (home, dashcards, menus de filtros, header e LegendLabel): 149 testes.
- Layout de chart/legenda: 13 testes aprovados após limitar o padding compacto aos dashboards. Total desta leva: **26 suítes, 162 testes aprovados**. A primeira rodada falhou em quatro testes de geometria e foi corrigida; nenhuma falha restante nessas suítes.
- `mise exec -- bun run type-check-pure`: aprovado, código 0.
- ESLint, Stylelint (CSS e styled), formatação dos 26 arquivos de frontend e `git diff --check`: aprovados.
- A saudação tem cobertura atualizada para a ausência do Metabot; os novos testes cobrem navegação/badges, origem de cada badge e o limiar de layout compacto.

A rodada visual está em [smoke-saopaulov64.md](./smoke-saopaulov64.md), cenários HD-01 a HD-12, com retorno do usuário registrado em 09/11/2026: HD-01/02/07/11 aprovados; HD-04 inicialmente conferido brevemente, depois aprovado com clique e abertura da exploração em dois prints; HD-08 aprovado também no raio de 8 px após reconferência do usuário. HD-03 aprovado posteriormente com print e interação com os cards; HD-09 aprovado e HD-10 aprovado para texto sem fundo, com print. HD-05 adiado para homologação; HD-06 inicialmente adiado, depois reproduzido em Popular e convertido na solicitação de ocultar o card no perfil SP; HD-12 adiado para homologação se houver subdiretório. Ações/embedding de HD-10 não têm evidência específica. Os OK históricos da `metabasev64` não são reaproveitados. Build de produção completo permanece pendente para o fechamento do transporte. Não foi criado commit nem feito push nesta leva.


### Retorno do smoke — 09/11/2026

O usuário aprovou saudação, Recent, responsividade/temas e cabeçalhos. Xray foi visto apenas brevemente; manter a aprovação limitada à aparência observada. Popular não foi exercitado. Para os dashboards, solicitado `border-radius: 0.5rem` (8 px) no lugar de 0.75rem; aplicado em `.DashCardRoot`, sem alterar os cards da home. Detalhes de reprodução e limitações para cada item estão em `smoke-saopaulov64.md`. Nenhum resultado foi inferido a partir da ajuda do dropdown ou da ausência de cenário com múltiplos schemas/subdiretório.


### Retorno seguinte do smoke — 09/11/2026

- HD-09 aprovado pelo usuário.
- HD-10 aprovado no cenário de texto com fundo transparente, com captura da interface. Não inferir execução dos subcenários de ações, filtros ou embedding a partir do print.
- HD-05 adiado para homologação: ambiente local usa Sample Database; precisa de banco não sample com sugestões em múltiplos schemas.
- HD-06 adiado para homologação: card de ajuda não aparece na home Recent usada. A ausência não foi classificada como defeito; as condições de usuário/configuração ainda precisam ser exercitadas no cenário adequado.
- HD-12 adiado para homologação se necessário: validar apenas quando houver instalação publicada em subdiretório.
- HD-03 continua pendente; HD-04 mantém o aceite visual breve sem navegação confirmada; o raio de HD-08 foi aprovado explicitamente pelo usuário no retorno posterior. Os adiamentos não encerram o smoke completo nem o build de produção.


### Aceite do raio e reprodução local — 09/11/2026

Usuário confirmou o border-radius; HD-08 aprovado. Acrescentado ao roteiro de smoke o passo a passo para Popular com usuário não instalador recém-criado e para clique em Xray com usuário de teste sem conteúdo salvo elegível. Ambos podem usar Sample Database; nenhum dado, usuário ou permissão da aplicação foi alterado pelo agente. HD-03 e a navegação de HD-04 continuam aguardando execução e retorno.


### Popular aprovado e decisão sobre Metabase dicas — 09/11/2026

O usuário reproduziu HD-03 com conta comum de teste e aprovou as interações com os cards Popular, com captura da interface. O card “Metabase dicas” também apareceu nessa seção e apontou para `https://www.metabase.com/learn`.

**Decisão solicitada:** não renderizar esse card no perfil de cliente SP. Aplicado `SP_COMMERCIAL_POLICY.showExternalHelpLinks: false` e gate no `HomeHelpCard` compartilhado por Recent/Popular/Xray. Esta é a política da distribuição SP da branch; não foi adicionada configuração por usuário nem inferência de cliente pelo nome da aplicação. O restante da política comercial e de ajuda continua na etapa própria. A supressão visual foi posteriormente confirmada pelo usuário, encerrando HD-06 no escopo do card da home e substituindo seu adiamento anterior.

HD-03 e, no retorno seguinte, navegação HD-04 aprovados. O documento de smoke detalha como a flag de conteúdo visível é calculada e como permissões aditivas de grupos interferem no teste de Xray. Nenhuma permissão do ambiente foi alterada pelo agente.

Validação do ajuste de dicas: **21 suítes da home, 100 testes aprovados**; `bun run type-check-pure`, ESLint e formatação aprovados. Os testes preservam os cenários upstream com ajuda explicitamente habilitada e verificam o bloqueio SP em OSS, EE sem token e EE com whitelabel, além da ausência do card nas seções Recent/Popular/Xray. O módulo SP foi registrado no lint de fronteiras de módulos. Reconferência visual da supressão aprovada pelo usuário no retorno posterior.


### Aceite de Xray e supressão de dicas — 09/11/2026

Usuário confirmou que o card Metabase dicas desapareceu. Também reproduziu a home Xray, clicou em um card e abriu a exploração correspondente. As duas capturas mostram os cards SP de exploração e o dashboard automático de Accounts. **HD-04 e HD-06 aprovados** para os fluxos relatados.

O smoke local de home/dashboard relatado está aprovado, com **HD-05 adiado para homologação** (banco não sample com múltiplos schemas elegíveis) e **HD-12 adiado para homologação se aplicável** (instância em subdiretório). Os subcenários de ações/embedding de HD-10 não têm evidência específica; o card de texto sem fundo foi aprovado. Não inferir validação de salvar exploração, de todos os filtros ou de todas as tabelas a partir dos prints. O build de produção e as etapas restantes do transporte SP continuam pendentes.


## Datagrid — leva de 09/11/2026

**Referência:** alterações SP de `EDD-1523` nos arquivos do datagrid, comparadas com o ancestral oficial `0d0fbd1edd9`. Nenhum desses arquivos tinha alterações oficiais adicionais até o tip atual antes desta leva. Não foi necessário substituir `TableInteractive`: ele já repassa o retorno de `useDataGridInstance` ao grid compartilhado.

**Aplicado:** botões para congelar até uma coluna/descongelar, seguindo a ordem atual; hover sincronizado entre partes fixadas/roláveis da mesma linha; marcação persistente por clique com toggle; footer de 50 px da referência SP.

**Adaptações:**

- O hover está no DataGrid, sem depender de `css/admin.module.css`; não foram copiadas as reversões de tokens antigos presentes no CSS administrativo da referência.
- Mantido intacto o hook oficial `useColumnPinningByCount`, incluindo limite de 90% da largura. A contagem dinâmica de dados foi localizada no hook de instância e soma separadamente as colunas auxiliares, sem congelá-las/descongelá-las por engano.
- Mantidos callbacks de células, seleção/cópia, reordenação, resize e zoom. Os handlers de pin não propagam os eventos para o cabeçalho.
- Botões acessíveis por teclado, visíveis em foco e em dispositivos sem hover, com `aria-pressed`, `type="button"` e duas mensagens traduzíveis adicionadas a `locales/pt-BR.po`.
- Catálogo frontend pt-BR regenerado com os builders oficiais de tradução para essa locale; artefato local `resources/frontend_client/app/locales/pt_BR.json` não é versionado. As duas traduções novas foram verificadas no JSON.
- O padding horizontal zero da referência não foi copiado: já equivalia ao comportamento oficial. Nenhuma configuração de usuário ou banco foi alterada, e o pin não é persistido em perguntas salvas.

**Validações:** 11 suítes com 72 testes aprovados (datagrid e helpers/células de TableInteractive), incluindo pin dinâmico, ordem, colunas auxiliares, limite de largura, hover entre quadrantes, toggle por clique e callbacks; ESLint, Stylelint e formatação aprovados. A primeira checagem de tipos foi encerrada com SIGKILL (137); a repetição com `mise exec -- env GOMEMLIMIT=2GiB GOGC=50 GOMAXPROCS=2 bun run type-check-pure` foi **aprovada, código 0**, sem alterar a configuração do projeto. As duas traduções novas foram verificadas no JSON local e `git diff --check` passou. [Paths desta leva](./datagrid-saopaulov64.txt). O roteiro visual está em [smoke-saopaulov64.md](./smoke-saopaulov64.md), DG-01 a DG-08. DG-01 a DG-08 foram aprovados explicitamente pelo usuário em 09/11/2026, incluindo “ver registros”. A observação de DG-06 sobre redução das colunas efetivamente fixadas ao diminuir a largura foi aceita, coerente com o limite oficial de 90% do grid. O subcenário de toque não foi discriminado no retorno. Build de produção completo permanece pendente para fechamento do transporte.


### Aceite do datagrid — 09/11/2026

Usuário aprovou os oito cenários DG-01 a DG-08. Em DG-06, observou que a última coluna efetivamente fixada pode passar da terceira para a segunda ao reduzir a largura; comportamento aceito e documentado como consequência do limite oficial de largura, sem mudança adicional de código. Datagrid aprovado no smoke relatado; próxima frente de comportamentos: filtros cascata. Build de produção e demais pendências globais permanecem em aberto.


## Filtros em cascata do Query Builder — leva de 09/11/2026

[Paths desta leva](./filtros-cascata-saopaulov64.txt). Transportados os patches selecionados da `EDD-1523` para o seletor, helper de constraints, tipos/API RTK, mocks, endpoint backend e testes. Preservadas as mudanças oficiais posteriores no schema de atualização de Field e no upsert de user settings; não houve cópia integral do arquivo backend antigo.

**Fluxo aplicado:** filtros irmãos suportados no mesmo estágio geram constraints; o seletor usa `POST /api/field/:id/filtered-values` para listar/buscar valores restritos. Sem constraints, mantém os GETs oficiais. O backend reutiliza chain-filter/chain-filter-search e suas verificações do processador de consultas. O alvo passa pela mesma checagem de permissão de consulta do endpoint de valores existente. Linked Filters de dashboard, parâmetros de pergunta e critérios de permissão não foram alterados.

**Adaptações além da referência:**

- Schema de resposta explícito no endpoint novo; constraints ausentes ou null normalizadas como lista vazia e busca vazia aceita como listagem.
- Resolução do campo via helper oficial `warehouse-schema-rest.db/field`.
- Um teste oficial do FilterPicker detectou que o filtro em edição passava a restringir a nova coluna ao usar Voltar. O contexto do picker agora remove somente o filtro sendo substituído, preservando os irmãos. O teste original passou sem alterar sua expectativa.
- Testes adicionais conferem o corpo POST e a busca digitada com constraints; testes HTTP H2 cobrem mesma tabela, FK, busca, ausência/null de constraints e negação de acesso.

**Escopo e limites:** texto, número e booleano com valores; filtros do alvo excluídos. Sem conversão completa de data/hora, null-checks, coordenadas ou expressões complexas; relações dependem do metadata de mesma tabela/FK. Não representa a query inteira em todos os modelos/joins. Detalhes: [filtros-cascata-datagrid.md](../filtros-cascata-datagrid.md).

**Validação:** backend: 3 testes HTTP em H2, 14 asserções, 0 falhas/erros. Frontend: **14 suítes, 290 testes distintos aprovados** (283 dos pickers + 7 do helper). Na primeira execução ampliada, 12 suítes passaram e houve uma falha na suíte do FilterPicker ao trocar a coluna; após corrigir o contexto, os 34 testes dessa suíte passaram sem mudar a expectativa do teste original. ESLint e formatação aprovados. Checagem global de tipos após o ajuste final: **aprovada, código 0**, usando `mise exec -- env GOMEMLIMIT=2GiB GOGC=50 GOMAXPROCS=2 bun run type-check-pure`. `git diff --check` aprovado. Formatação Clojure e análise de requires executadas (sem requires não usados; kondo avisou sobre o hook Toucan ausente no ambiente). Smoke manual pendente em FC-01 a FC-08; nenhum commit ou push criado.


### Retorno parcial dos filtros em cascata — 10/11/2026

Usuário aprovou FC-01/02/03 no ambiente local com State → City. A restrição das opções de State quando City já está preenchida foi observada e aceita como comportamento esperado da cascata entre irmãos. Em FC-04, trocou City = Aguilar por Address no editor, mantendo State = CO, e forneceu captura do autocomplete com sugestões. Na sequência, confirmou a validação de Address no Network e aprovou FC-04. A captura adicional mostra a resposta de valores; o aceite da conferência no Network segue o relato do usuário. FC-05 a FC-08 permanecem pendentes, por decisão do usuário, para teste com a equipe em homologação. Nenhuma mudança de código nesta atualização de aceite.


## Valores nulos — EDD-999 — leva de 10/11/2026

[Paths desta leva](./nulls-saopaulov64.txt). Referência de intenção: commit `3d5ca5061f0` (EDD-999). O diff entre o ancestral oficial e EDD-1523 só preservava a normalização de SmartScalar; os ajustes de tabela e Scalar haviam se perdido nas atualizações. Reaplicados seletivamente nos componentes atuais da 64, preservando o shell de indicadores e o datagrid atuais.

- Helper compartilhado normaliza somente null de coluna numérica. Não converte texto, booleano, string vazia ou valores existentes. Sem linhas continua sem linhas.
- Tabela interativa aplica a mesma política nos formatters visual e de cópia, sem mudar os dados originais usados pelos drills.
- Scalar mostra zero para null numérico e distingue ausência de linhas com a mensagem traduzida de nenhum resultado.
- SmartScalar recebe uma cópia das linhas com a métrica numérica selecionada normalizada; não altera a resposta original. Nulos em outros campos permanecem intactos. A normalização afeta também comparações com períodos existentes nulos, conforme a intenção da EDD-999. Períodos ausentes mantêm a semântica oficial de ausência de dados.
- Adaptação: removido o try/catch amplo e o cast da referência; tipos atuais e helper explícito. Nos testes de ausência de período, as fixtures passaram a omitir a linha em vez de simular ausência com null, pois são situações distintas na política SP. Testes específicos verificam período nulo como zero e comparação a partir de zero.

Smoke NU-01 a NU-06 preparado em [smoke-saopaulov64.md](./smoke-saopaulov64.md); nenhum aceite manual presumido. Build de produção e eixos/paletas continuam pendentes.

**Validação automatizada:** 3 suítes, 89 testes aprovados (Scalar, SmartScalar e helper de normalização/cópia). ESLint com zero avisos, formatação dos sete arquivos frontend e `git diff --check` aprovados. A execução inicial dos componentes expôs expectativas upstream incompatíveis com a política SP e uma fixture numérica sem tipo; testes foram adaptados para distinguir período ausente de null presente. Uma fixture do helper também foi corrigida para usar o formato atual de mock Dataset. A primeira checagem global de tipos foi encerrada por SIGKILL com testes concorrentes. A repetição com menos memória expôs ajustes de tipagem no formatter e no valor interno do Scalar sem linhas; corrigidos. Checagem global final aprovada, código 0, com `mise exec -- env GOMEMLIMIT=2GiB GOGC=50 GOMAXPROCS=2 bun run type-check-pure`.


### NU-01 — classificação de expressões nulas no SQLite — 10/11/2026

Usuário reportou `rotulo` textual renderizado como 0. O payload confirmou `rows = [[null, null], [12.5, "Controle"]]`, mas ambas as colunas vieram como `database_type = NUMERIC`, `base_type/effective_type = type/Float`. Reprodução direta com sqlite-jdbc 3.50.3.0 confirmou o metadata NUMERIC para expressões sem tipo declarado cuja primeira linha é null. O Sample Database atual usa SQLite por padrão (`sample_data/impl.clj`); o roteiro inicial presumiu H2 incorretamente.

Ajuste no driver SQLite: só o metadata de expressão sem tabela de origem, com tipo NUMERIC e classe JDBC Object, passa a base desconhecida para permitir inferência pelo QP. Tipos declarados de tabela permanecem preservados. Ajuste no middleware de anotação permite inferência quando há qualquer coluna desconhecida, mantendo os tipos conhecidos. O valor original null não é convertido pelo backend; a regra de exibição numérica fica no frontend. O `database_type` bruto pode continuar NUMERIC; `base_type` e `effective_type` de `rotulo` devem passar a Text no resultado completo.

Uma expressão nula sem nenhum valor não nulo para amostragem permanece com tipo desconhecido. No SQLite, CAST(NULL AS VARCHAR) ou CAST(NULL AS DOUBLE PRECISION) isolado não fornece metadata suficiente para distinguir esses casos. Para NU-03, usar uma coluna numérica declarada, como no exemplo corrigido do smoke. Nenhum banco de aplicação do usuário foi alterado.


**Validação da correção SQLite:** 1 teste integrado com 4 consultas e 16 asserções aprovado; 4 testes de inferência/anotação com 6 asserções aprovados. Suíte completa de Table aprovada: 33 testes, incluindo a nova regressão de nulos numérico/textual lado a lado. O teste de ordenação falhava porque buscava o nome acessível exato do header sem considerar o ícone; os seletores agora aceitam o sufixo, mantendo as asserções de ordenação. ESLint da suíte e formatação Clojure aprovados; `git diff --check` aprovado. A execução inicial dos testes auxiliares de anotação falhou na leitura do arquivo durante a preparação; repetição com os arquivos consolidados aprovada. Reteste manual de NU-01 continua pendente.

Checagem global de tipos após a correção SQLite e a regressão de Table: **aprovada, código 0**, com `GOMEMLIMIT=2GiB GOGC=50 GOMAXPROCS=2 bun run type-check-pure`. Análise de requires não encontrou requires não usados; os avisos de hook Toucan ausente no ambiente persistem, sem representar lint completo aprovado.


### Revisão de escopo após descrição da issue — 10/11/2026

A descrição fornecida pelo usuário exige zero real, preservação da ausência de registros e aplicação somente a KPIs mapeados, mediante condição explícita e levantamento prévio dos cenários de null. A implementação transportada e seus testes automatizados ainda representam uma conversão genérica de null numérico, incluindo tabelas e Tendência; não comprovam conformidade com essa regra e precisam ser revistos após o levantamento. Uma linha com SUM = null e COUNT(*) = 0 não deve ser tratada como apuração zerada só porque a resposta tem uma linha.

Usuário confirmou rotulo vazio após a correção SQLite: aceite apenas do subcenário textual de NU-01. O roteiro foi ampliado para NU-01 a NU-18, com expectativas antigas revistas, consultas de controle, mapeamento de KPIs, escopo fora dos KPIs e homologação. Não há aceite geral de nulos; KPIs elegíveis, eventual exceção explícita e apresentação da ausência dependem de definição. Nesta revisão, somente documentação foi alterada; o fallback de produção ainda está pendente de correção.


### Aceite específico do primeiro lote NU e correção do roteiro

O usuário esclareceu que NU-01 numérico deve exibir 0 na tabela e NU-03 deve exibir 0 no Número para a linha null apresentada. NU-01 controle/API, NU-02 cópia sem zero e NU-04 sem linhas também foram aceitos. O agente havia mudado esses critérios por interpretação da descrição da issue sem confirmar a expectativa; o roteiro foi corrigido conforme a orientação explícita atual. Dashboard de NU-03 e menu de NU-02 não foram discriminados no retorno. NU-05 tem evidência parcial (53.41 contra ponto nulo normalizado para 0, variação +∞%); opções de formatação não comprovam a segunda execução. Demais casos, em especial SUM sem registros e escopo dos KPIs, permanecem pendentes de conciliação/validação, sem aprovação implícita e sem mudança de código nesta atualização.


### Segunda execução de NU-05

Capturas confirmam a consulta com pos = 1, último valor null na API e Tendência exibindo 0 na data mais recente (15/04/2028), com −100% em relação ao anterior 70.08. Cenário confirmado pelo retorno do usuário. A apresentação +∞% da primeira execução não teve aceite específico; demais cenários não são aprovados por esta evidência. Atualização somente documental.


### NU-08/10 — Número com agregação nula sem tipo inferível

Usuário aprovou NU-06 na pergunta/dashboard, NU-07 na pergunta/dashboard e NU-09 nas consultas. Definiu que NU-08 (SUM sem registros de origem) e NU-10 (SUM de valores todos null) devem exibir 0 no Número; ambos mostravam “nulo”. Essa orientação explícita substitui a pendência de definição desses exemplos.

Adicionado normalizeScalarNull, separado do formatter numérico compartilhado: somente Número aceita null com tipo desconhecido como 0 quando existe uma linha. Zero linhas continua Sem resultados. Texto/booleano com tipo conhecido e valores não nulos permanecem preservados; metadados/resultados da consulta não são modificados. A regra de tabela e a normalização da Tendência não foram ampliadas nesta correção. Testes adicionados para null desconhecido no componente Scalar, preservação do resultado e do comportamento da tabela, tipos conhecidos e valores preenchidos. NU-08/10 continuam pendentes de reteste manual.

Validação da correção de NU-08/10: 4 suítes frontend, 133 testes aprovados (Scalar, SmartScalar, Table e helpers); ESLint com zero avisos e formatação dos quatro arquivos aprovados; `git diff --check` aprovado.

Checagem global de tipos após a correção de NU-08/10: **aprovada, código 0**, com `GOMEMLIMIT=2GiB GOGC=50 GOMAXPROCS=2 bun run type-check-pure`.


### Aceite do reteste de NU-08/10

Usuário aprovou os dois casos após a correção: 0 no Número e célula vazia na Tabela. Não houve relato adicional de dashboard/API nesse retorno. O aceite substitui a pendência de reteste dos registros anteriores; nenhuma alteração de código nesta etapa. Próximo lote de smoke NU-11 a NU-15, incluindo validação específica da apresentação +∞%.


### Retorno NU-11 a NU-15

NU-11 aprovado (0.0 na API e 0 na tela), NU-12 aprovado e NU-15 aprovado, incluindo a apresentação +∞% do roteiro. NU-13 tem evidência de falso representado como 0 no SQLite e aceite dos demais passos; metadata Boolean não mostrado, mantendo pendente a confirmação específica de tipagem. NU-14 aprovado para a Tabela e exportações CSV/JSON mostradas: campos vazios preservam ausência sem inventar zero; JSON exportado usa strings vazias e "12.5", sem comprovar mudança no dado da API. Demais visualizações de NU-14 não foram discriminadas. Nenhuma alteração de código nesta atualização. Restam NU-16/17/18 e pendências específicas indicadas no smoke.


### NU-13 e preparação de NU-16 — 11/11/2026

Usuário confirmou a validação prévia do tipo Boolean em NU-13, encerrando a pendência de metadata desse cenário. NU-16 ainda não executado: orientada a configuração de filtro Caixa de texto, Um único valor, padrão positivo e ligação à variável cenario do card SQL salvo. As capturas de configuração não indicam falha de execução. Nenhuma mudança de código nesta atualização.


### Conexão de NU-16 resolvida — 11/11/2026

Usuário confirmou funcionamento após conectar o filtro à variável cenario no card. Evidência mostra filtro visível fora da edição, positivo selecionado e resultado 12.5 na aba Guia 4. Tratava-se de conexão ausente no dashboard, resolvida por configuração; nenhuma mudança de código. Demais valores, recarga e usuário comum não foram discriminados no retorno e permanecem pendentes no smoke.


### Aceite da alternância de NU-16 — 11/11/2026

Usuário confirmou todos os valores com os resultados esperados no dashboard. NU-16 aprovado para alternância positivo/zero/nulo/sem_linhas; recarga e usuário comum não discriminados. Permanecem NU-17/18 e os subcenários específicos não confirmados no smoke. Atualização somente documental.


### Encaminhamento final desta leva — 11/11/2026

Usuário autorizou deixar NU-17/18 e os subcenários restantes para a equipe em homologação com o banco real, incluindo recarga e usuário comum de NU-16. Preservados os aceites locais; validação em homologação e build de produção seguem pendentes. Mensagem de commit proposta para a leva de nulos, correção de metadata SQLite, regressões e documentação. Nenhum commit criado pelo agente.
