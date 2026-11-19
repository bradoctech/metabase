/**
 * Chaves de cor exclusivas do SP Design System.
 *
 * Entram em `MetabaseColorKey` via `| SpColorKey` em `color-keys.ts`; o
 * CssVarsDeclarationPlugin resolve a referência e gera `--mb-color-<chave>`.
 * Os valores ficam em `constants/sp-theme.ts`.
 */
export type SpColorKey =
  // Tokens de layout/componentes SP
  | "background-home"
  | "background-menu-hover"
  | "background-menu-selected"
  | "border-card-home"
  | "button-primary"
  | "button-primary-hover"
  | "shadow-card-hover"
  // Tons metálicos (sem uso no código em 0.63)
  | "bronze"
  | "copper"
  | "silver"
  // Paleta Primária
  | "sp-black"
  | "sp-black-hover"
  | "sp-red"
  | "sp-white"
  | "sp-gray"
  | "sp-gray-light"
  | "sp-gray-medium"
  | "sp-primary-40"
  | "sp-color-border"
  // Paleta Secundária
  | "sp-yellow"
  | "sp-blue"
  | "sp-green"
  | "sp-sky-light"
  | "sp-sky"
  | "sp-blue-medium"
  | "sp-blue-dark"
  | "sp-navy"
  | "sp-olive"
  | "sp-red-dark"
  // Paleta ampliada (tons e variações)
  | "sp-green-light"
  | "sp-green-medium"
  | "sp-green-darker"
  | "sp-yellow-light"
  | "sp-yellow-medium"
  | "sp-red-light"
  | "sp-red-medium"
  | "sp-red-dark2"
  | "sp-blue-light"
  | "sp-blue-soft";
