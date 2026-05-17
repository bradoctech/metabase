import type { BoxProps } from "metabase/ui";

import type { UpsellCardProps } from "./UpsellCard";

/** SP fork: upsell usage analytics prompts are not shown. */
export const UpsellUsageAnalytics = (
  _props: BoxProps &
    Omit<
      UpsellCardProps,
      "children" | "title" | "buttonText" | "buttonLink" | "campaign"
    >,
) => null;
