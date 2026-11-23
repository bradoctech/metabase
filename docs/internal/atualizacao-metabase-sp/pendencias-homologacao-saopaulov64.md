# Pendências para homologação — saopaulov64

Versão Markdown do [roteiro em PDF](./pendencias-homologacao-saopaulov64.pdf), atualizado em **17/11/2026** com os dados de homologação informados pela equipe. Mantém os cenários, pré-requisitos e critérios de aceite do anexo; a paginação é exclusiva do PDF.

## Pendências para homologação

Roteiro para anexar à issue · revisão: 17/11/2026 · ambiente: homologação Saturno

**Estado inicial: PENDENTE.** Implementação e fechamento técnico local concluídos em 14/11/2026. Este roteiro reúne os cenários adiados e os complementos ainda sem evidência; não registra aprovação do ambiente de homologação.

### O que já passou localmente

545 testes frontend, 8 testes backend com 40 asserções, tipos, lint, formatação, auditoria e builds OSS de frontend, static-viz e JAR. O comando de versão do JAR foi executado com sucesso. A inicialização e as integrações no ambiente publicado devem ser conferidas pela equipe.

**Complemento local de 15/11/2026:** contraste da seleção/hover da navegação administrativa (AUD-011) aprovado pelo usuário e incluído no JAR reconstruído. A regressão acima pertence ao fechamento anterior e não foi integralmente reexecutada nessa reconstrução.

### Mapa de execução

| Grupo | Pendência | Página no PDF |
| --- | --- | --- |
| Identificação da rodada | Ambiente, commit informado e dados a confirmar | 2 |
| Ambiente, marca e home | Inicialização; marca/login; HD-05/10/12 | 3 |
| Filtros cascata | FC-05 a FC-08 com banco real | 4 |
| KPIs e nulos | NU-17/18; complementos NU-02/03/14/16 | 5 |
| Integrações e perfis | TS-02/10/13/15/24 | 6 |
| Assinaturas e conteúdo | Envio real por e-mail; Abono/Detalhamentos; aceite final | 7 |

### Identificação da rodada

