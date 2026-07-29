import type { AxisScale } from "@visx/axis";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridColumns } from "@visx/grid";
import { Group } from "@visx/group";
import type { NumberLike, StringLike } from "@visx/scale";
import { scaleBand } from "@visx/scale";
import { Bar } from "@visx/shape";
import { Text } from "@visx/text";
import type { ScaleBand, ScaleContinuousNumeric } from "d3-scale";
import * as React from "react";

import {
  getOriginalAxisLabel,
  registerAxisLabel,
  toTitleCase,
  truncateAxisLabel,
} from "metabase/visualizations/echarts/cartesian/option/utils";
import { truncateText } from "metabase/visualizations/lib/text";
import type { HoveredData } from "metabase/visualizations/shared/types/events";
import type { Margin } from "metabase/visualizations/shared/types/layout";
import type { TextWidthMeasurer } from "metabase/visualizations/shared/types/measure-text";

import type { SeriesInfo } from "../../types/data";
import type { BarData, RowChartTheme, SeriesData } from "../RowChart/types";
import { VerticalGoalLine } from "../VerticalGoalLine/VerticalGoalLine";

import { DATA_LABEL_OFFSET } from "./constants";
import { getDataLabel } from "./utils/data-labels";

export interface RowChartViewProps<TDatum> {
  width?: number | null;
  height?: number | null;
  yScale: ScaleBand<StringLike>;
  xScale: ScaleContinuousNumeric<number, number, never>;
  seriesData: SeriesData<TDatum, SeriesInfo>[];
  labelsFormatter: (value: NumberLike) => string;
  yTickFormatter: (value: StringLike) => string;
  xTickFormatter: (value: NumberLike) => string;
  xTicks: number[];
  goal: {
    label: string;
    value: number;
    position: "left" | "right";
  } | null;
  theme: RowChartTheme;
  margin: Margin;
  innerWidth: number;
  innerHeight: number;
  labelledSeries?: string[] | null;
  xLabel?: string | null;
  yLabel?: string | null;
  hasXAxis?: boolean;
  hasYAxis?: boolean;
  isStacked?: boolean;
  style?: React.CSSProperties;
  hoveredData?: HoveredData | null;
  measureTextWidth?: TextWidthMeasurer;
  onHover?: (
    event: React.MouseEvent<Element>,
    bar: BarData<TDatum, SeriesInfo> | null,
  ) => void;
  onClick?: (
    event: React.MouseEvent<Element>,
    bar: BarData<TDatum, SeriesInfo>,
  ) => void;
}

