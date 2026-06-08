import { useEffect, useMemo, useRef } from "react";
import { t } from "ttag";

import DashboardS from "metabase/css/dashboard.module.css";
import { Box } from "metabase/ui";
import {
  ScalarValue,
  ScalarWrapper,
} from "metabase/visualizations/components/ScalarValue/ScalarValue";
import { useBrowserRenderingContext } from "metabase/visualizations/hooks/use-browser-rendering-context";
import { ChartSettingsError } from "metabase/visualizations/lib/errors";
import { compactifyValue } from "metabase/visualizations/lib/scalar_utils";
import { columnSettings } from "metabase/visualizations/lib/settings/column";
import { fieldSetting } from "metabase/visualizations/lib/settings/utils";
import {
  getDefaultSize,
  getMinSize,
} from "metabase/visualizations/shared/utils/sizes";
import type {
  VisualizationDefinition,
  VisualizationPassThroughProps,
  VisualizationProps,
  VisualizationSettingsDefinitions,
} from "metabase/visualizations/types";
import { isDimension, isMetric } from "metabase-lib/v1/types/utils/isa";
import type { DatasetData, Series } from "metabase-types/api";

import { ScalarValueContainer } from "../Scalar/ScalarValueContainer";

import { PreviousValueComparison } from "./PreviousValueComparison";
import { ScalarPeriod } from "./ScalarPeriod";
import { SmartScalarComparisonWidget } from "./SettingsComponents/SmartScalarSettingsWidgets";
import { computeTrend } from "./compute";
import {
  DASHCARD_HEADER_HEIGHT,
  MAX_COMPARISONS,
  VIZ_SETTINGS_DEFAULTS,
} from "./constants";
import {
  getColumnsForComparison,
  getComparisonOptions,
  getComparisons,
  getDefaultComparison,
  getValueHeight,
  getValueWidth,
  isPeriodVisible,
  isSuitableScalarColumn,
  validateComparisons,
} from "./utils";

export function SmartScalar({
  onVisualizationClick,
  isDashboard,
  settings,
  visualizationIsClickable,
  series,
  rawSeries,
  gridSize,
  width,
  height,
  totalNumGridCols,
  fontFamily,
  onRenderError,
}: VisualizationProps & VisualizationPassThroughProps) {
  const scalarRef = useRef(null);
  const { getColor } = useBrowserRenderingContext({ fontFamily });

  const insights = rawSeries?.[0].data?.insights;
  const normalizedSeries = useMemo(() => {
    try {
      const cols = series?.[0]?.data?.cols ?? [];
      const metricColIndex = cols.findIndex(
        (col) => col.name === settings["scalar.field"],
      );
      if (metricColIndex < 0) {
        return series;
      }
      let needsReplace = false;
      for (const s of series) {
        if (!("data" in s)) {
          continue;
        }
        const rows = s.data.rows ?? [];
        for (const row of rows) {
          if (row[metricColIndex] === null) {
            needsReplace = true;
            break;
          }
        }
        if (needsReplace) {
          break;
        }
      }
      if (!needsReplace) {
        return series;
      }

      return series.map((s) => {
        if (!("data" in s)) {
          return s;
        }
        return {
          ...s,
          data: {
            ...s.data,
            rows: s.data.rows.map((row) => {
              if (row[metricColIndex] === null) {
                const copy = row.slice();
                copy[metricColIndex] = 0;
                return copy;
              }
              return row;
            }),
          },
        } as typeof s;
      });
    } catch {
      return series;
    }
  }, [series, settings]);

  const { trend, error } = useMemo(
    () => computeTrend(normalizedSeries, insights, settings, { getColor }),
    [normalizedSeries, insights, settings, getColor],
  );

  useEffect(() => {
    if (error) {
      onRenderError(error.message);
    }
  }, [error, onRenderError]);

  if (trend == null) {
    return null;
  }

  const { value, clicked, comparisons, display, formatOptions } = trend;

  const innerHeight = isDashboard ? height - DASHCARD_HEADER_HEIGHT : height;

  const isClickable = onVisualizationClick != null;

  const handleClick = () => {
    if (scalarRef.current == null) {
      return;
    }

    const clickData = { ...clicked, element: scalarRef.current };

    if (
      scalarRef.current &&
      onVisualizationClick &&
      visualizationIsClickable(clickData)
    ) {
      onVisualizationClick(clickData);
    }
  };

  const { displayValue, fullScalarValue } = compactifyValue(
    value,
    width,
    formatOptions,
  );

  const { valueHeight, comparisonsCount } = getValueHeight(
    innerHeight,
    comparisons.length,
  );

  return (
    <ScalarWrapper>
      <ScalarValueContainer
        className={DashboardS.fullscreenNormalText}
        tooltip={fullScalarValue}
        alwaysShowTooltip={fullScalarValue !== displayValue}
        isClickable={isClickable}
      >
        <span onClick={handleClick} ref={scalarRef}>
          <ScalarValue
            fontFamily={fontFamily}
            gridSize={gridSize}
            height={valueHeight}
            totalNumGridCols={totalNumGridCols}
            value={displayValue as string}
            width={getValueWidth(width)}
          />
        </span>
      </ScalarValueContainer>
      {isPeriodVisible(innerHeight) && <ScalarPeriod period={display.date} />}

      {comparisonsCount === 1 && (
        <Box maw="100%" data-testid="scalar-previous-value">
          <PreviousValueComparison
            comparison={comparisons[0]}
            fontFamily={fontFamily}
            formatOptions={formatOptions}
            tooltipComparisons={comparisons}
            width={width}
          />
        </Box>
      )}

      {comparisonsCount !== 1 &&
        comparisons.map((comparison, index) => (
          <Box maw="100%" key={index} data-testid="scalar-previous-value">
            <PreviousValueComparison
              comparison={comparison}
              fontFamily={fontFamily}
              formatOptions={formatOptions}
              tooltipComparisons={[comparison]}
              width={width}
            />
          </Box>
        ))}
    </ScalarWrapper>
  );
}

