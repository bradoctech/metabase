---
title: PostgreSQL
---

# PostgreSQL

> Esta página explica como conectar o PostgreSQL como uma fonte de dados. Para usá-lo como banco de dados da aplicação Metabase, consulte [Configuração do banco de dados da aplicação](../../installation-and-operation/configuring-application-database.md).

Para adicionar uma conexão, clique no ícone de grade no canto superior direito e acesse **Administração** > **Bancos de dados** > **Adicionar um banco de dados**.

Preencha os campos e clique em **Salvar alterações** no final da página.

## Versões compatíveis

O Metabase oferece suporte desde a versão mais antiga do PostgreSQL ainda mantida até a versão estável mais recente. Consulte as [versões do PostgreSQL](https://www.postgresql.org/support/versioning/).

## Conectar ao Supabase

Para conectar um banco de dados Supabase, selecione PostgreSQL. Para mais detalhes, consulte a [documentação do Supabase](https://supabase.com/docs/guides/database/metabase).

## Conexão e sincronização

Após conectar um banco de dados, você verá a seção "Conexão e sincronização", que mostra o estado atual da conexão e as opções para gerenciá-la.

Nessa seção, você pode [sincronizar o esquema do banco de dados e verificar novamente os valores dos campos](../sync-scan.md), além de editar os detalhes da conexão.

## Editar detalhes da conexão

Você pode editar essas configurações a qualquer momento. Lembre-se de salvar as alterações.

### String de conexão

Cole uma string de conexão aqui para preencher automaticamente os demais campos abaixo.

### Nome de exibição

O nome do banco de dados exibido na interface do Metabase.

### Host

O endereço IP ou o nome de domínio do banco de dados (por exemplo, esc.mydatabase.com).

### Porta

A porta do banco de dados. Por exemplo, 5432.

### Nome do banco de dados

O nome do banco de dados ao qual você está se conectando.

### Nome de usuário

O nome de usuário da conta usada para conectar ao banco de dados. Você pode configurar várias conexões com o mesmo banco usando contas diferentes, cada uma com conjuntos distintos de [privilégios](../users-roles-privileges.md).

### Senha

A senha do usuário usado para conectar ao banco de dados.

### Usar um provedor de autenticação

Em vez de uma senha, você pode se autenticar com um provedor compatível.

Disponível apenas nos planos Pro e Enterprise em instalações próprias.

#### Identidade Gerenciada do Azure

Para usar a Identidade Gerenciada do Azure, informe seu [ID do cliente](https://learn.microsoft.com/en-us/azure/postgresql/flexible-server/how-to-connect-with-managed-identity#retrieve-the-access-token-from-the-azure-instance-metadata-service).

#### OAuth

Para usar OAuth como provedor, informe:

- URL do token de autenticação
- Cabeçalhos da requisição do token de autenticação (um mapa JSON)

#### Autenticação IAM

Para conectar instâncias do Amazon RDS usando autenticação IAM em vez de senha, consulte [Autenticação IAM para AWS RDS](./aws-rds.md#iam-authentication).

### Esquemas

Você pode especificar quais esquemas deseja sincronizar e verificar. As opções são:

- Todos
- Apenas estes...
- Todos, exceto...

Nas opções **Apenas estes** e **Todos, exceto**, informe uma lista de valores separados por vírgulas para indicar quais esquemas incluir ou excluir. Por exemplo:

```
foo,bar,baz
```

Você pode usar o curinga `*` para selecionar vários esquemas.

Suponha que existam três esquemas: foo, bar e baz.

- Se selecionar **Apenas estes...** e informar `b*`, os esquemas bar e baz serão sincronizados.
- Se selecionar **Todos, exceto...** e informar `b*`, apenas foo será sincronizado.

Somente o curinga `*` é aceito. Não é possível usar outros caracteres especiais ou expressões regulares.

### Usar uma conexão segura (SSL)

O Metabase tenta primeiro conectar ao banco de dados com SSL. Se isso não funcionar, tenta sem SSL. Quando a conexão SSL é possível, ela se torna a configuração padrão do banco. Você pode alterar essa configuração depois, mas recomendamos manter o SSL ativado para proteger seus dados.

#### Modo SSL

Os bancos PostgreSQL oferecem diferentes níveis de segurança para suas conexões, com custos de processamento distintos.

As opções de modo SSL incluem:

- allow
- prefer
- require
- verify-ca
- verify-full

Consulte a tabela de [modos SSL](https://jdbc.postgresql.org/documentation/ssl/#configuring-the-client) na documentação do PostgreSQL e selecione a opção adequada.

#### Certificado raiz SSL (PEM)

Se selecionar o modo SSL "verify-ca" ou "verify-full", será necessário especificar um certificado raiz (PEM). Você pode usar um **Caminho de arquivo local** ou um **Caminho de arquivo enviado**. No Metabase Cloud, selecione **Caminho de arquivo enviado** e envie o certificado.

#### Autenticar certificado do cliente

Ative esta opção para exibir as opções de certificado do cliente.

#### Certificado SSL do cliente (PEM)

Você pode usar um **Caminho de arquivo local** ou um **Caminho de arquivo enviado**. No Metabase Cloud, selecione **Caminho de arquivo enviado** e envie o certificado.

#### Chave SSL do cliente (PKCS-8/DER)

Você também pode usar um **Caminho de arquivo local** ou um **Caminho de arquivo enviado**. No Metabase Cloud, selecione **Caminho de arquivo enviado** e envie o certificado. Informe também a **Senha da chave SSL do cliente**.

A chave privada deve ser PKCS8 e estar armazenada no formato DER.

Se você tiver uma chave SSL do cliente em PEM, poderá convertê-la para PKCS-8/DER usando [openssl](https://www.openssl.org/). Por exemplo:

```
openssl pkcs8 -topk8 -inform PEM -outform DER -in client-key.pem -out client-key.der -nocrypt
```

Se você usa GCP e emitiu certificados de cliente, todos os arquivos serão fornecidos em PEM. Basta converter client-key.pem em client-key.der para o campo "Chave SSL do cliente".

### Usar um túnel SSH

Consulte o [guia de tunelamento SSH](../ssh-tunnel.md).

### Expandir colunas JSON

Em bancos PostgreSQL, o Metabase pode expandir colunas JSON em campos individuais, criando uma tabela em que cada chave JSON se torna uma coluna. A expansão de JSON vem ativada por padrão, mas você pode desativá-la se o desempenho estiver lento.

Quando a expansão de JSON está ativada, você também pode configurá-la para colunas individuais nos [metadados da tabela](../../data-modeling/metadata/metadata-editing.md#unfold-json).

### Opções adicionais da string de conexão JDBC

Você pode acrescentar opções à string de conexão usada pelo Metabase para conectar ao banco de dados. Use o formato:

```
options=-c%20key=value
```

As URIs de conexão do PostgreSQL exigem [codificação percentual](https://developer.mozilla.org/en-US/docs/Glossary/Percent-encoding) para espaços e símbolos.

### Executar novamente consultas em explorações simples

Desative esta opção se quiser que as pessoas cliquem em **Executar** (o botão de reprodução) antes de aplicar seleções de [resumo](../../questions/query-builder/summarizing-and-grouping.md) ou filtros.

Por padrão, o Metabase executa uma consulta assim que você escolhe um agrupamento no menu **Resumir** ou uma condição de filtro no [menu de detalhamento](../../questions/visualizations/drill-through.md). Se o banco de dados estiver lento, desative a execução automática para evitar carregar dados a cada clique.

### Escolher quando sincronizar e verificar valores

Consulte [sincronizações e verificações](../sync-scan.md#choose-when-syncs-and-scans-happen).

### Reanalisar periodicamente os perfis das tabelas

> A análise periódica dos perfis aumenta a carga no banco de dados.

Ative esta opção para analisar uma amostra de valores toda vez que o Metabase executar uma [sincronização](../sync-scan.md#how-database-syncs-work).

Uma consulta de análise de perfil examina as primeiras 10.000 linhas de cada coluna. Esses dados permitem estimar a quantidade de valores únicos e identificar valores mínimos e máximos em colunas numéricas e de data e hora, entre outras características. Se a opção estiver desativada, o Metabase fará essa análise apenas uma vez, durante a configuração inicial.

## Conexão de escrita

Configure uma conexão adicional para operações de escrita. Consulte [Conexões de escrita](../writable-connection.md).

## Recursos de modelos

Escolha se deseja habilitar recursos relacionados aos [modelos do Metabase](../../data-modeling/models/models.md). Esses recursos geralmente exigem que a conta usada para conectar ao banco tenha permissões de leitura e escrita.

### Ações de modelos

Ative esta configuração para permitir a execução de [ações](../../data-modeling/models/actions/introduction.md) em modelos criados a partir desses dados. As ações podem ler, gravar e excluir dados. O usuário do banco precisará de permissões de escrita.

### Persistência de modelos

O Metabase criará tabelas com os dados dos modelos e as atualizará conforme o agendamento definido por você. Para habilitar a [persistência de modelos](../../data-modeling/models/model-persistence.md), conceda às credenciais desta conexão permissões de leitura e escrita em um esquema fornecido pelo Metabase.

## Dados de tabela editáveis

Ative esta configuração para permitir a edição de dados de tabelas diretamente no Metabase. Os administradores poderão criar, atualizar e excluir registros pela interface.

A conexão com o banco precisará de permissões de escrita. A conta usada para conectar o Metabase ao banco deve ter os privilégios necessários para modificar os dados das tabelas que você deseja tornar editáveis.

Consulte [privilégios](../users-roles-privileges.md).

## Roteamento de bancos de dados

Com o roteamento de bancos de dados, um administrador pode criar uma pergunta uma única vez usando um banco, e a consulta será executada em outro banco com o mesmo esquema conforme a pessoa que estiver visualizando a pergunta.

Consulte [Roteamento de bancos de dados](../../permissions/database-routing.md).

## Zona de perigo

Consulte [Zona de perigo](../danger-zone.md).

## Leitura complementar

- [Gerenciamento de bancos de dados](../../databases/connecting.md)
- [Edição de metadados](../../data-modeling/metadata/metadata-editing.md)
- [Modelos](../../data-modeling/models/models.md)
- [Configuração de permissões de acesso aos dados](../../permissions/data.md)