| Campo | Preenchimento |
| --- | --- |
| URL / ambiente | Homologação Saturno — https://dev.saturno.aisolutions.tec.br/dashboards/ |
| Prefixo de acesso | `/dashboards/` — validar navegação, APIs e assets nesse caminho (HD-12) |
| Último commit do ambiente (informado pela equipe) | [51d8b02](https://github.com/bradoctech/metabase/commit/51d8b023495b9d0d22359d8003ce29d2fffab648) — `51d8b023495b9d0d22359d8003ce29d2fffab648` |
| Versão / hash do artefato publicado | A confirmar |
| Responsável pela homologação | Tiago Alves (QA) |
| Data de execução | A confirmar; 17/11/2026 é a data desta revisão documental |
| Banco / driver / versão | A confirmar |
| Perfis utilizados | A confirmar: administrador, usuário comum e perfil com permissão de monitoramento (TS-24) |
| Integrações / recursos disponíveis | A confirmar: SMTP, LDAP, upload CSV, transformações SQL e runtime Python |
| Conteúdo Abono / Detalhamentos | Aplicabilidade a confirmar com o responsável (HOM-04) |

**Commit informado:** 15/11/2026 às 15:55 GMT-4. Mensagem: `docs(saopaulov64): registrar rebuild OSS com AUD-011 e restauração do ambiente dev`. Data e mensagem conferidas no histórico Git local. Esse commit registra a documentação do rebuild; a versão e o hash do artefato em execução ainda precisam ser conferidos no ambiente.

**Referência técnica local atual:** código `9c0573d25947a36edd9b12eee7a8d891deace07e`, base oficial `bb612fac416`. JAR OSS reconstruído em 15/11/2026: `v0.64.1-SNAPSHOT (9c0573d)`, com AUD-011. SHA-256: `a03c08ce9d78f42657d34b7524f5194cc31ed01fe39cc93c718bbab9130e1885`. O artefato de 14/11, `v0.64.1-SNAPSHOT (175c377)`, é histórico. Conferir versão/commit e, quando disponível, hash do pacote efetivamente publicado; a URL informada não comprova qual artefato foi implantado.

**Consulta externa em 17/11/2026:** a tentativa automatizada de abrir a URL não concluiu a conexão HTTPS: o cliente informou certificado sem correspondência com o hostname (`curl: (60)`). A aplicação e sua versão não foram inspecionadas. Confirmar o acesso pela rede/navegador da equipe e registrar em HOM-01 se o problema se reproduz; este registro não determina a causa nem substitui a validação do ambiente.

### Como registrar o retorno

Informar **ID, OK / FAIL / PENDENTE / NÃO APLICÁVEL, usuário/perfil, cenário, tema e evidência**. Ausência de banco, permissão ou integração mantém o trecho pendente. “Não aplicável” exige justificativa. Capturas e respostas da API devem omitir senhas, tokens e dados pessoais desnecessários.

## Ambiente, marca e home

Complementar o aceite local apenas nos cenários abaixo.

### HOM-01 · Inicialização do pacote publicado

**Pré-requisito:** Deploy realizado pela equipe; acesso aos logs e à aplicação.

1. Abrir https://dev.saturno.aisolutions.tec.br/dashboards/ e conferir acesso HTTPS, versão/commit e término da inicialização no backend. Confirmar se a observação da consulta externa acima se reproduz no acesso da equipe.
2. Entrar com administrador e usuário comum autorizado; abrir uma pergunta e um dashboard que consultem o banco real.

**Aceite:** Acesso HTTPS sem erro de certificado, login, APIs e consultas funcionam sem erros de inicialização; versão publicada identificada e permissões preservadas.

### HOM-02 · Marca/login — complemento da checklist

**Pré-requisito:** Conta de teste e possibilidade de alternar tema e largura da janela.

1. Conferir login SP, brasão no login/AppBar, botão Entrar preto e hover vermelho de Esqueci minha senha.
2. Conferir + Novo preto, ausência do logo-gov junto ao título do dashboard, temas claro/escuro e janela estreita.

**Aceite:** Identidade SP e textos legíveis, sem cortes ou assets quebrados. Ilustrações genéricas permanecem coloridas. Registrar quais combinações foram exercitadas.

### HD-05 · Seletor de schema do raio-X

**Pré-requisito:** Banco não Sample com pelo menos dois schemas e sugestões de exploração elegíveis.

1. Na seção de raios-X da home, abrir o nome/seletor de schema e escolher outro.
2. Conferir atualização do nome/cards e retornar ao schema inicial.

**Aceite:** Sugestões acompanham a seleção sem erro. Não exigir persistência após recarregar; ausência de sugestões elegíveis impede este cenário.

### HD-10 · Cards sem fundo — ações e incorporação

**Pré-requisito:** Dashboard de teste; tipos de card e permissões disponíveis no ambiente.

1. O texto sem fundo já foi aceito. Complementar com ação e conteúdo incorporado sem fundo, quando esses tipos existirem.
2. Conferir menus, filtros e interações disponíveis, sem executar ações que alterem dados reais.

**Aceite:** Sem sombra/fundo indevido, com layout, controles e interação preservados. Tipo indisponível: registrar motivo.

### HD-12 · Instância no prefixo /dashboards/

**Pré-requisito:** Acesso à URL de homologação informada, com prefixo `/dashboards/`. Cenário previsto para esta rodada; confirmar o comportamento do proxy e da aplicação durante a execução.

1. A partir de https://dev.saturno.aisolutions.tec.br/dashboards/, abrir login, home, pergunta e dashboard; navegar entre as telas, recarregar uma rota interna e conferir redirecionamentos após login.
2. Conferir carregamento de brasão, fontes e imagens e chamadas de API; observar 404 no Network e caminhos que percam ou dupliquem o prefixo.

**Aceite:** Navegação, redirecionamentos, APIs e assets respeitam o prefixo `/dashboards/`, inclusive após recarga de rota interna. Se a equipe confirmar outra topologia de publicação, registrar o caminho efetivo e revisar a aplicabilidade com justificativa.

## Filtros em cascata

FC-01 a FC-04 aprovados localmente. Executar FC-05 a FC-08 no Query Builder.

Usar campos correlacionados do banco real: por exemplo A = Estado, B = Cidade e C = Endereço. Confirmar previamente que os valores escolhidos coexistem nos registros. A cascata automática desta leva é entre filtros irmãos suportados no mesmo estágio.

### FC-05 · Dois filtros e múltiplos valores

**Pré-requisito:** Três campos elegíveis, com igualdade e seleção múltipla disponíveis.

1. Aplicar A e B, escolhendo mais de um valor em um deles; abrir as opções de C.
2. No Network, conferir POST `/api/field/<id>/filtered-values`, constraints de A/B e preservação do array de valores.

**Aceite:** Opções de C coerentes com os filtros; resposta válida, sem 400/500 nem perda dos valores selecionados.

### FC-06 · Busca com contexto

**Pré-requisito:** Campo B configurado para busca de valores e filtro A aplicado.

1. Abrir B, digitar parte de um valor e inspecionar a requisição: constraints e query devem estar presentes.
2. Selecionar um resultado; reabrir e limpar a busca; conferir novamente as opções.

**Aceite:** Sugestões compatíveis com A; selecionar e limpar não causa falha nem perde o contexto.

### FC-07 · Picker do drill de coluna

**Pré-requisito:** Pergunta em tabela com A aplicado e menu de filtro na célula/coluna disponível.

1. Em uma coluna diferente de A, abrir Filtrar por esta coluna ou ação equivalente.
2. Conferir opções no picker, selecionar um valor e executar a pergunta.

**Aceite:** Picker mantém o contexto em cascata; filtro aplicado e resultado coerente, sem quebrar as ações da tabela.

### FC-08 · Número/faixa e relação entre tabelas

**Pré-requisito:** Campo numérico e, para a segunda parte, FK reconhecida no metadata.

1. Aplicar A numérico por valor/faixa e abrir B; conferir constraints e valores retornados.
2. Quando existir FK reconhecida, repetir com campos relacionados e confrontar as opções com os dados reais.

**Aceite:** Restrições numéricas preservadas; relação coerente com o metadata. Registrar separadamente a parte FK se não for executável.

### Limites deste transporte

Filtros de data/hora, nulo/sem valor, coordenadas e expressões não suportadas não entram na conversão. Joins arbitrários, SQL nativo, modelos e estágios anteriores não têm equivalência garantida. Filtros vinculados de dashboard continuam exigindo configuração própria.

Se todas as opções de B coexistirem com A, a lista pode não diminuir. Validar os valores e o payload antes de classificar o caso como falha.

## KPIs e valores nulos

NU-17/18 dependem do significado dos dados e do aceite da equipe/produto.

**Preservar os aceites existentes.** Nos exemplos locais aceitos: null numérico de NU-01 aparece como 0 na tabela; null textual fica vazio. Em Número, NU-03 e somas null de NU-08/10 aparecem como 0. Zero linhas permanece “Sem resultados”. Texto/booleano conhecidos mantêm seu significado; a API não deve ser reescrita para fabricar zeros.

### NU-17 · Mapear os KPIs e suas exceções

**Pré-requisito:** Equipe responsável pelo indicador e acesso à definição da métrica.

1. Listar cada KPI candidato: card/pergunta, consulta, driver, filtros e período.
2. Distinguir zero calculado, registros com valor null, agregação sem registros e consulta sem linhas. Conferir registros de origem e contagem de valores não nulos.
3. Confrontar cards elegíveis e não elegíveis. Registrar a condição explícita e a apresentação esperada, com responsável pelo aceite.

**Aceite:** Mapa aprovado por KPI, sem extrapolar os exemplos locais para toda métrica. Ter uma linha agregada não comprova existência de registros de origem.

### NU-18 · Validar com os dados reais

**Pré-requisito:** Mapeamento NU-17 e combinações de filtros reproduzíveis.

1. Para cada KPI, executar valor positivo, zero real, null e ausência de linhas quando forem cenários possíveis.
2. Comparar API, pergunta e dashboard. Conferir também datas e comparações da Tendência e os períodos ausentes.
3. Repetir nos drivers usados pelo cliente e registrar eventuais exceções para decisão do produto.

**Aceite:** Apresentação coerente com o mapa aprovado, sem fabricar períodos, alterar o dado original ou reutilizar resultado de filtro anterior.

### NU — complementos · Fechar a cobertura ainda não discriminada

**Pré-requisito:** Perguntas de teste e usuário comum com acesso autorizado.

1. NU-02: conferir menu/ações da célula; NU-03: repetir o exemplo numérico null em dashboard.
2. NU-14: identificar outras visualizações relevantes ainda não exercitadas e validar seu resultado sem estender automaticamente o fallback numérico.
3. NU-16: alternar positivo, zero, nulo e sem_linhas; recarregar e repetir com usuário comum. Resultado ausente não deve reter o valor anterior.

**Aceite:** Estados corretos após mudança de filtro/recarga; menus e permissões preservados. Cobertura registrada por componente e perfil.

### Ficha mínima por KPI

ID/URL • definição/consulta • driver • filtros/período • registros de origem • valores não nulos • rows/cols da API • significado do null • exibição esperada/observada • evidência • responsável pelo aceite.

## Integrações e perfis

Os formulários e estados locais já foram aceitos; validar agora as dependências reais.

### TS-02 · Opção CC/BCC

**Pré-requisito:** SMTP configurado no ambiente de homologação.

1. Abrir Admin → Configurações → E-mail e localizar o controle de destinatários CC/BCC.
2. Conferir rótulo e ajuda em português, sem alterar configuração apenas para testar a tradução.

**Aceite:** Texto “Adicionar destinatários como CC ou BCC” correto e controle funcional. Sem SMTP, manter o trecho pendente.

### TS-10 — complemento · Autenticação LDAP real

**Pré-requisito:** LDAP de homologação e conta/grupo de teste fornecidos pela equipe.

1. Usar a configuração prevista para homologação e autenticar a conta de teste.
2. Conferir e-mail/nome/sobrenome e, se configurado, associação a grupos; verificar o acesso esperado.

**Aceite:** Autenticação, atributos e grupos corretos. Traduções LDAP já aprovadas; este complemento cobre a integração, sem ampliar permissões.

### TS-13 · Upload CSV completo

**Pré-requisito:** Banco elegível, uploads habilitados e perfil autorizado.

1. Pelo grupo Dados → + → CSV, enviar um arquivo pequeno de teste, sem dados pessoais.
2. Abrir o resultado, consultar os registros e conferir acesso com os perfis previstos.

**Aceite:** Importação e consulta concluídas, sem oferta comercial, erro de permissão indevido ou exposição a usuário não autorizado.

### TS-15 · Transformações e Python, se aplicável

**Pré-requisito:** Banco compatível e funções habilitadas pelos gates reais; para Python, runtime configurado.

1. No Data Studio, conferir lista/menu e abrir o editor permitido; criar transformação de teste em destino dedicado.
2. Executar e verificar status/saída. Repetir o fluxo Python somente se disponível e previsto no ambiente.

**Aceite:** Funções liberadas operam sem upsell; funções indisponíveis continuam protegidas. Separar no retorno SQL, Python e partes não exercitadas.

### TS-24 · Monitor com perfil específico

**Pré-requisito:** Usuário não administrador com permissão explícita de monitoramento.

1. Comparar menu e acesso às ferramentas autorizadas com o administrador; testar rotas diretas relevantes.
2. Se houver diagnóstico licenciado, conferir acesso/link sem executar ou cancelar tarefas reais.

**Aceite:** Ferramentas permitidas acessíveis, sem conceder funções administrativas. Perfil inexistente mantém TS-24 pendente.

## Assinaturas e aceite da equipe

Conclusão da rodada e encaminhamento das dependências ainda indisponíveis.

### HOM-03 · AX-10 / PA-10 · Envio real de assinatura por e-mail

**Pré-requisito:** SMTP configurado, destinatários de teste e assinatura habilitada.

1. Preparar pergunta/dashboard de teste com gráfico horizontal, Área e cores SP explicitamente escolhidas.
2. Enviar uma assinatura de teste e conferir recebimento, anexos/imagens e renderização aplicáveis ao fluxo configurado.
3. Conferir dados, datas, rótulos abreviados, legendas, cores e layout. Registrar se o envio foi imediato ou agendado.

**Aceite:** Entrega e renderização corretas, sem erro no static-viz. PDF/PNG não precisam de hover; CSV/JSON, quando incluídos, preservam os dados completos.

### HOM-04 · Abono e Detalhamentos

**Pré-requisito:** Primeiro confirmar se o conteúdo faz parte da homologação.

1. Localizar, se existentes, o dashboard Abono de Permanência e a aba/conteúdo Detalhamentos por Situação.
2. Conferir acesso, dados, filtros e navegação com os responsáveis pelo conteúdo. Não importar seeds apenas para satisfazer este roteiro.

**Aceite:** Conteúdo aplicável abre e funciona. Se não existir nem fizer parte da entrega, registrar NÃO APLICÁVEL com aceite do responsável.

### Registro por cenário

| Campo | Preencher na issue / evidência anexa |
| --- | --- |
| ID e resultado | _____________________ · OK / FAIL / PENDENTE / NÃO APLICÁVEL |
| Contexto | Usuário/perfil, banco/driver, filtros, tema e build |
| Evidência | Captura, consulta, trecho necessário da API ou log |
| Retorno | Esperado × observado; motivo do impedimento, se houver |
| Responsável / data | ________________________________________________ |

### Condição para encerrar a homologação

Consolidar os resultados por ID e subcenário. Falhas devem ter evidência e encaminhamento para correção/reteste. Pendências devem indicar dependência e responsável; exclusões precisam de justificativa e aceite da equipe/produto. Nenhum cenário é aprovado apenas porque a tela abriu ou o build passou.

**Tarefa posterior separada:** substituir a assinatura visual “Metabase” por “Dashboards SP + brasão” em incorporação e PDF/PNG. Documentos na branch **EDD-1523v64**: `pendencia-assinatura-dashboards-sp.md` e PDF. A mudança de marca não integra esta rodada nem deve ser presumida como já implementada.

**Fontes no repositório:**  
[smoke-saopaulov64.md](./smoke-saopaulov64.md)  
[fechamento-tecnico-saopaulov64.md](./fechamento-tecnico-saopaulov64.md)  
[checklist-smoke-test.md](./checklist-smoke-test.md)  
HOM-01 a HOM-04 são identificadores complementares deste anexo; os IDs HD/FC/NU/TS preservam o roteiro original.
