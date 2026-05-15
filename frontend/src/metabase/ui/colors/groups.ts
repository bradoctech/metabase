import Color from "color";
import _ from "underscore";

import { LIGHT_THEME_ACCENT_COLORS } from "./constants/accent-colors";
import { ACCENT_COLOR_NAMES_MAP } from "./constants/accents";
// import { ACCENT_COUNT } from "./palette"; // Controla a quantidade de accents (accent0..accentN). Aumente junto com DEFAULT_ACCENT_COLORS e ACCENT_COLOR_NAMES_MAP ao adicionar novas cores.
import { color } from "./palette";
import type { AccentColorOptions, ColorName, ColorPalette } from "./types";

export const getAccentColors = (
  {
    main = true,
    light = true,
    dark = true,
    harmony = false,
    gray = true,
  }: AccentColorOptions = {},
  palette?: ColorPalette,
): string[] => {
  const ranges: string[][] = [];
  if (main) {
    ranges.push(getMainAccentColors(palette, gray));
  }
  if (light) {
    ranges.push(getLightAccentColors(palette, gray));
  }
  if (dark) {
    ranges.push(getDarkAccentColors(palette, gray));
  }

  return harmony ? _.unzip(ranges).flat() : ranges.flat();
};

const getBaseAccentsNames = (withGray = false) => {
  const names: ColorName[] = ACCENT_COLOR_NAMES_MAP.map(
    (entry) => entry.base as ColorName,
  );
  if (!withGray) {
    return names.filter((n) => n !== ("accent-gray" as ColorName));
  }

  return names;
};

export const getMainAccentColors = (
  palette?: ColorPalette,
  withGray = false,
): string[] => {
  // Ensure that colors are defined in hex, not HSLA
  return getBaseAccentsNames(withGray).map((accent, i) => {
    const def = LIGHT_THEME_ACCENT_COLORS[i];
    if (def && typeof def !== "string") {
      return Color(def.base).hex();
    }

    try {
      const c = color(accent, palette);
      // If palette returned an unresolved token, fall back to default string value
      if (typeof c === "string" && c.startsWith("accent")) {
        if (typeof def === "string") {
          return Color(def).hex();
        }
        // fallback generic
        return Color(accent).hex();
      }

      return Color(c).hex();
    } catch (e) {
      if (typeof def === "string") {
        return Color(def).hex();
      }
      // eslint-disable-next-line metabase/no-color-literals
      return "#000000";
    }
  });
};

export const getLightAccentColors = (
  palette?: ColorPalette,
  withGray = false,
): string[] => {
  return getBaseAccentsNames(withGray).map((accent, i) => {
    const def = LIGHT_THEME_ACCENT_COLORS[i];
    if (def && typeof def !== "string") {
      return Color(def.tint ?? def.base).hex();
    }

    try {
      const c = color(`${accent}-light` as ColorName, palette);
      if (typeof c === "string" && c.startsWith("accent")) {
        if (typeof def === "string") {
          return Color(def)
            .lightness(Color(def).lightness() + 12.5)
            .hex();
        }
        return Color(accent)
          .lightness(Color(accent).lightness() + 12.5)
          .hex();
      }

      return Color(c).hex();
    } catch (e) {
      if (typeof def === "string") {
        return Color(def)
          .lightness(Color(def).lightness() + 12.5)
          .hex();
      }
      // eslint-disable-next-line metabase/no-color-literals
      return "#000000";
    }
  });
};

export const getDarkAccentColors = (
  palette?: ColorPalette,
  withGray = false,
) => {
  return getBaseAccentsNames(withGray).map((accent, i) => {
    const def = LIGHT_THEME_ACCENT_COLORS[i];
    if (def && typeof def !== "string") {
      return Color(def.shade ?? def.base).hex();
    }

    try {
      const c = color(`${accent}-dark` as ColorName, palette);
      if (typeof c === "string" && c.startsWith("accent")) {
        if (typeof def === "string") {
          return Color(def)
            .lightness(Color(def).lightness() - 12.5)
            .hex();
        }
        return Color(accent)
          .lightness(Color(accent).lightness() - 12.5)
          .hex();
      }

      return Color(c).hex();
    } catch (e) {
      if (typeof def === "string") {
        return Color(def)
          .lightness(Color(def).lightness() - 12.5)
          .hex();
      }
      // eslint-disable-next-line metabase/no-color-literals
      return "#000000";
    }
  });
};

export const getStatusColorRanges = (): string[][] => {
  return [
    [color("error"), "transparent", color("success")],
    [color("error"), color("warning"), color("success")],
  ];
};

export const getPreferredColor = (key: string, palette?: ColorPalette) => {
  switch (key.toLowerCase()) {
    case "success":
    case "succeeded":
    case "pass":
    case "passed":
    case "valid":
    case "complete":
    case "completed":
    case "accepted":
    case "active":
    case "profit":
      return color("success", palette);
    case "cancel":
    case "canceled":
    case "cancelled":
    case "error":
    case "fail":
    case "failed":
    case "failure":
    case "failures":
    case "invalid":
    case "rejected":
    case "inactive":
    case "loss":
    case "cost":
    case "deleted":
    case "pending":
      return color("error", palette);
    case "warn":
    case "warning":
    case "incomplete":
    case "unstable":
      return color("warning", palette);
    case "count":
      return color("accent0", palette);
    case "sum":
      return color("accent1", palette);
    case "average":
      return color("accent2", palette);
  }
};
