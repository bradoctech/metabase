import type { ChartColorV2 } from "../types";

import { getBaseColorsForThemeDefinitionOnly } from "./base-colors";
import { SP_ACCENT_COLORS, SP_LIGHT_ACCENT_GRAY } from "./sp-theme";

export { SP_PALETTE_COLORS } from "./sp-theme";

const baseColors = getBaseColorsForThemeDefinitionOnly();

export const DEFAULT_ACCENT_COLORS: ChartColorV2[] = SP_ACCENT_COLORS;

export const LIGHT_THEME_ACCENT_COLORS: ChartColorV2[] = [
  ...DEFAULT_ACCENT_COLORS,
  SP_LIGHT_ACCENT_GRAY,
];

export const DARK_THEME_ACCENT_COLORS: ChartColorV2[] = [
  ...DEFAULT_ACCENT_COLORS,
  {
    base: baseColors.orion[80],
    tint: baseColors.orion[80],
    shade: baseColors.orion[110],
  },
];