const RowChartView = <TDatum,>({
  width,
  height,
  innerHeight,
  xScale,
  yScale,
  seriesData,
  goal,
  theme,
  margin,
  labelsFormatter,
  yTickFormatter,
  xTickFormatter,
  xTicks,
  labelledSeries,
  yLabel,
  xLabel,
  hasXAxis = true,
  hasYAxis = true,
  isStacked,
  style,
  hoveredData,
  measureTextWidth,
  onHover,
  onClick,
}: RowChartViewProps<TDatum>) => {
  const svgRef = React.useRef<SVGSVGElement | null>(null);
  const [axisLabelTooltip, setAxisLabelTooltip] = React.useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  const innerBarScale = isStacked
    ? null
    : scaleBand({
        domain: seriesData.map((_, index) => index),
        range: [0, yScale.bandwidth()],
      });

  const goalLineX = xScale(goal?.value ?? 0);

  const ellipsifiedYTickFormatter = React.useMemo(() => {
    if (!measureTextWidth || !width) {
      return yTickFormatter;
    }

    // Calculate the maximum allowed width for y-axis labels (50% of chart width)
    const maxLabelWidth =
      margin.left - (yLabel ? theme.axis.label.size * 2 : 0);

    return (value: StringLike) => {
      const originalText = yTickFormatter(value);
      const titleCased = toTitleCase(originalText);
      const charLimitedText = truncateAxisLabel(titleCased);
      const displayText = truncateText(
        charLimitedText,
        maxLabelWidth,
        measureTextWidth,
        theme.axis.ticks,
      );

      if (displayText !== originalText) {
        registerAxisLabel(displayText, originalText);
      }

      return displayText;
    };
  }, [
    measureTextWidth,
    width,
    margin.left,
    yLabel,
    theme.axis.label.size,
    theme.axis.ticks,
    yTickFormatter,
  ]);

  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      const target = e.target as Element;
      const textEl =
        target.tagName === "text"
          ? (target as SVGTextElement)
          : target.closest("text");

      if (!textEl) {
        setAxisLabelTooltip(null);
        return;
      }

      const content = textEl.textContent?.trim() ?? "";
      const fullText = getOriginalAxisLabel(content);
      if (fullText) {
        const containerRect = el.getBoundingClientRect();
        setAxisLabelTooltip({
          text: fullText,
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top,
        });
      } else {
        setAxisLabelTooltip(null);
      }
    };

    const handleMouseLeave = () => setAxisLabelTooltip(null);

    el.addEventListener("mousemove", handleMouseMove);
    el.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      el.removeEventListener("mousemove", handleMouseMove);
      el.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <svg
        ref={svgRef}
        width={width ?? undefined}
        height={height ?? undefined}
        style={style}
      >
        <Group top={margin.top} left={margin.left}>
          <GridColumns
            scale={xScale as AxisScale<number>}
            height={innerHeight}
            stroke={theme.grid.color}
            tickValues={xTicks}
          />

          {seriesData.map((series, seriesIndex) => {
            return series.bars.map((bar) => {
              const { xStartValue, xEndValue, isNegative, yValue, datumIndex } =
                bar;
              let y = yScale(yValue);

              if (y == null || xStartValue == null || xEndValue == null) {
                return null;
              }

              y += innerBarScale?.(seriesIndex) ?? 0;

              const x = xScale(xStartValue);
              const width = Math.abs(xScale(xEndValue) - x);

              const hasSeriesHover = hoveredData != null;
              const isSeriesHovered = hoveredData?.seriesIndex === seriesIndex;
              const isDatumHovered = hoveredData?.datumIndex === datumIndex;

              const shouldHighlightBar =
                seriesData.length === 1 && isDatumHovered;
              const shouldHighlightSeries =
                seriesData.length > 1 && isSeriesHovered;

              const opacity =
                !hasSeriesHover || shouldHighlightSeries || shouldHighlightBar
                  ? 1
                  : 0.4;

              const label = getDataLabel(
                bar,
                xScale,
                series.key,
                isStacked,
                labelledSeries,
              );

              const height = innerBarScale?.bandwidth() ?? yScale.bandwidth();
              const value = isNegative ? xStartValue : xEndValue;
              const barKey = `${seriesIndex}:${datumIndex}`;
              const ariaLabelledBy = `bar-${barKey}-value`;

              return (
                <React.Fragment key={barKey}>
                  <Bar
                    aria-label={String(value)}
                    role="graphics-symbol"
                    aria-roledescription="bar"
                    aria-labelledby={label != null ? ariaLabelledBy : undefined}
                    style={{ transition: "opacity 300ms", cursor: "pointer" }}
                    key={barKey}
                    x={x}
                    y={y}
                    width={width}
                    height={height}
                    fill={series.color}
                    opacity={opacity}
                    onClick={(event) => onClick?.(event, bar)}
                    onMouseEnter={(event) => onHover?.(event, bar)}
                    onMouseLeave={(event) => onHover?.(event, null)}
                  />
                  {label != null && (
                    <Text
                      data-testid="data-label"
                      id={ariaLabelledBy}
                      textAnchor={isNegative ? "end" : "start"}
                      fontSize={theme.dataLabels.size}
                      fill={theme.dataLabels.color}
                      fontWeight={theme.dataLabels.weight}
                      dx={(isNegative ? "-" : "") + DATA_LABEL_OFFSET}
                      x={xScale(value)}
                      y={y + height / 2}
                      verticalAnchor="middle"
                    >
                      {labelsFormatter(label)}
                    </Text>
                  )}
                </React.Fragment>
              );
            });
          })}

          {goal && (
            <VerticalGoalLine
              x={goalLineX}
              height={innerHeight}
              label={goal.label}
              style={theme.goal}
              position={goal.position}
            />
          )}

          <AxisLeft
            label={yLabel ?? ""}
            labelProps={{
              fill: theme.axis.label.color,
              fontFamily: theme.dataLabels.family,
              fontSize: theme.axis.label.size,
              fontWeight: theme.axis.label.weight,
              textAnchor: "middle",
              verticalAnchor: "start",
            }}
            labelOffset={margin.left - theme.axis.label.size}
            tickFormat={ellipsifiedYTickFormatter}
            hideAxisLine={!hasYAxis}
            hideTicks
            tickValues={hasYAxis ? undefined : []}
            numTicks={Infinity}
            scale={yScale}
            stroke={theme.axis.color}
            tickStroke={theme.axis.color}
            tickLabelProps={(value) => ({
              fill: theme.axis.ticks.color,
              fontFamily: theme.dataLabels.family,
              fontSize: theme.axis.ticks.size,
              fontWeight: theme.axis.ticks.weight,
              textAnchor: "end",
              dy: "0.33em",
              title: toTitleCase(yTickFormatter(value)),
            })}
          />
          <AxisBottom
            label={xLabel ?? ""}
            labelProps={{
              fill: theme.axis.label.color,
              fontFamily: theme.dataLabels.family,
              fontSize: theme.axis.label.size,
              fontWeight: theme.axis.label.weight,
              textAnchor: "middle",
              dy: hasXAxis ? undefined : "-1em",
            }}
            hideAxisLine={!hasXAxis}
            hideTicks
            tickValues={hasXAxis ? xTicks : []}
            tickFormat={xTickFormatter}
            top={innerHeight}
            scale={xScale as AxisScale<number>}
            stroke={theme.axis.color}
            tickStroke={theme.axis.color}
            tickLabelProps={() => ({
              fill: theme.axis.ticks.color,
              fontFamily: theme.dataLabels.family,
              fontSize: theme.axis.ticks.size,
              fontWeight: theme.axis.ticks.weight,
              textAnchor: "middle",
            })}
          />
        </Group>
      </svg>
      {axisLabelTooltip && (
        <div
          style={{
            position: "absolute",
            left: axisLabelTooltip.x,
            top: axisLabelTooltip.y - 34,
            transform: "translateX(-50%)",
            background: "var(--mb-color-tooltip-background)",
            color: "var(--mb-color-tooltip-text)",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: "12px",
            pointerEvents: "none",
            whiteSpace: "nowrap",
            zIndex: 100,
          }}
        >
          {axisLabelTooltip.text}
        </div>
      )}
    </div>
  );
};

// eslint-disable-next-line import/no-default-export -- deprecated usage
export default RowChartView;
