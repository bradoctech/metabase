import type { IconProps } from "metabase/ui";

/** SP fork: upsell gems are not shown. */
const _UpsellGem = (_props: Omit<IconProps, "name" | "color">) => null;

const UpsellGemNew = (_props: Omit<IconProps, "name" | "color">) => null;

export const UpsellGem = Object.assign(_UpsellGem, {
  New: UpsellGemNew,
});
