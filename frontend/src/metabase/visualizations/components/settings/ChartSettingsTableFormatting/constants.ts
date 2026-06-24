import { SP_PALETTE_COLORS } from "metabase/ui/colors/constants/accent-colors";
import { getStatusColorRanges } from "metabase/ui/colors/groups";
import type {
  ColumnRangeFormattingSetting,
  ColumnSingleFormattingSetting,
} from "metabase-types/api";

// TODO
export const COLORS = SP_PALETTE_COLORS;
export const COLOR_RANGES = getStatusColorRanges();

export const DEFAULTS_BY_TYPE: {
  single: ColumnSingleFormattingSetting;
  range: ColumnRangeFormattingSetting;
} = {
  single: {
    columns: [],
    type: "single",
    operator: "=",
    value: "",
    color: COLORS[0],
    highlight_row: false,
  },
  range: {
    columns: [],
    type: "range",
    colors: COLOR_RANGES[0],
    min_type: null,
    max_type: null,
    min_value: 0,
    max_value: 100,
  },
};
