/* eslint-disable no-color-literals */
import type { MetabaseThemeV2 } from "../../types";

import { METABASE_LIGHT_THEME } from "./light";

/**
 * Theme overrides specific to the São Paulo client deployment.
 * Activated when MB_CURRENT_CLIENT=saopaulo is set at build time.
 *
 * Extends the default light theme — only the differences are declared here.
 */
export const METABASE_SAOPAULO_THEME: MetabaseThemeV2 = {
  ...METABASE_LIGHT_THEME,
  colors: {
    ...METABASE_LIGHT_THEME.colors,
    "button-primary": "#1a1a1a",
    "button-primary-hover": "#404040",
  },
};
