import { PLUGIN_AI_CONTROLS } from "metabase/plugins";
import { hasPremiumFeature } from "metabase-enterprise/settings";

import { getAiControlsNavItems } from "./nav";
import { getAiControlsRoutes } from "./routes";

export function initializePlugin() {
  PLUGIN_AI_CONTROLS.isEnabled = hasPremiumFeature("ai_controls");
  // SP fork: never register upsell-only metabot admin routes or nav gems.
  PLUGIN_AI_CONTROLS.getAiControlsRoutes = getAiControlsRoutes;
  PLUGIN_AI_CONTROLS.getAiControlsNavItems = getAiControlsNavItems;
}
