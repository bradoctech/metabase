/* eslint-disable metabase/no-literal-metabase-strings -- Exact upstream driver msgids for connection admin/setup forms. */
import { t } from "ttag";

import type { EngineField } from "metabase-types/api";

// Driver manifests contain plain strings, outside ttag's static extraction.
// Keep literal tagged templates here so future catalog rebuilds retain these keys.
// Evaluate each translation on demand to follow locale changes without caching.
const DRIVER_MESSAGES = new Map<string, () => string>([
  ["Access key", () => t`Access key`],
  ["Account name", () => t`Account name`],
  [
    "Additional Athena connection string options",
    () => t`Additional Athena connection string options`,
  ],
  [
    "Additional JDBC connection string options",
    () => t`Additional JDBC connection string options`,
  ],
  ["Additional JDBC options", () => t`Additional JDBC options`],
  [
    "Additional connection string options (optional)",
    () => t`Additional connection string options (optional)`,
  ],
  ["Allow unfolding of JSON columns", () => t`Allow unfolding of JSON columns`],
  ["Auth provider", () => t`Auth provider`],
  ["Auth token URL", () => t`Auth token URL`],
  [
    "Auth token request headers (a JSON map)",
    () => t`Auth token request headers (a JSON map)`,
  ],
  [
    "Authenticate client certificate?",
    () => t`Authenticate client certificate?`,
  ],
  ["Authenticate with Kerberos", () => t`Authenticate with Kerberos`],
  [
    "Authenticate with user and password",
    () => t`Authenticate with user and password`,
  ],
  ["Authentication", () => t`Authentication`],
  [
    "Authentication database (optional)",
    () => t`Authentication database (optional)`,
  ],
  ["B-Tree", () => t`B-Tree`],
  ["Basic authentication password.", () => t`Basic authentication password.`],
  ["Basic authentication username.", () => t`Basic authentication username.`],
  [
    "By default, Metabase does a lightweight hourly sync and an intensive daily scan of field values. If you have a large database, turn this on to make changes.",
    () =>
      t`By default, Metabase does a lightweight hourly sync and an intensive daily scan of field values. If you have a large database, turn this on to make changes.`,
  ],
  ["Catalog", () => t`Catalog`],
  ["Catalogs and Schemas", () => t`Catalogs and Schemas`],
  [
    "Choose when syncs and scans happen",
    () => t`Choose when syncs and scans happen`,
  ],
  [
    "ClickHouse settings (comma-separated)",
    () => t`ClickHouse settings (comma-separated)`,
  ],
  ["Client ID", () => t`Client ID`],
  [
    "Client SSL certificate chain (PEM)",
    () => t`Client SSL certificate chain (PEM)`,
  ],
  ["Client SSL private key (PEM)", () => t`Client SSL private key (PEM)`],
  ["Columns", () => t`Columns`],
  ["Database instance name", () => t`Database instance name`],
  ["Database name", () => t`Database name`],
  ["Database name (case sensitive)", () => t`Database name (case sensitive)`],
  ["Database syncing", () => t`Database syncing`],
  ["Databases", () => t`Databases`],
  ["Default Catalog", () => t`Default Catalog`],
  ["Default database", () => t`Default database`],
  [
    "Default impersonation user (required for impersonation if the connection's user cannot be impersonated)",
    () =>
      t`Default impersonation user (required for impersonation if the connection's user cannot be impersonated)`,
  ],
  [
    "Disable system wide proxy settings",
    () => t`Disable system wide proxy settings`,
  ],
  ["Enable multiple catalogs", () => t`Enable multiple catalogs`],
  ["Enable multiple databases", () => t`Enable multiple databases`],
  [
    "Enable syncing and scanning tables from multiple ClickHouse databases except the system ones.",
    () =>
      t`Enable syncing and scanning tables from multiple ClickHouse databases except the system ones.`,
  ],
  [
    "Enforce uniqueness across rows for indexed columns.",
    () => t`Enforce uniqueness across rows for indexed columns.`,
  ],
  [
    'Enter your Account ID with the region that your Snowflake cluster is running on e.g. "xxxxxxxx.us-east-2.aws". Some regions don\'t have this suffix.',
    () =>
      t`Enter your Account ID with the region that your Snowflake cluster is running on e.g. "xxxxxxxx.us-east-2.aws". Some regions don't have this suffix.`,
  ],
  ["Filename", () => t`Filename`],
  [
    "For M2M OAuth authentication, corresponds to the service principal's Client ID.",
    () =>
      t`For M2M OAuth authentication, corresponds to the service principal's Client ID.`,
  ],
  [
    "Found in SQL Warehouses > Connection details",
    () => t`Found in SQL Warehouses > Connection details`,
  ],
  ["Full hostname", () => t`Full hostname`],
  ["Full-text", () => t`Full-text`],
  ["Give your index a name", () => t`Give your index a name`],
  ["Granularity", () => t`Granularity`],
  ["HTTP Path", () => t`HTTP Path`],
  ["Host", () => t`Host`],
  [
    "If your user doesn't have a default warehouse, enter the warehouse to connect to.",
    () =>
      t`If your user doesn't have a default warehouse, enter the warehouse to connect to.`,
  ],
  [
    "Include User ID and query hash in queries",
    () => t`Include User ID and query hash in queries`,
  ],
  ["Kerberos configuration file", () => t`Kerberos configuration file`],
  ["Kerberos coordinator service", () => t`Kerberos coordinator service`],
  ["Kerberos credential cache file", () => t`Kerberos credential cache file`],
  ["Kerberos keytab file", () => t`Kerberos keytab file`],
  ["Kerberos principal", () => t`Kerberos principal`],
  ["Keystore", () => t`Keystore`],
  ["Keystore (PKCS12 or JKS)", () => t`Keystore (PKCS12 or JKS)`],
  ["Keystore password", () => t`Keystore password`],
  [
    "Leave empty to use Dynamic Ports, or input specific port. Standard port is 1433.",
    () =>
      t`Leave empty to use Dynamic Ports, or input specific port. Standard port is 1433.`,
  ],
  [
    "Leave this empty to authorize using AWS Credentials Provider Chain (Instance Profiles or IAM Roles for Tasks)",
    () =>
      t`Leave this empty to authorize using AWS Credentials Provider Chain (Instance Profiles or IAM Roles for Tasks)`,
  ],
  [
    "Max open HTTP connections in the JDBC driver (default: 100)",
    () => t`Max open HTTP connections in the JDBC driver (default: 100)`,
  ],
  [
    "OAuth Secret for M2M OAuth authentication.",
    () => t`OAuth Secret for M2M OAuth authentication.`,
  ],
  [
    "Only add tables to Metabase that come from a specific schema.",
    () => t`Only add tables to Metabase that come from a specific schema.`,
  ],
  ["Optimized prepared statements", () => t`Optimized prepared statements`],
  [
    "Optionally filter which databases are visible.",
    () => t`Optionally filter which databases are visible.`,
  ],
  [
    "Optionally filter which schemas are visible.",
    () => t`Optionally filter which schemas are visible.`,
  ],
  ["Oracle service name", () => t`Oracle service name`],
  ["Oracle system ID (SID)", () => t`Oracle system ID (SID)`],
  ["Passphrase for SSH private key", () => t`Passphrase for SSH private key`],
  ["Password", () => t`Password`],
  ["Paste your connection string", () => t`Paste your connection string`],
  [
    "Periodically refingerprint tables",
    () => t`Periodically refingerprint tables`,
  ],
  ["Personal Access Token", () => t`Personal Access Token`],
  [
    "Personal Access Token for authentication. Not required if using OAuth M2M.",
    () =>
      t`Personal Access Token for authentication. Not required if using OAuth M2M.`,
  ],
  ["Port", () => t`Port`],
  [
    "Presto Catalogs contain schemas and reference data sources via a connector.",
    () =>
      t`Presto Catalogs contain schemas and reference data sources via a connector.`,
  ],
  [
    "Presto coordinator Kerberos service principal pattern",
    () => t`Presto coordinator Kerberos service principal pattern`,
  ],
  ["RSA private key (PKCS#8/.p8)", () => t`RSA private key (PKCS#8/.p8)`],
  ["Region", () => t`Region`],
  [
    "Requires Starburst Galaxy, Starburst Enterprise (version 420-e or higher), or Trino (version 418 or higher)",
    () =>
      t`Requires Starburst Galaxy, Starburst Enterprise (version 420-e or higher), or Trino (version 418 or higher)`,
  ],
  [
    "Rerun queries for simple explorations",
    () => t`Rerun queries for simple explorations`,
  ],
  ["Role (optional)", () => t`Role (optional)`],
  [
    "Role (optional, required for connection impersonation)",
    () => t`Role (optional, required for connection impersonation)`,
  ],
  ["Router node port", () => t`Router node port`],
  ["S3 staging directory", () => t`S3 staging directory`],
  ["SSH Authentication", () => t`SSH Authentication`],
  ["SSH known hosts", () => t`SSH known hosts`],
  [
    "SSH private key to connect to the tunnel",
    () => t`SSH private key to connect to the tunnel`,
  ],
  ["SSH tunnel host", () => t`SSH tunnel host`],
  ["SSH tunnel password", () => t`SSH tunnel password`],
  ["SSH tunnel port", () => t`SSH tunnel port`],
  ["SSH tunnel username", () => t`SSH tunnel username`],
  ["Scanning for Filter Values", () => t`Scanning for Filter Values`],
  ["Schema (optional)", () => t`Schema (optional)`],
  ["Schemas", () => t`Schemas`],
  ["Secret key", () => t`Secret key`],
  ["Server SSL certificate chain", () => t`Server SSL certificate chain`],
  [
    "Server SSL certificate chain (PEM)",
    () => t`Server SSL certificate chain (PEM)`,
  ],
  ["Service Principal Client ID", () => t`Service Principal Client ID`],
  ["Service Principal OAuth Secret", () => t`Service Principal OAuth Secret`],
  [
    "Snowflake will soon block password authentication.",
    () => t`Snowflake will soon block password authentication.`,
  ],
  ["Specific database", () => t`Specific database`],
  [
    "Specify a role to override the database user's default role.",
    () => t`Specify a role to override the database user's default role.`,
  ],
  [
    "Specify a role to override the database user’s default role.",
    () => t`Specify a role to override the database user’s default role.`,
  ],
  [
    "Specify a single database to enable features like DB routing",
    () => t`Specify a single database to enable features like DB routing`,
  ],
  [
    "Specify the default catalog to connect to.",
    () => t`Specify the default catalog to connect to.`,
  ],
  [
    "Specify the default database to connect to",
    () => t`Specify the default database to connect to`,
  ],
  [
    "Starburst Catalogs contain schemas and reference data sources via a connector.",
    () =>
      t`Starburst Catalogs contain schemas and reference data sources via a connector.`,
  ],
  [
    "The Databricks host URL. Could also be adb-xxxxx.azuredatabricks.net",
    () =>
      t`The Databricks host URL. Could also be adb-xxxxx.azuredatabricks.net`,
  ],
  [
    "The column(s) the index will be built on. Usually the ones you filter or join by.",
    () =>
      t`The column(s) the index will be built on. Usually the ones you filter or join by.`,
  ],
  [
    "The hostname that you use to connect to SSH tunnels.",
    () => t`The hostname that you use to connect to SSH tunnels.`,
  ],
  [
    "The username you use to login to your SSH tunnel.",
    () => t`The username you use to login to your SSH tunnel.`,
  ],
  [
    "This S3 staging directory must be in the same region you specify above. Leave it empty if you use managed query results.",
    () =>
      t`This S3 staging directory must be in the same region you specify above. Leave it empty if you use managed query results.`,
  ],
  [
    "This enables the connection with basic authentication.",
    () => t`This enables the connection with basic authentication.`,
  ],
  [
    "This enables unfolding JSON columns into their component fields.",
    () => t`This enables unfolding JSON columns into their component fields.`,
  ],
  [
    "This is useful when Metabase is deployed on a VPC or AWS Secret Cloud.",
    () =>
      t`This is useful when Metabase is deployed on a VPC or AWS Secret Cloud.`,
  ],
  ["Truststore", () => t`Truststore`],
  ["Truststore (PKCS12 or JKS)", () => t`Truststore (PKCS12 or JKS)`],
  ["Truststore password", () => t`Truststore password`],
  ["Unique", () => t`Unique`],
  [
    "Use Machine to Machine (M2M) authentication",
    () => t`Use Machine to Machine (M2M) authentication`,
  ],
  [
    "Use Personal Access Token for authentication.",
    () => t`Use Personal Access Token for authentication.`,
  ],
  ["Use SSL server certificate?", () => t`Use SSL server certificate?`],
  ["Use SSL truststore?", () => t`Use SSL truststore?`],
  [
    "Use a different data catalog (if you have federated queries, for example)",
    () =>
      t`Use a different data catalog (if you have federated queries, for example)`,
  ],
  ["Use a secure connection (SSL)", () => t`Use a secure connection (SSL)`],
  ["Use an SSH tunnel", () => t`Use an SSH tunnel`],
  ["Use canonical hostname", () => t`Use canonical hostname`],
  [
    "User used to run system queries, required if the connection's user cannot be impersonated, such as the 'sa' user.",
    () =>
      t`User used to run system queries, required if the connection's user cannot be impersonated, such as the 'sa' user.`,
  ],
  ["Username", () => t`Username`],
  ["Warehouse", () => t`Warehouse`],
  ["Workgroup", () => t`Workgroup`],
  [
    "Your database's IP address (e.g. 98.137.149.56) or its domain name (e.g. esc.mydatabase.com).",
    () =>
      t`Your database's IP address (e.g. 98.137.149.56) or its domain name (e.g. esc.mydatabase.com).`,
  ],
  [
    "A file readable by the Metabase server (e.g. a Kubernetes projected token). Preferred over a pasted JWT because the driver re-reads it per connection.",
    () =>
      t`A file readable by the Metabase server (e.g. a Kubernetes projected token). Preferred over a pasted JWT because the driver re-reads it per connection.`,
  ],
  ["AWS", () => t`AWS`],
  ["Authentication method", () => t`Authentication method`],
  ["Azure", () => t`Azure`],
  ["Azure AD - Managed identity", () => t`Azure AD - Managed identity`],
  ["Azure AD - Service principal", () => t`Azure AD - Service principal`],
  [
    "Azure AD - Service principal (certificate)",
    () => t`Azure AD - Service principal (certificate)`,
  ],
  ["Certificate password", () => t`Certificate password`],
  ["Client certificate", () => t`Client certificate`],
  ["Client key", () => t`Client key`],
  ["Client key password", () => t`Client key password`],
  ["Client secret", () => t`Client secret`],
  ["Google Cloud", () => t`Google Cloud`],
  [
    "If the certificate needs a password, provide it here.",
    () => t`If the certificate needs a password, provide it here.`,
  ],
  ["Managed identity client ID", () => t`Managed identity client ID`],
  ["OIDC token", () => t`OIDC token`],
  ["OIDC token file path", () => t`OIDC token file path`],
  [
    "Only needed if the private key is in a separate file from the certificate.",
    () =>
      t`Only needed if the private key is in a separate file from the certificate.`,
  ],
  [
    "Only needed if the separate private key file is encrypted.",
    () => t`Only needed if the separate private key file is encrypted.`,
  ],
  [
    "Only needed if your private key is encrypted.",
    () => t`Only needed if your private key is encrypted.`,
  ],
  ["OpenID Connect (JWT)", () => t`OpenID Connect (JWT)`],
  ["Optional", () => t`Optional`],
  [
    "Optional. Fill in for a user-assigned managed identity; leave blank to use the default identity attached to the Metabase host.",
    () =>
      t`Optional. Fill in for a user-assigned managed identity; leave blank to use the default identity attached to the Metabase host.`,
  ],
  [
    "Paste a JWT for a one-off test. Metabase does not refresh tokens.",
    () => t`Paste a JWT for a one-off test. Metabase does not refresh tokens.`,
  ],
  ["Private key passphrase", () => t`Private key passphrase`],
  ["RSA key pair", () => t`RSA key pair`],
  ["SQL Server login", () => t`SQL Server login`],
  [
    "Snowflake blocks password authentication for service users by October 2026.",
    () =>
      t`Snowflake blocks password authentication for service users by October 2026.`,
  ],
  [
    "The Entra application (client) ID of the service principal.",
    () => t`The Entra application (client) ID of the service principal.`,
  ],
  [
    "The Microsoft Entra service principal certificate.",
    () => t`The Microsoft Entra service principal certificate.`,
  ],
  ["Username & password", () => t`Username & password`],
  ["Workload Identity Federation", () => t`Workload Identity Federation`],
  ["Workload identity provider", () => t`Workload identity provider`],
]);

function translateDriverText(text: string | undefined) {
  return text == null ? text : (DRIVER_MESSAGES.get(text)?.() ?? text);
}

/** Translate presentation metadata without touching submitted connection values. */
export function localizeConnectionField(field: EngineField): EngineField {
  return {
    ...field,
    "display-name": translateDriverText(field["display-name"]),
    description: translateDriverText(field.description),
    placeholder:
      field.placeholder === "Optional"
        ? translateDriverText(field.placeholder)
        : field.placeholder,
    "helper-text": translateDriverText(field["helper-text"]),
    options: field.options?.map((option) => ({
      ...option,
      name: translateDriverText(option.name) ?? option.name,
    })),
  };
}
