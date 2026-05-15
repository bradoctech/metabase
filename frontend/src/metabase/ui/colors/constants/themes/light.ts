/* eslint-disable metabase/no-color-literals */
import type { MetabaseThemeV2 } from "../../types";
import { LIGHT_THEME_ACCENT_COLORS } from "../accent-colors";
import { getBaseColorsForThemeDefinitionOnly } from "../base-colors";
import { spColors } from "../sp-colors";

const baseColors = getBaseColorsForThemeDefinitionOnly();

/**
 * The default light theme for Metabase.
 */
export const METABASE_LIGHT_THEME: MetabaseThemeV2 = {
  version: 2,
  chartColors: LIGHT_THEME_ACCENT_COLORS,
  colors: {
    "admin-navbar": "#1a1a1a",
    "admin-navbar-secondary": "#404040",
    "admin-navbar-inverse": "#FFFFFF",
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
    brand: spColors.red[40], // SP Paleta Primaria: sp-red
    "brand-hover": "color-mix(in srgb, #FF161F, white 12%)", // SP Paleta Primaria: sp-red
    danger: spColors.redDark.base, // SP Paleta Secundaria: sp-red-dark
    error: spColors.status.error.base, // utiliza spColors.status.error
    filter: baseColors.octopus[50], // original sem roxo na paleta SP
    focus: spColors.grayLight.base, // SP Paleta Prim?ria: sp-gray-light
    "icon-brand": spColors.red[30], // SP Paleta Primaria: sp-red
    "icon-primary": spColors.black.alpha80, // SP Paleta Primaria: sp-black
    "icon-disabled": spColors.grayLight.base, // SP Paleta Primaria: sp-gray-light
    "icon-secondary": spColors.gray.base, // SP Paleta Primaria: sp-gray
    "illustration-brand-secondary": spColors.red[10], // SP Paleta Primária: sp-red
    "illustration-brand-tertiary": spColors.red[5], // SP Paleta Primaria: sp-red
    "metabase-brand": spColors.red[40], // SP Paleta Primaria: sp-red
    "metabase-brand-hover": "color-mix(in srgb, #FF161F, white 12%)", // SP Paleta Primária: sp-red
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
    "sp-black": "#000000",
    "sp-black-hover": spColors.black.hover,
    "sp-red": "#FF161F",
    "sp-white": "#FFFFFF",
    "sp-gray": "#808080",
    "sp-gray-light": spColors.grayLight.base,
    "sp-gray-medium": spColors.grayMedium.base,
    "sp-primary-40": spColors.primary40,
    "sp-color-border": spColors.colorBorder,
    // SP Design System Paleta Secundaria
    "sp-yellow": "#FBB900",
    "sp-blue": "#034EA2",
    "sp-green": "#0B9247",
    "sp-sky-light": "#A1DDF7",
    "sp-sky": spColors.sky.base, // SP Paleta Secundaria: sp-sky #62C9E0
    "sp-blue-medium": "#4297D3",
    "sp-blue-dark": "#005992",
    "sp-navy": "#233254",
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
  },
};
