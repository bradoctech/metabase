/* eslint-disable metabase/no-color-literals */
/**
 * SP Design System color scales — valores 100% estaticos (hex / rgba).
 *
 * IMPORTANTE: Nenhum valor aqui usa `var(--mb-color-sp-*)` porque o parser JS
 * do Metabase so aceita `var(--mb-color-brand)` como variável CSS. Qualquer
 * outro `var()` causa "Unable to parse color".
 *
 * Todos os tons foram pre-calculados a partir das cores base da paleta SP.
 *
 * So use este arquivo para definir os temas `light.ts` e `dark.ts`.
 *
 * Caso queira adicionar var use color-keys-ts para adicionar o type e entao adicione ao light.ts ou dark.ts.
 */
export const spColors = {
  // ─── Paleta Primaria ────────────────────────────────────────────────────────

  /** #FF161F — vermelho principal SP */
  red: {
    /** ~14% de #FF161F (muito escuro) */
    100: "#240304",
    /** ~25% de #FF161F */
    90: "#400608",
    /** ~40% de #FF161F */
    80: "#66090C",
    /** ~55% de #FF161F */
    70: "#8C0C11",
    /** +28% black (~#B81017) */
    60: "#B81017",
    /** +12% black (~#E11319) */
    50: "#E11319",
    /** sp-red puro */
    40: "#FF161F",
    /** +35% white (~#FF686D) */
    30: "#FF686D",
    /** +70% white (~#FFB9BC) */
    20: "#FFB9BC",
    /** +90% white (~#FFE8E9) */
    10: "#FFE8E9",
    /** +95% white (~#FFF3F4) */
    5: "#FFF3F4",
    /** muito claro (#FFE5E5) — fundo suave vermelho */
    light: "#FFE5E5",
    /** medio (#EB7B7B) — vermelho rosado */
    medium: "#EB7B7B",
    /** escuro (#B22929) — vermelho sangue */
    dark: "#B22929",
  },

  /** Cor primary40 solicitada pelo time */
  primary40: "#5E5E5E",

  /** Cor especifica para bordas customizadas */
  colorBorder: "#919191",

  /** #000000 — preto SP */
  black: {
    /** preto puro */
    base: "#000000",
    /** rgba com 80% de opacidade */
    alpha80: "rgba(0, 0, 0, 0.80)",
    /** ~25% white (~#404040) */
    hover: "#303030",
    /** +85% white (~#D9D9D9) */
    15: "#D9D9D9",
    /** +90% white (~#E6E6E6) */
    10: "#E6E6E6",
    /** rgba com 10% de opacidade */
    alpha10: "rgba(0, 0, 0, 0.10)",
  },

  /** #808080 — cinza SP */
  gray: {
    /** cinza puro */
    base: "#808080",
    /** +88% white (~#F0F0F0) */
    bg: "#F0F0F0",
  },

  /** #BFBFBF — cinza claro SP */
  grayLight: {
    /** cinza claro puro */
    base: "#BFBFBF",
  },

  /** #949AAB — cinza medio SP */
  grayMedium: {
    /** cinza medio puro */
    base: "#949AAB",
  },

  // ─── Paleta Secundaria ───────────────────────────────────────────────────────

  /** #842519 — vermelho escuro SP */
  redDark: {
    /** vermelho escuro puro */
    base: "#842519",
    /** +88% white (~#F0E5E3) */
    10: "#F0E5E3",
    /** +94% white (~#F8F2F1) */
    5: "#F8F2F1",
  },

  /** #0B9247 — verde SP */
  green: {
    /** +15% black (~#097C3C) */
    dark: "#097C3C",
    /** +10% black (~#0A8340) */
    60: "#0A8340",
    /** verde puro */
    base: "#0B9247",
    /** +92% white (~#EBF6F0) */
    bg: "#EBF6F0",
    /** muito claro (#E3F5E1) — fundo suave verde */
    light: "#E3F5E1",
    /** medio (#B4D0BB) — verde acinzentado */
    medium: "#B4D0BB",
    /** mais escuro (#086732) — verde floresta */
    darker: "#086732",
  },

  /** #FBB900 — amarelo SP */
  yellow: {
    /** amarelo puro */
    base: "#FBB900",
    /** +85% white (~#FEF5D9) */
    10: "#FEF5D9",
    /** +92% white (~#FFF9EB) */
    bg: "#FFF9EB",
    /** muito claro (#FFF5C2) — fundo suave amarelo */
    light: "#FFF5C2",
    /** medio (#FFC572) — amarelo ambar */
    medium: "#FFC572",
  },

  /** #034EA2 — azul SP */
  blue: {
    /** azul puro */
    base: "#034EA2",
    /** muito claro (#E6F0FC) — fundo suave azul */
    light: "#E6F0FC",
    /** medio-claro (#ADD7FB) — azul suave */
    medium: "#ADD7FB",
  },

  /** #4297D3 — azul medio SP */
  blueMedium: {
    /** azul medio puro */
    base: "#4297D3",
  },

  /** #A1DDF7 — azul claro SP */
  skyLight: {
    /** azul claro puro */
    base: "#A1DDF7",
  },

  /** #62C9E0 — azul turquesa SP */
  sky: {
    /** turquesa puro */
    base: "#62C9E0",
  },

  /** #94AA54 — verde-oliva SP */
  olive: {
    /** oliva puro */
    base: "#94AA54",
  },

  /** #233254 — azul marinho SP */
  navy: {
    /** azul marinho puro */
    base: "#233254",
  },

  // ─── Paleta de Status (error / success / warning / info) ────────────────
  /** Paleta usada para estados de UI (erros, sucessos, avisos, informacoes) */
  status: {
    /** Erro — cor base solicitada */
    error: {
      base: "#E52207",
      10: "#FFEDEB",
      5: "#FFF6F5",
    },

    /** Sucesso */
    success: {
      base: "#0B9247",
      bg: "#EBF6F0",
    },

    /** Aviso padrao */
    warning: {
      base: "#FBB900",
      bg: "#FFF9EB",
    },

    /** Aviso laranja alternativo */
    warningOrange: {
      base: "#C68B00",
    },

    /** Informacao/Info */
    info: {
      base: "#034EA2",
      bg: "#EAF4FF",
    },
  },

  // ─── Paletas adicionais conforme figma com novos ajustes ───────────────────

  bgSecondary: "#F1F1F1",
};
