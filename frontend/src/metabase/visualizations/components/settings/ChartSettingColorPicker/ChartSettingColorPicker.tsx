import cx from "classnames";

import type { PillSize } from "metabase/common/components/ColorPill";
import { ColorSelector } from "metabase/common/components/ColorSelector";
import CS from "metabase/css/core/index.css";
import { isEmbeddingSdk } from "metabase/embedding-sdk/config";
import { Box, type BoxProps } from "metabase/ui";
import { SP_PALETTE_COLORS } from "metabase/ui/colors/constants/accent-colors";
import type { AccentColorOptions } from "metabase/ui/colors/types";

interface ChartSettingColorPickerProps extends BoxProps {
  className?: string;
  value: string;
  title?: string;
  pillSize?: PillSize;
  onChange?: (newValue: string) => void;
  accentColorOptions?: AccentColorOptions;
}

export const ChartSettingColorPicker = ({
  className,
  value,
  title,
  pillSize,
  onChange,
  accentColorOptions: _accentColorOptions, // kept for API compatibility
  ...boxProps
}: ChartSettingColorPickerProps) => {
  // For the SDK the ColorSelector is rendered inside a parent Mantine popover,
  // so as a nested popover it should not be rendered within a portal
  const withinPortal = !isEmbeddingSdk();

  return (
    <Box className={cx(CS.flex, CS.alignCenter, className)} {...boxProps}>
      <ColorSelector
        value={value}
        colors={SP_PALETTE_COLORS}
        withinPortal={withinPortal}
        onChange={onChange}
        pillSize={pillSize}
      />
      {title && <h4 className={CS.ml1}>{title}</h4>}
    </Box>
  );
};
