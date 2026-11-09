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
- Build de produção e smoke completo: **pendentes para a entrega do transporte SP**; a etapa 2 foi aplicada e a etapa 3 está aplicada com smoke pendente e as etapas 4–6 ainda não foram executadas.

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
