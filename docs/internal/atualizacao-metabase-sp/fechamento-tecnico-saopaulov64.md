# Fechamento técnico — saopaulov64

**Fechamento técnico local concluído em 14/11/2026.** Rodada autorizada pelo usuário após os smokes de traduções/política SP. Este registro consolida a validação técnica; os aceites visuais e suas limitações continuam em [smoke-saopaulov64.md](./smoke-saopaulov64.md).

## Referências e escopo

- Branch: `saopaulov64`; código validado: `175c377fbad416e43a5bd1d93a2df1ae0b9080c9`.
- Base oficial: `metabase-64-oficial`, `bb612fac416eb1dde36c32e5a2d224280d09d7b6`.
- Edição de produção: **OSS**, conforme o frontend usado no ambiente local.
- Reaplicação seletiva sobre a base oficial, sem merge do histórico antigo de São Paulo.
- Nenhuma mudança de código de produto nesta rodada. As alterações do fechamento são documentação e manutenção das listas canônicas.
- Nenhum commit, push, publicação de imagem ou troca de branch executado pelo agente.

## Validações executadas

| Verificação | Resultado e alcance |
| --- | --- |
| Frontend | **46 suítes, 545 testes aprovados**; todas as suítes unitárias alteradas em relação à base oficial |
| Backend | **8 testes, 40 asserções, 0 falhas/erros**; nomes localizados de coleção, tipos SQLite, annotate e filtros cascata HTTP/permissões |
| Tipos | `bun run type-check-pure` global aprovado |
| Lint | ESLint sem avisos nos 188 arquivos TS/TSX/MJS alterados |
| Estilos | Stylelint aprovado nos 13 CSS e dois styled-components TSX alterados |
| Formatação | Oxfmt aprovado nos 201 arquivos TS/TSX/MJS/CSS alterados |
| Scripts shell | Sintaxe do script de transporte e hook aprovada |
| ClojureScript release | 428 arquivos, 171 compilados, sem avisos; código 0 |
| Frontend de produção OSS | Rspack e iframe SDK compilados; código 0; apenas dois avisos de tamanho de assets/entrypoint |
| Static-viz de produção | Compilado novamente **após** o frontend; código 0 |
| Versão e idiomas | Etapas oficiais `:version :translations` aprovadas; catálogos regenerados |
| Licenças de terceiros | Etapa oficial `:licenses` aprovada |
| Backend/drivers e JAR | **Aprovado**, código 0; compilação AOT em 149,9 s e build completo do JAR em 397,6 s |
| Execução do pacote | `java -jar target/uberjar/metabase.jar version` aprovado, código 0; OSS `v0.64.1-SNAPSHOT (175c377)` |

As regressões backend usaram o runner de testes com H2 em memória e porta dinâmica, sem executar migrações no banco de aplicação do usuário. A primeira execução restrita não pôde abrir o socket Jetty; a repetição com acesso local necessário passou. A primeira tentativa de JAR foi interrompida (143); sua repetição consta no resultado final, sem tratar interrupção como aprovação. A repetição terminou com código 0.

Os testes são regressões direcionadas, não a suíte integral do Metabase. Não foram executados todos os cenários E2E nem validada uma instalação de produção.

## Auditoria do transporte

O scan somente de leitura, com as referências explicitamente apontadas para esta base/branch, encontrou **stale=0, missing=0, orphan=0, hybrid=0**, com **306 caminhos protegidos** no diff de código consolidado. Todos os caminhos dos manifestos das etapas existem. Após a manutenção das listas, nenhuma entrada exata ativa aponta para arquivo ausente; o scan final repetido manteve os mesmos resultados. O scan verifica cobertura pelo inventário; a semântica é coberta pelos testes e smokes registrados, não pelo scan sozinho.

As listas continham 11 referências históricas a arquivos ausentes da branch: dez documentos/seeds de Abono/Detalhamentos e `bin/build-and-push-docker.sh`. Foram mantidas como comentários, fora das entradas ativas. Nenhum conteúdo demo ou script de publicação foi importado para satisfazer o inventário.

A busca nos fontes, recursos e fixtures não encontrou os conteúdos demo Abono de Permanência/Detalhamentos por Situação. Isso não prova sua ausência no banco de aplicação do cliente, que não foi consultado nesta auditoria. A aplicabilidade continua para homologação. As ilustrações genéricas de `resources/frontend_client/app/img` permanecem coloridas como no upstream; o diff contém apenas os quatro assets de login SP adicionados nessa pasta.

## Artefato validado

- Caminho local: `target/uberjar/metabase.jar` (ignorado pelo Git).
- Tamanho: **962.040.805 bytes**, aproximadamente 918 MiB.
- SHA-256: `e73231971bb6d681775a1fc02ec2d69f8b7025a2ed53a39a315f108c5ffc1290`.
- JDK do build e da execução: **OpenJDK 25.0.3**.
- Manifesto com `Main-Class: metabase.core.bootstrap`; versão/hash confirmados pela execução do próprio JAR.
- Inspeção confirmou 279 assets JS/CSS em `frontend_client/app/dist`, bundle static-viz, catálogo `pt_BR.json`, brasão, Rawline e classes compiladas de Collection, SQLite, annotate, filtros e PostgreSQL.
- Nesta versão os drivers integram o JAR. Oracle e Vertica são incluídos como fontes, conforme o pipeline oficial, para compilação quando seus JDBC estiverem disponíveis; não foram validadas conexões reais desses drivers.

