/* eslint-disable metabase/no-color-literals -- tema SP: valores fixos do Design System */
/**
 * Tema SP — ponto único de injeção das cores SP nos temas do Metabase.
 *
 * `themes/light.ts` e `themes/dark.ts` ficam iguais ao upstream e só espalham
 * `SP_LIGHT_THEME_COLORS` / `SP_DARK_THEME_COLORS` por último. Os accents de
 * gráfico e a paleta dos color pickers também saem daqui.
 *
 * Não definir `core-brand`, `core-filter` nem `core-summarize`:
 * `deriveFullMetabaseTheme` sempre os copia de `brand`, `filter` e `summarize`.
 */
import type { ChartColorV2, MetabaseColorKey } from "../types";

import { getBaseColorsForThemeDefinitionOnly } from "./base-colors";
import { spColors } from "./sp-colors";

const baseColors = getBaseColorsForThemeDefinitionOnly();

type SpThemeColors = Partial<Record<MetabaseColorKey, string>>;

const SP_BRAND = spColors.red[40];

const SP_TOKEN_COLORS = {
  // Paleta Primária
  "sp-black": spColors.black.base,
  "sp-black-hover": spColors.black.hover,
  "sp-red": SP_BRAND,
  "sp-white": baseColors.white,
  "sp-gray": spColors.gray.base,
  "sp-gray-light": spColors.grayLight.base,
  "sp-gray-medium": spColors.grayMedium.base,
  "sp-primary-40": spColors.primary40,
  "sp-color-border": spColors.colorBorder,
  // Paleta Secundária
  "sp-yellow": spColors.yellow.base,
  "sp-blue": spColors.blue.base,
  "sp-green": spColors.green.base,
  "sp-sky-light": spColors.skyLight.base,
  "sp-sky": spColors.sky.base,
  "sp-blue-medium": spColors.blueMedium.base,
  "sp-blue-dark": "#005992",
  "sp-navy": spColors.navy.base,
  "sp-olive": spColors.olive.base,
  "sp-red-dark": spColors.redDark.base,
  // Paleta ampliada
  "sp-green-light": spColors.green.light,
  "sp-green-medium": spColors.green.medium,
  "sp-green-darker": spColors.green.darker,
  "sp-yellow-light": spColors.yellow.light,
  "sp-yellow-medium": spColors.yellow.medium,
  "sp-red-light": spColors.red.light,
  "sp-red-medium": spColors.red.medium,
  "sp-red-dark2": spColors.red.dark,
  "sp-blue-light": spColors.blue.light,
  "sp-blue-soft": spColors.blue.medium,
  // Tons metálicos
  copper: "#B87333",
  bronze: "#CD7F32",
  silver: "#C0C0C0",
} satisfies SpThemeColors;

const SP_SHARED_COLORS = {
  ...SP_TOKEN_COLORS,
  brand: SP_BRAND,
  "metabase-brand": SP_BRAND,
  "border-card-home": "#E2E2E2",
  "shadow-card-hover": "rgba(0, 0, 0, 0.15)",
} satisfies SpThemeColors;

const SP_LIGHT_BRAND_HOVER = `color-mix(in srgb, ${SP_BRAND}, white 12%)`;
const SP_LIGHT_ADMIN_NAVBAR = {
  base: "#1a1a1a",
  secondary: "#404040",
  inverse: baseColors.white,
};

