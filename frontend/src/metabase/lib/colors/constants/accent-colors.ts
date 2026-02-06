/* eslint-disable no-color-literals -- we define chart colors here to avoid duplication */

import type { ChartColorV2 } from "../types";

import { getBaseColorsForThemeDefinitionOnly } from "./base-colors";

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
    base: "#000000", // accent8 - black
    tint: "#666666", // lighter gray for tint
    shade: "#000000", // black (already darkest)
  },
];

export const DARK_THEME_ACCENT_COLORS: ChartColorV2[] = [
  ...DEFAULT_ACCENT_COLORS,
  {
    base: "#000000", // accent8 - black
    tint: "#808080", // medium gray for tint (visible on dark backgrounds)
    shade: "#000000", // black (already darkest)
  },
];
