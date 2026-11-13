import type { ReactElement } from "react";

import { PORTAL_CONTAINER_ID, Tooltip } from "metabase/ui";

// Keep application overlays outside viz-core so static rendering stays SVG-only.
export function renderAxisLabelTooltip(label: string, target: ReactElement) {
  return (
    <Tooltip.Floating
      role="tooltip"
      portalProps={{ target: `#${PORTAL_CONTAINER_ID}` }}
      label={label}
      multiline
      styles={{
        tooltip: {
          backgroundColor: "var(--mb-color-tooltip-background)",
          color: "var(--mb-color-tooltip-text)",
          borderRadius: "var(--mantine-radius-sm)",
          boxShadow: "var(--mantine-shadow-sm)",
          fontSize: "var(--mantine-font-size-sm)",
          fontWeight: "normal",
          lineHeight: "var(--mantine-line-height-sm)",
          padding: "4px 8px",
          maxWidth: "min(360px, 80vw)",
          overflowWrap: "anywhere",
          pointerEvents: "none",
        },
      }}
    >
      {target}
    </Tooltip.Floating>
  );
}
