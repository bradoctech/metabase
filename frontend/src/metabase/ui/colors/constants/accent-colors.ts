/* eslint-disable metabase/no-color-literals -- we define chart colors here to avoid duplication */

import type { ChartColorV2 } from "../types";

import { getBaseColorsForThemeDefinitionOnly } from "./base-colors";
import { spColors } from "./sp-colors";

const baseColors = getBaseColorsForThemeDefinitionOnly();

export const DEFAULT_ACCENT_COLORS: ChartColorV2[] = [
  "#509EE3", // accent0 - blue
  "#88BF4D", // accent1 - green
  "#A989C5", // accent2 - purple
  "#EF8C8C", // accent3 - red
  "#F9D45C", // accent4 - yellow
  "#F2A86F", // accent5 - orange
  "#98D9D9", // accent6 - cyan
  "#7172AD", // accent7 - indigo
];

export const LIGHT_THEME_ACCENT_COLORS: ChartColorV2[] = [
  ...DEFAULT_ACCENT_COLORS,
  {
    base: "#000000",
    tint: "#666666",
    shade: "#000000",
  },
];

export const DARK_THEME_ACCENT_COLORS: ChartColorV2[] = [
  ...DEFAULT_ACCENT_COLORS,
  {
    base: baseColors.orion[80],
    tint: baseColors.orion[80],
    shade: baseColors.orion[110],
  },
];

/**
 * Paleta explicita SP com 30 cores fixas.
 * Usada no ChartSettingColorPicker em vez da geracao automatica de variantes.
 * Ordem: 3 linhas de 9 + 1 linha de 3 (total = 30).
 */
export const SP_PALETTE_COLORS: string[] = [
  // Linha 1 — cores base da paleta SP
  spColors.black.base, // #000000
  spColors.red[40], // #FF161F
  "#FFFFFF", // branco puro
  spColors.gray.base, // #808080
  spColors.grayLight.base, // #BFBFBF
  spColors.yellow.base, // #FBB900
  spColors.blue.base, // #034EA2
  spColors.green.base, // #0B9247
  spColors.skyLight.base, // #A1DDF7
  // Linha 2 — paleta secundária SP
  spColors.sky.base, // #62C9E0
  spColors.blueMedium.base, // #4297D3
  spColors.navy.base, // #233254
  spColors.olive.base, // #94AA54
  spColors.redDark.base, // #842519
  spColors.green.light, // #E3F5E1
  spColors.green.medium, // #B4D0BB
  spColors.green.base, // #0B9247
  spColors.green.darker, // #086732
  // Linha 3 — tons temáticos
  spColors.yellow.light, // #FFF5C2
  spColors.yellow.medium, // #FFC572
  spColors.yellow.base, // #FBB900
  spColors.status.warningOrange.base, // #C68B00
  spColors.red.light, // #FFE5E5
  spColors.red.medium, // #EB7B7B
  spColors.status.error.base, // #E52207
  spColors.red.dark, // #B22929
  spColors.blue.light, // #E6F0FC
  // Linha 4 — complementares
  spColors.blue.medium, // #ADD7FB
  spColors.blue.base, // #034EA2
  spColors.navy.base, // #233254
];
