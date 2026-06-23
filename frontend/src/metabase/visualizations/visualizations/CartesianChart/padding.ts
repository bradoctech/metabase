import type { MantineTheme } from "metabase/ui";

export const getChartPadding = ({
  theme,
  isQueryBuilder,
}: {
  isQueryBuilder?: boolean;
  theme: MantineTheme;
}) => {
  const { padding } = theme.other.cartesian;

  if (padding) {
    return padding;
  }

  // Extra spacing is required on question pages.
  // Refer to https://github.com/metabase/metabase/pull/17552#issuecomment-904945088
  if (isQueryBuilder) {
    return "1rem 1rem 1rem 2rem";
  }

  // Use larger padding inside DashCards to increase spacing around charts.
  // 1.5rem ~= 24px (assuming 16px root font size).
  return "1.25rem";
};
