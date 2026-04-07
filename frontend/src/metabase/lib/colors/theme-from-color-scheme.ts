import { IS_SAOPAULO_CLIENT } from "metabase/lib/client-config";

import type { ResolvedColorScheme } from "../color-scheme";

import { METABASE_DARK_THEME } from "./constants/themes/dark";
import { METABASE_LIGHT_THEME } from "./constants/themes/light";
import { METABASE_SAOPAULO_THEME } from "./constants/themes/saopaulo";
import type { MetabaseThemeV2 } from "./types";

/** Returns the theme definition for a color scheme. */
export const getThemeFromColorScheme = (
  colorScheme: ResolvedColorScheme,
): MetabaseThemeV2 => {
  if (colorScheme === "dark") {
    return METABASE_DARK_THEME;
  }
  return IS_SAOPAULO_CLIENT ? METABASE_SAOPAULO_THEME : METABASE_LIGHT_THEME;
};