O comando de versão usou caminhos temporários de banco/plugins e não inicia a aplicação nem executa migrações. Não substitui um smoke de inicialização e consultas no ambiente de homologação.

## Reprodução e evidências locais

Logs e relatórios estão em `.merge-sp/fechamento-saopaulov64/`, ignorados pelo Git. Principais arquivos: `tests-frontend.log`, `tests-backend-retry.log`, `types.log`, `lint.log`, `stylelint.log`, `format.log`, `token-scan.log`, `build-cljs.log`, `build-frontend-oss.log`, `build-static-viz-final.log`, `build-version-i18n.log`, `build-licenses.log`, `build-backend-uberjar-retry.log`, `jar-version.log`, `jar-inspection.json` e `scan-report.md`.

A geração do frontend limpa o diretório de saída. Por isso a sequência final foi **ClojureScript → frontend OSS → static-viz → empacotamento**, preservando o bundle estático no JAR.

Comandos de produção usados, a partir da raiz:

```bash
mise exec -- env JAVA_TOOL_OPTIONS='-Xmx2048m -XX:ActiveProcessorCount=2' bun run build-release:cljs
mise exec -- env MB_EDITION=oss WEBPACK_BUNDLE=production RSPACK_WORKER_THREADS=1 NODE_OPTIONS=--max-old-space-size=4096 bun --bun run build-release:js
mise exec -- env MB_EDITION=oss WEBPACK_BUNDLE=production RSPACK_WORKER_THREADS=1 NODE_OPTIONS=--max-old-space-size=3072 bun --bun run build-release:static-viz
mise exec -- env JAVA_TOOL_OPTIONS='-Xmx1536m -XX:ActiveProcessorCount=2' clojure -X:build:build/all :edition :oss :steps '[:version :translations]'
mise exec -- env JAVA_TOOL_OPTIONS='-Xmx1536m -XX:ActiveProcessorCount=2' clojure -X:drivers:build:build/all :edition :oss :steps '[:licenses]'
mise exec -- env JAVA_TOOL_OPTIONS='-Xmx3072m -XX:ActiveProcessorCount=2' clojure -X:drivers:build:build/uberjar :edition :oss
```

A versão gerada automaticamente é `v0.64.1-SNAPSHOT`, hash `175c377`, data `2026-11-14`. É a identificação local produzida pelo helper oficial, sem criação de tag ou release. Catálogos e licenças foram gerados nos caminhos de build ignorados; o gerador de idiomas relata violações preexistentes do catálogo (195 globais, uma pt-BR), sem falha da etapa. Avisos ambientais de cache Maven/cookies não equivalem a falha quando a etapa termina com código 0.

A checagem de segredos dos sete documentos/listas desta rodada passou; `git diff --check` também. O hook completo não foi executado sobre um índice vazio para simular um commit: as verificações pertinentes foram chamadas diretamente, sem adicionar arquivos ao staged.

## Pendências encaminhadas à homologação

| Área | Pendente / condição |
| --- | --- |
| Home/dashboard | HD-05 com múltiplos schemas; HD-12 se houver subdiretório; ações/embedding sem fundo de HD-10 sem evidência específica |
| Filtros cascata | FC-05 a FC-08 com a equipe/banco real |
| Nulls | NU-17/18: mapear KPIs e significado do dado no banco real; subcenários ainda não discriminados, incluindo recarga/usuário comum de NU-16, conforme adiamento autorizado |
| Traduções de E-mail | CC/BCC de TS-02 com SMTP configurado |
| Data Studio | Upload completo de TS-13; lista/menu/editor/execução de transformações de TS-15 com banco e infraestrutura compatíveis |
| Monitor | TS-24 com perfil não administrador que tenha permissão explícita de monitoramento |
| Integrações | Envio real de assinaturas por e-mail, conexões LDAP/SMTP e fluxos Python não exercitados localmente |
| Conteúdo demo | Conferir aplicabilidade de Abono/Detalhamentos no ambiente do cliente |
| Marca/login | Complementar cenários não discriminados pelo aceite geral anterior, conforme checklist canônica |

Os OK do usuário mantêm o alcance registrado por cenário; os adiamentos não viram aprovação por causa de um build bem-sucedido. O build local OSS não inclui publicação Docker, deploy, construção do runtime Python ou empacotamento EE.

A futura assinatura **Dashboards SP + brasão**, em incorporação e exportações PDF/PNG, permanece na branch **`EDD-1523v64`**, nos arquivos `pendencia-assinatura-dashboards-sp.md` e `.pdf`. Não foi incorporada nem implementada em `saopaulov64`.
