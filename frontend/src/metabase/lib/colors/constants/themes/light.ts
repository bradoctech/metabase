/* eslint-disable no-color-literals */
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
    "background-brand": spColors.red[10], // SP Paleta Primária: sp-red
    "background-disabled": baseColors.orionAlpha[10],
    "background-disabled-inverse": baseColors.orionAlphaInverse[10],
    "background-error-secondary": spColors.redDark[5], // SP Paleta Secundária: sp-red-dark
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
    "background-secondary": baseColors.orion[5],
    "background-tertiary": baseColors.orion[10],
    "background-primary-inverse": baseColors.orion[80],
    "background-secondary-inverse": baseColors.orion[70],
    "background-tertiary-inverse": baseColors.orion[40],
    overlay: baseColors.orionAlpha[60],
    "background-error": spColors.redDark[10], // SP Paleta Secundária: sp-red-dark
    "background-success": spColors.green.bg, // SP Paleta Secundária: sp-green
    brand: spColors.red[40], // SP Paleta Primária: sp-red
    "brand-hover": "color-mix(in srgb, #FF161F, white 12%)", // SP Paleta Primária: sp-red
    danger: spColors.redDark.base, // SP Paleta Secundária: sp-red-dark
    error: spColors.redDark.base, // SP Paleta Secundária: sp-red-dark
    filter: baseColors.octopus[50], // original — sem roxo na paleta SP
    focus: spColors.grayLight.base, // SP Paleta Primária: sp-gray-light
    "icon-brand": spColors.red[30], // SP Paleta Primária: sp-red
    "icon-primary": spColors.black.alpha80, // SP Paleta Primária: sp-black
    "icon-disabled": spColors.grayLight.base, // SP Paleta Primária: sp-gray-light
    "icon-secondary": spColors.gray.base, // SP Paleta Primária: sp-gray
    "illustration-brand-secondary": spColors.red[10], // SP Paleta Primária: sp-red
    "illustration-brand-tertiary": spColors.red[5], // SP Paleta Primária: sp-red
    "metabase-brand": spColors.red[40], // SP Paleta Primária: sp-red
    "metabase-brand-hover": "color-mix(in srgb, #FF161F, white 12%)", // SP Paleta Primária: sp-red
    "saturated-blue": spColors.blue.base, // SP Paleta Secundária: sp-blue
    "saturated-green": spColors.green[60], // SP Paleta Secundária: sp-green
    "saturated-purple": baseColors.octopus[60], // original — sem roxo na paleta SP
    "saturated-red": spColors.redDark.base, // SP Paleta Secundária: sp-red-dark
    "saturated-yellow": spColors.yellow.base, // SP Paleta Secundária: sp-yellow
    shadow: baseColors.orionAlpha[20],
    "shadow-card-hover": "rgba(0, 0, 0, 0.15)",
    "success-secondary": spColors.green.dark, // SP Paleta Secundária: sp-green
    success: spColors.green.base, // SP Paleta Secundária: sp-green
    summarize: spColors.green.base, // SP Paleta Secundária: sp-green
    "switch-off": spColors.grayLight.base, // SP Paleta Primária: sp-gray-light
    "syntax-parameters-active": spColors.yellow[10], // SP Paleta Secundária: sp-yellow
    "syntax-parameters": spColors.yellow.base, // SP Paleta Secundária: sp-yellow
    "text-brand": spColors.red[40], // SP Paleta Primária: sp-red
    "text-tertiary": spColors.grayLight.base, // SP Paleta Primária: sp-gray-light
    "text-tertiary-inverse": baseColors.orionAlphaInverse[40],
    "text-hover": spColors.red[60], // SP Paleta Primária: sp-red
    "text-secondary-opaque": spColors.gray.base, // SP Paleta Primária: sp-gray
    "text-primary": spColors.black.base, // SP Paleta Primária: sp-black
    "text-primary-inverse": baseColors.orionAlphaInverse[80],
    "text-secondary": spColors.gray.base, // SP Paleta Primária: sp-gray
    "text-secondary-inverse": baseColors.orionAlphaInverse[60],
    "text-selected": spColors.black.base, // SP Paleta Primária: sp-black
    "tooltip-background-focused": `color-mix(in srgb, ${baseColors.orion[80]} 50%, #000)`,
    "tooltip-background": baseColors.orion[80],
    "tooltip-text-secondary": baseColors.orionAlphaInverse[60],
    "tooltip-text": baseColors.white,
    warning: spColors.yellow.base, // SP Paleta Secundária: sp-yellow
    "background-warning": spColors.yellow.bg, // SP Paleta Secundária: sp-yellow
    info: spColors.gray.base, // SP Paleta Primária: sp-gray
    "background-info": spColors.gray.bg, // SP Paleta Primária: sp-gray
    white: baseColors.white,
    border: spColors.black[15], // SP Paleta Primária: sp-black
    "border-brand": spColors.red[10], // SP Paleta Primária: sp-red
    "border-card-home": "#E2E2E2",
    "border-strong": spColors.gray.base, // SP Paleta Primária: sp-gray
    "border-subtle": spColors.black.alpha10, // SP Paleta Primária: sp-black
    "button-primary": spColors.black.base, // SP Paleta Primária: sp-black
    "button-primary-hover": spColors.black.hover, // SP Paleta Primária: sp-black
    copper: "#B87333",
    bronze: "#CD7F32",
    silver: "#C0C0C0",
    gold: "#FFD700",
    "upsell-primary": spColors.blue.base, // SP Paleta Secundária: sp-blue
    "upsell-secondary": spColors.skyLight.base, // SP Paleta Secundária: sp-sky-light
    "upsell-gem": "#00d4ff",
    // SP Design System — Paleta Primária
    "sp-black": "#000000",
    "sp-red": "#FF161F",
    "sp-white": "#FFFFFF",
    "sp-gray": "#808080",
    "sp-gray-light": "#BFBFBF",
    // SP Design System — Paleta Secundária
    "sp-yellow": "#FBB900",
    "sp-blue": "#034EA2",
    "sp-green": "#0B9247",
    "sp-sky-light": "#A1DDF7",
    "sp-sky": "#62C9E0",
    "sp-blue-medium": "#4297D3",
    "sp-blue-dark": "#005992",
    "sp-navy": "#233254",
    "sp-olive": "#94AA54",
    "sp-red-dark": "#842519",
  },
};
