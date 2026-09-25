import { useEffect, useMemo, useRef } from "react";

import DashboardS from "metabase/css/dashboard.module.css";
import { Box } from "metabase/ui";
import {
  ScalarValue,
  ScalarWrapper,
} from "metabase/visualizations/components/ScalarValue/ScalarValue";
import { useBrowserRenderingContext } from "metabase/visualizations/hooks/use-browser-rendering-context";
import { compactifyValue } from "metabase/visualizations/lib/scalar_utils";
import type {
  VisualizationPassThroughProps,
  VisualizationProps,
} from "metabase/visualizations/types";

import { ScalarValueContainer } from "../Scalar/ScalarValueContainer";

import { PreviousValueComparison } from "./PreviousValueComparison";
import { ScalarPeriod } from "./ScalarPeriod";
import { computeTrend } from "./compute";
import { DASHCARD_HEADER_HEIGHT } from "./constants";
import { SMART_SCALAR_CHART_DEFINITION } from "./definition";
import { getValueHeight, getValueWidth, isPeriodVisible } from "./utils";

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

Object.assign(SmartScalar, SMART_SCALAR_CHART_DEFINITION);
