/* eslint-disable metabase/no-color-literals */
import type { MetabaseThemeV2 } from "../../types";
import { LIGHT_THEME_ACCENT_COLORS } from "../accent-colors";
import { getBaseColorsForThemeDefinitionOnly } from "../base-colors";
import { spColors } from "../sp-colors";

const baseColors = getBaseColorsForThemeDefinitionOnly();

// Upstream 63 new design tokens — added to avoid TypeScript errors on new keys.
// SP-specific overrides for core-brand etc. are intentionally absent here;
// the deprecated keys above (brand, filter, …) already map SP colours.
const actualColors = {
  "background_page-filter": baseColors.filter[5],
  "background_page-highlighted":
    "color-mix(in srgb, var(--mb-color-core-brand) 7%, transparent)",
  "background_page-primary": baseColors.white,
  "background_page-primary-inverse": baseColors.orion[80],
  "background_page-secondary": baseColors.orion[5],
  "background_page-secondary-inverse": `color-mix(in srgb, ${baseColors.orion[100]}, black 25%)`,
  "background_page-tertiary": baseColors.orion[10],
  "background_page-tertiary-inverse": `color-mix(in srgb, ${baseColors.orion[100]}, black 50%)`,
  "background_surface-brand-strong": baseColors.brand[60],
  "background_surface-brand-strong-hover": baseColors.brand[70],
  "background_surface-brand-strong-pressed": baseColors.brand[80],
  "background_surface-brand-subtle":
    "color-mix(in srgb, var(--mb-color-core-brand) 10%, transparent)",
  "background_surface-brand-subtle-hover":
    "color-mix(in srgb, var(--mb-color-core-brand) 30%, transparent)",
  "background_surface-brand-subtle-pressed":
    "color-mix(in srgb, var(--mb-color-core-brand) 60%, transparent)",
  "background_surface-disabled": baseColors.orionAlpha[10],
  "background_surface-disabled-inverse": baseColors.orionAlphaInverse[10],
  "background_surface-error": baseColors.lobster[10],
  "background_surface-error-subtle": baseColors.lobster[5],
  "background_surface-hover":
    "color-mix(in srgb, var(--mb-color-core-brand) 7%, transparent)",
  "background_surface-primary": "var(--mb-color-background_page-primary)",
  "background_surface-primary-hover": baseColors.orionAlpha[10],
  "background_surface-primary-inverse":
    "var(--mb-color-background_page-primary-inverse)",
  "background_surface-primary-inverse-hover": baseColors.orionAlphaInverse[20],
  "background_surface-primary-inverse-pressed":
    baseColors.orionAlphaInverse[10],
  "background_surface-primary-pressed": baseColors.orionAlpha[20],
  "background_surface-secondary": baseColors.orionAlpha[10],
  "background_surface-secondary-hover": baseColors.orionAlpha[20],
  "background_surface-secondary-inverse": baseColors.orionAlphaInverse[10],
  "background_surface-secondary-inverse-hover":
    baseColors.orionAlphaInverse[20],
  "background_surface-secondary-inverse-pressed":
    baseColors.orionAlphaInverse[10],
  "background_surface-secondary-pressed": baseColors.orionAlpha[30],
  "background_surface-selected":
    "color-mix(in srgb, var(--mb-color-core-brand) 21%, transparent)",
  "background_surface-success": baseColors.palm[5],
  "background_surface-warning": baseColors.dubloon[5],
  "background_surface-warning-strong": baseColors.dubloon[20],
  "border-neutral": baseColors.orion[20],
  "border-neutral-strong": baseColors.orionAlpha[30],
  "border-neutral-strongest": baseColors.orionAlpha[50],
  "border-neutral-subtle": baseColors.orionAlpha[10],
  "core-blue-saturated": baseColors.ocean[60],
  "core-brand": spColors.red[40], // SP: same as `brand`
  "core-brand-hover": `color-mix(in srgb, ${spColors.red[40]}, white 12%)`,
  "core-filter": spColors.blueMedium.base,
  "core-gold": "#FFD700",
  "core-green-saturated": baseColors.palm[60],
  "core-info": baseColors.orion[40],
  "core-metabase_brand": baseColors.blue[40],
  "core-metabase_brand-hover": baseColors.blue[30],
  "core-purple-saturated": baseColors.octopus[60],
  "core-red-saturated": baseColors.lobster[60],
  "core-summarize": spColors.blueMedium.base,
  "core-white": baseColors.white,
  "core-white_constant": "white",
  "core-yellow-saturated": baseColors.dubloon[30],
  "feedback-negative": baseColors.lobster[50],
  "feedback-negative-strong": baseColors.lobster[60],
  "feedback-neutral-strong": baseColors.orionAlpha[60],
  "feedback-positive": baseColors.palm[50],
  "feedback-positive-selected": baseColors.palm[60],
  "feedback-positive-strong": baseColors.palm[60],
  "feedback-warning": baseColors.dubloon[30],
  "feedback-warning-strong": baseColors.mango[60],
  "illustration-secondary-brand": spColors.red[10],
  "illustration-tertiary-brand": spColors.red[5],
  "input-focus": baseColors.blue[20],
  "modal-overlay": baseColors.orionAlpha[60],
  "navbar-admin": "#1a1a1a",
  "navbar-admin-inverse": baseColors.white,
  "navbar-admin-secondary": "#404040",
  "shadow-default": baseColors.orionAlpha[20],
  "text-brand-hover": baseColors.brand[60],
  "text-brand-strong": baseColors.brand[60],
  "text-brand-strong-hover": baseColors.brand[70],
  "text-disabled": baseColors.orionAlpha[40],
  "text-disabled-inverse": baseColors.orionAlphaInverse[40],
  "text-syntax-parameter": baseColors.mango[60],
  "text-syntax-parameter-active": baseColors.mango[10],
} as const;

