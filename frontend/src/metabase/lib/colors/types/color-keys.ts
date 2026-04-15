import type { ALL_ACCENT_COLOR_NAMES } from "../constants/accents";

/**
 * All color keys available in Metabase themes.
 *
 * Both the light and dark theme must define all of these colors.
 *
 * @inline
 * @category Theming
 */
export type MetabaseColorKey =
  | MetabaseAccentColorKey
  | ProtectedColorKey
  | "background-brand"
  | "background-disabled"
  | "background-disabled-inverse"
  | "background-error"
  | "background-error-secondary"
  | "background-highlight"
  | "background-home"
  | "background-hover"
  | "background-menu-hover"
  | "background-menu-selected"
  | "background-info"
  | "background-primary"
  | "background-primary-inverse"
  | "background-secondary"
  | "background-secondary-inverse"
  | "background-selected"
  | "background-success"
  | "background-tertiary"
  | "background-tertiary-inverse"
  | "background-warning"
  | "border"
  | "border-brand"
  | "border-card-home"
  | "border-strong"
  | "border-subtle"
  | "brand"
  | "button-primary"
  | "button-primary-hover"
  | "brand-hover"
  | "bronze"
  | "copper"
  | "danger"
  | "error"
  | "filter"
  | "focus"
  | "gold"
  | "icon-brand"
  | "icon-disabled"
  | "icon-primary"
  | "icon-secondary"
  | "illustration-brand-secondary"
  | "illustration-brand-tertiary"
  | "info"
  | "overlay"
  | "saturated-blue"
  | "saturated-green"
  | "saturated-purple"
  | "saturated-red"
  | "saturated-yellow"
  | "shadow"
  | "shadow-card-hover"
  | "silver"
  | "success"
  | "success-secondary"
  | "summarize"
  | "switch-off"
  | "syntax-parameters"
  | "syntax-parameters-active"
  | "text-brand"
  | "text-hover"
  | "text-primary"
  | "text-primary-inverse"
  | "text-secondary"
  | "text-secondary-inverse"
  | "text-secondary-opaque"
  | "text-selected"
  | "text-tertiary"
  | "text-tertiary-inverse"
  | "tooltip-background"
  | "tooltip-background-focused"
  | "tooltip-text"
  | "tooltip-text-secondary"
  | "warning"
  | "white"
  // SP Design System — Paleta Primária
  | "sp-black"
  | "sp-red"
  | "sp-white"
  | "sp-gray"
  | "sp-gray-light"
  // SP Design System — Paleta Secundária
  | "sp-yellow"
  | "sp-blue"
  | "sp-green"
  | "sp-sky-light"
  | "sp-sky"
  | "sp-blue-medium"
  | "sp-blue-dark"
  | "sp-navy"
  | "sp-olive"
  | "sp-red-dark";

/**
 * @inline
 */
export type MetabaseAccentColorKey = (typeof ALL_ACCENT_COLOR_NAMES)[number];

/**
 * Color keys that are protected and should not be exposed to embedding.
 *
 * Do not derive this from `PROTECTED_COLORS` or doc generation will fail.
 */
export type ProtectedColorKey =
  | "metabase-brand"
  | "metabase-brand-hover"
  | "admin-navbar"
  | "admin-navbar-secondary"
  | "admin-navbar-inverse"
  | "upsell-primary"
  | "upsell-secondary"
  | "upsell-gem"
  | "accent0"
  | "accent1"
  | "accent2"
  | "accent3"
  | "accent4"
  | "accent5"
  | "accent6"
  | "accent7";