export const SETTINGS_DEFINITIONS: VisualizationSettingsDefinitions = {
  ...fieldSetting("scalar.field", {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    section: t`Data`,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    title: t`Primary number`,
    fieldFilter: isSuitableScalarColumn,
  }),
  "scalar.comparisons": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    section: t`Data`,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    title: t`Comparisons`,
    widget: SmartScalarComparisonWidget,
    getValue: (series, vizSettings) => getComparisons(series, vizSettings),
    isValid: (series, vizSettings) => validateComparisons(series, vizSettings),
    getDefault: (series, vizSettings) =>
      getDefaultComparison(series, vizSettings),
    getProps: (series, vizSettings) => {
      const cols = series[0].data.cols;
      return {
        maxComparisons: MAX_COMPARISONS,
        comparableColumns: getColumnsForComparison(cols, vizSettings),
        options: getComparisonOptions(series, vizSettings),
        series,
        settings: vizSettings,
      };
    },
    readDependencies: ["scalar.field"],
  },
  "scalar.switch_positive_negative": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    section: t`Display`,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    title: t`Switch positive / negative colors?`,
    widget: "toggle",
    inline: true,
    getDefault: () => VIZ_SETTINGS_DEFAULTS["scalar.switch_positive_negative"],
  },
  "scalar.compact_primary_number": {
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    section: t`Display`,
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    title: t`Compact number`,
    widget: "toggle",
    inline: true,
    getDefault: () => VIZ_SETTINGS_DEFAULTS["scalar.compact_primary_number"],
  },
  ...columnSettings({
    // eslint-disable-next-line ttag/no-module-declaration -- see metabase#55045
    section: t`Display`,
    getColumns: (
      [
        {
          data: { cols },
        },
      ],
      settings,
    ) => [
      // try and find a selected field setting
      cols.find((col) => col.name === settings["scalar.field"]) ||
        // fall back to the second column
        cols[1] ||
        // but if there's only one column use that
        cols[0],
    ],
    readDependencies: ["scalar.field"],
  }),
  click_behavior: {},
};

const SmartScalarViz: VisualizationDefinition = {
  getUiName: () => t`Trend`,
  identifier: "smartscalar",
  iconName: "smartscalar",
  canSavePng: true,

  minSize: getMinSize("smartscalar"),
  defaultSize: getDefaultSize("smartscalar"),

  settings: SETTINGS_DEFINITIONS,

  isSensible({ cols, insights }: DatasetData) {
    const dimensionCount = cols.filter(
      (col) => isDimension(col) && !isMetric(col),
    ).length;
    return !!insights && insights?.length > 0 && dimensionCount === 1;
  },

  // Smart scalars need to have a breakout
  checkRenderable([
    {
      data: { insights },
    },
  ]: Series) {
    if (!insights || insights.length === 0) {
      throw new ChartSettingsError(
        t`Group only by a time field to see how this has changed over time`,
      );
    }
  },

  hasEmptyState: true,
};

Object.assign(SmartScalar, SmartScalarViz);