/**
 * The default light theme for Metabase.
 */
export const METABASE_LIGHT_THEME: MetabaseThemeV2 = {
  version: 2,
  chartColors: LIGHT_THEME_ACCENT_COLORS,
  colors: {
    "admin-navbar": "#1a1a1a",
    "admin-navbar-secondary": "#404040",
    "admin-navbar-inverse": baseColors.white,
    "background-brand": spColors.red[10], // SP Paleta Primaria: sp-red
    "background-filter": baseColors.filter[5],
    "background-disabled": baseColors.orionAlpha[10],
    "background-disabled-inverse": baseColors.orionAlphaInverse[10],
    "background-error-secondary": spColors.redDark[5], // SP Paleta Secundaria: sp-red-dark
    "background-highlight":
      "color-mix(in srgb, var(--mb-color-brand) 7%, transparent)",
    "background-home": "#F2F2F2",
    "background-hover":
      "color-mix(in srgb, var(--mb-color-brand) 7%, transparent)",
    "background-menu-hover": "color-mix(in srgb, #ebebeb, white 20%)",
    "background-selected":
      "color-mix(in srgb, var(--mb-color-brand) 21%, transparent)",
    "background-menu-selected": "color-mix(in srgb, #ebebeb, white 0%)",
    "background-primary": baseColors.white,
    "background-secondary": spColors.bgSecondary,
    "background-tertiary": baseColors.orion[10],
    "background-primary-inverse": baseColors.orion[80],
    "background-secondary-inverse": baseColors.orion[70],
    "background-tertiary-inverse": baseColors.orion[40],
    overlay: baseColors.orionAlpha[60],
    "background-error": spColors.redDark[10], // SP Paleta Secundaria: sp-red-dark
    "background-success": spColors.green.bg, // SP Paleta Secundaria: sp-green
    "background-success-secondary": spColors.green.medium, // key from upstream 62; SP green
    brand: spColors.red[40], // SP Paleta Primaria: sp-red
    "brand-hover": `color-mix(in srgb, ${spColors.red[40]}, white 12%)`, // SP Paleta Primaria: sp-red
    danger: spColors.redDark.base, // SP Paleta Secundaria: sp-red-dark
    error: spColors.status.error.base, // utiliza spColors.status.error
    filter: spColors.blueMedium.base, // azul medio na paleta SP
    focus: spColors.grayLight.base, // SP Paleta Primária: sp-gray-light
    "icon-brand": spColors.red[30], // SP Paleta Primaria: sp-red
    "icon-primary": spColors.black.alpha80, // SP Paleta Primaria: sp-black
    "icon-disabled": spColors.grayLight.base, // SP Paleta Primaria: sp-gray-light
    "icon-secondary": spColors.gray.base, // SP Paleta Primaria: sp-gray
    "illustration-brand-secondary": spColors.red[10], // SP Paleta Primária: sp-red
    "illustration-brand-tertiary": spColors.red[5], // SP Paleta Primaria: sp-red
    "metabase-brand": spColors.red[40], // SP Paleta Primaria: sp-red
    "metabase-brand-hover": `color-mix(in srgb, ${spColors.red[40]}, white 12%)`, // SP Paleta Primária: sp-red
    "saturated-blue": spColors.blue.base, // SP Paleta Secundaria
    "saturated-green": spColors.green[60], // SP Paleta Secundaria: sp-green
    "saturated-purple": baseColors.octopus[60], // original sem roxo na paleta SP
    "saturated-red": spColors.redDark.base, // SP Paleta Secundaria: sp-red-dark
    "saturated-yellow": spColors.yellow.base, // SP Paleta Secundaria: sp-yellow
    shadow: baseColors.orionAlpha[20],
    "shadow-card-hover": "rgba(0, 0, 0, 0.15)",
    "success-secondary": spColors.green.dark, // SP Paleta Secundaria: sp-green
    success: spColors.green.base, // SP Paleta Secundaria: sp-green
    summarize: spColors.green.base, // SP Paleta Secundaria: sp-green
    "switch-off": spColors.grayLight.base, // SP Paleta Primaria: sp-gray-light
    "syntax-parameters-active": spColors.yellow[10], // SP Paleta Secundaria: sp-yellow
    "syntax-parameters": spColors.yellow.base, // SP Paleta Secundaria: sp-yellow
    "text-brand": spColors.red[40], // SP Paleta Primaria: sp-red
    "text-filter": baseColors.filter[50],
    "text-tertiary": spColors.grayLight.base, // SP Paleta Primaria: sp-gray-light
    "text-tertiary-inverse": baseColors.orionAlphaInverse[40],
    "text-hover": spColors.red[60], // SP Paleta Primaria: sp-red
    "text-secondary-opaque": spColors.gray.base, // SP Paleta Primaria: sp-gray
    "text-primary": spColors.black.base, // SP Paleta Primaria: sp-black
    "text-primary-inverse": baseColors.orionAlphaInverse[80],
    "text-secondary": spColors.gray.base, // SP Paleta Primaria: sp-gray
    "text-secondary-inverse": baseColors.orionAlphaInverse[60],
    "text-selected": spColors.black.base, // SP Paleta Primaria: sp-black
    "tooltip-background-focused": `color-mix(in srgb, ${baseColors.orion[80]} 50%, #000)`,
    "tooltip-background": baseColors.orion[80],
    "tooltip-text-secondary": baseColors.orionAlphaInverse[60],
    "tooltip-text": baseColors.white,
    warning: spColors.yellow.base, // SP Paleta Secundaria: sp-yellow
    "background-warning": spColors.yellow.bg, // SP Paleta Secundaria: sp-yellow
    "background-warning-secondary": spColors.yellow.medium, // from upstream 61/62 key
    info: spColors.gray.base, // SP Paleta Primaria: sp-gray
    "background-info": spColors.gray.bg, // SP Paleta Primaria: sp-gray
    white: baseColors.white,
    border: spColors.black[15], // SP Paleta Primaria: sp-black
    "border-brand": spColors.red[10], // SP Paleta Primaria: sp-red
    "border-card-home": "#E2E2E2",
    "border-strong": spColors.gray.base, // SP Paleta Primaria: sp-gray
    "border-stronger": baseColors.orionAlpha[50],
    "border-subtle": spColors.black.alpha10, // SP Paleta Primaria: sp-black
    "border-filter": baseColors.filter[20],
    "button-primary": spColors.black.base, // SP Paleta Primaria: sp-black
    "button-primary-hover": spColors.black.hover, // SP Paleta Primaria: sp-black
    copper: "#B87333",
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    "upsell-primary": spColors.blue.base, // SP Paleta Secundria: sp-blue
    "upsell-secondary": spColors.skyLight.base, // SP Paleta Secundaria: sp-sky-light
    "upsell-gem": "#00d4ff",
    // SP Design System Paleta Primaria
    "sp-black": spColors.black.base,
    "sp-black-hover": spColors.black.hover,
    "sp-red": spColors.red[40],
    "sp-white": baseColors.white,
    "sp-gray": spColors.gray.base,
    "sp-gray-light": spColors.grayLight.base,
    "sp-gray-medium": spColors.grayMedium.base,
    "sp-primary-40": spColors.primary40,
    "sp-color-border": spColors.colorBorder,
    // SP Design System Paleta Secundaria
    "sp-yellow": spColors.yellow.base,
    "sp-blue": spColors.blue.base,
    "sp-green": spColors.green.base,
    "sp-sky-light": spColors.skyLight.base,
    "sp-sky": spColors.sky.base, // SP Paleta Secundaria: sp-sky #62C9E0
    "sp-blue-medium": spColors.blueMedium.base,
    "sp-blue-dark": "#005992", // sem token equivalente em sp-colors ainda
    "sp-navy": spColors.navy.base,
    "sp-olive": spColors.olive.base, // SP Paleta Secundaria: sp-olive #94AA54
    "sp-red-dark": spColors.redDark.base, // SP Paleta Secundaria: sp-red-dark #842519
    // SP Design System — Paleta ampliada (tons e variacoes)
    "sp-green-light": spColors.green.light, // #E3F5E1
    "sp-green-medium": spColors.green.medium, // #B4D0BB
    "sp-green-darker": spColors.green.darker, // #086732
    "sp-yellow-light": spColors.yellow.light, // #FFF5C2
    "sp-yellow-medium": spColors.yellow.medium, // #FFC572
    "sp-red-light": spColors.red.light, // #FFE5E5
    "sp-red-medium": spColors.red.medium, // #EB7B7B
    "sp-red-dark2": spColors.red.dark, // #B22929
    "sp-blue-light": spColors.blue.light, // #E6F0FC
    "sp-blue-soft": spColors.blue.medium, // #ADD7FB
    // Upstream 63 new design tokens
    ...actualColors,
  },
};