export const SP_LIGHT_THEME_COLORS = {
  ...SP_SHARED_COLORS,
  "brand-hover": SP_LIGHT_BRAND_HOVER,
  "core-brand-hover": SP_LIGHT_BRAND_HOVER,
  "metabase-brand-hover": SP_LIGHT_BRAND_HOVER,
  "admin-navbar": SP_LIGHT_ADMIN_NAVBAR.base,
  "admin-navbar-secondary": SP_LIGHT_ADMIN_NAVBAR.secondary,
  "admin-navbar-inverse": SP_LIGHT_ADMIN_NAVBAR.inverse,
  "navbar-admin": SP_LIGHT_ADMIN_NAVBAR.base,
  "navbar-admin-secondary": SP_LIGHT_ADMIN_NAVBAR.secondary,
  "navbar-admin-inverse": SP_LIGHT_ADMIN_NAVBAR.inverse,
  "background-brand": spColors.red[10],
  "background-error": spColors.redDark[10],
  "background-error-secondary": spColors.redDark[5],
  "background-home": "#F2F2F2",
  "background-info": spColors.gray.bg,
  "background-menu-hover": "color-mix(in srgb, #ebebeb, white 20%)",
  "background-menu-selected": "color-mix(in srgb, #ebebeb, white 0%)",
  "background-secondary": spColors.bgSecondary,
  "background-success": spColors.green.bg,
  "background-success-secondary": spColors.green.medium,
  "background-warning": spColors.yellow.bg,
  "background-warning-secondary": spColors.yellow.medium,
  border: spColors.black[15],
  "border-brand": spColors.red[10],
  "border-strong": spColors.gray.base,
  "border-subtle": spColors.black.alpha10,
  "button-primary": spColors.black.base,
  "button-primary-hover": spColors.black.hover,
  danger: spColors.redDark.base,
  error: spColors.status.error.base,
  filter: spColors.blueMedium.base,
  focus: spColors.grayLight.base,
  "icon-brand": spColors.red[30],
  "icon-disabled": spColors.grayLight.base,
  "icon-primary": spColors.black.alpha80,
  "icon-secondary": spColors.gray.base,
  "illustration-brand-secondary": spColors.red[10],
  "illustration-brand-tertiary": spColors.red[5],
  "illustration-secondary-brand": spColors.red[10],
  "illustration-tertiary-brand": spColors.red[5],
  info: spColors.gray.base,
  "saturated-blue": spColors.blue.base,
  "saturated-green": spColors.green[60],
  "saturated-red": spColors.redDark.base,
  "saturated-yellow": spColors.yellow.base,
  success: spColors.green.base,
  "success-secondary": spColors.green.dark,
  summarize: spColors.green.base,
  "switch-unchecked": spColors.grayLight.base,
  "syntax-parameters": spColors.yellow.base,
  "syntax-parameters-active": spColors.yellow[10],
  "text-brand": SP_BRAND,
  "text-hover": spColors.red[60],
  "text-primary": spColors.black.base,
  "text-secondary": spColors.gray.base,
  "text-secondary-opaque": spColors.gray.base,
  "text-selected": spColors.black.base,
  "text-tertiary": spColors.grayLight.base,
  "upsell-primary": spColors.blue.base,
  "upsell-secondary": spColors.skyLight.base,
  warning: spColors.yellow.base,
} satisfies SpThemeColors;

const SP_DARK_BRAND_HOVER = `color-mix(in srgb, ${SP_BRAND}, white 25%)`;

export const SP_DARK_THEME_COLORS = {
  ...SP_SHARED_COLORS,
  "brand-hover": SP_DARK_BRAND_HOVER,
  "metabase-brand-hover": SP_DARK_BRAND_HOVER,
  "background-home": baseColors.orion[90],
  "background-menu-hover":
    "color-mix(in srgb, var(--mb-color-brand) 14%, transparent)",
  "background-menu-selected":
    "color-mix(in srgb, var(--mb-color-brand) 21%, transparent)",
  "button-primary": spColors.black.base,
  "button-primary-hover": `color-mix(in srgb, ${spColors.black.base}, white 25%)`,
} satisfies SpThemeColors;

/** Accents de gráfico (accent0..accent7) na paleta SP. */
export const SP_ACCENT_COLORS: ChartColorV2[] = [
  spColors.black.base,
  SP_BRAND,
  spColors.yellow.base,
  spColors.blue.base,
  spColors.green.base,
  spColors.sky.base,
  spColors.navy.base,
  spColors.olive.base,
];

/** `accent-gray` do tema claro. */
export const SP_LIGHT_ACCENT_GRAY: ChartColorV2 = {
  base: "#000000",
  tint: "#666666",
  shade: "#000000",
};

/**
 * Paleta fixa de 30 cores dos color pickers de gráfico/tabela
 * (no lugar da geração automática de variantes).
 * Ordem: 3 linhas de 9 + 1 linha de 3.
 */
export const SP_PALETTE_COLORS: string[] = [
  // Linha 1 — cores base
  spColors.black.base,
  SP_BRAND,
  "#FFFFFF",
  spColors.gray.base,
  spColors.grayLight.base,
  spColors.yellow.base,
  spColors.blue.base,
  spColors.green.base,
  spColors.skyLight.base,
  // Linha 2 — paleta secundária
  spColors.sky.base,
  spColors.blueMedium.base,
  spColors.navy.base,
  spColors.olive.base,
  spColors.redDark.base,
  spColors.green.light,
  spColors.green.medium,
  spColors.green.base,
  spColors.green.darker,
  // Linha 3 — tons temáticos
  spColors.yellow.light,
  spColors.yellow.medium,
  spColors.yellow.base,
  spColors.status.warningOrange.base,
  spColors.red.light,
  spColors.red.medium,
  spColors.status.error.base,
  spColors.red.dark,
  spColors.blue.light,
  // Linha 4 — complementares
  spColors.blue.medium,
  spColors.blue.base,
  spColors.navy.base,
];
