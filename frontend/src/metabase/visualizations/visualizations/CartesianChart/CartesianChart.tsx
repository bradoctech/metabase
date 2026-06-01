import type { EChartsType } from "echarts/core";
import {
  type MouseEvent as ReactMouseEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import React from "react";
import { useSet } from "react-use";

import { isWebkit } from "metabase/lib/browser";
import { ChartRenderingErrorBoundary } from "metabase/visualizations/components/ChartRenderingErrorBoundary";
import { DataPointsVisiblePopover } from "metabase/visualizations/components/DataPointsVisiblePopover/DataPointsVisiblePopover";
import { ResponsiveEChartsRenderer } from "metabase/visualizations/components/EChartsRenderer";
import { LegendCaption } from "metabase/visualizations/components/legend/LegendCaption";
import { X_AXIS_DATA_KEY } from "metabase/visualizations/echarts/cartesian/constants/dataset";
import { getLegendItems } from "metabase/visualizations/echarts/cartesian/model/legend";
import {
  toTitleCase,
  truncateAxisLabel,
} from "metabase/visualizations/echarts/cartesian/option/utils";
import {
  useCartesianChartSeriesColorsClasses,
  useCloseTooltipOnScroll,
} from "metabase/visualizations/echarts/tooltip";
import type { VisualizationProps } from "metabase/visualizations/types";
import {
  CartesianChartLegendLayout,
  CartesianChartRoot,
} from "metabase/visualizations/visualizations/CartesianChart/CartesianChart.styled";
import { useChartEvents } from "metabase/visualizations/visualizations/CartesianChart/use-chart-events";
import type { RowValue } from "metabase-types/api";

import { useChartDebug } from "./use-chart-debug";
import { useModelsAndOption } from "./use-models-and-option";
import { getDashboardAdjustedSettings } from "./utils";

function CartesianChartInner(props: VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // The width and height from props reflect the dimensions of the entire container which includes legend,
  // however, for correct ECharts option calculation we need to use the dimensions of the chart viewport
  const [chartSize, setChartSize] = useState({ width: 0, height: 0 });

  const [hiddenSeries, { toggle: toggleSeriesVisibility }] = useSet<string>();

  const {
    showAllLegendItems,
    hideLegend,
    rawSeries,
    settings: originalSettings,
    autoAdjustSettings = false,
    card,
    getHref,
    width: outerWidth,
    height: outerHeight,
    showTitle,
    headerIcon,
    actionButtons,
    isDashboard,
    isEditing,
    isVisualizer,
    isQueryBuilder,
    isVisualizerCard,
    isFullscreen,
    hovered,
    onChangeCardAndRun,
    onHoverChange,
    canToggleSeriesVisibility,
    titleMenuItems,
  } = props;

  const settings = useMemo(
    () =>
      autoAdjustSettings
        ? getDashboardAdjustedSettings?.({
            settings: originalSettings,
            height: outerHeight,
            width: outerWidth,
          })
        : originalSettings,
    [originalSettings, outerHeight, outerWidth, autoAdjustSettings],
  );

  const { chartModel, timelineEventsModel, option, renderingContext } =
    useModelsAndOption(
      {
        ...props,
        width: chartSize.width,
        height: chartSize.height,
        hiddenSeries,
        settings,
      },
      containerRef,
    );
  useChartDebug({ isQueryBuilder, rawSeries, option, chartModel });

  const chartRef = useRef<EChartsType>();
  const [chartDom, setChartDom] = useState<HTMLElement | null>(null);

  const description = settings["card.description"];

  const legendItems = useMemo(
    () => getLegendItems(chartModel.seriesModels, showAllLegendItems),
    [chartModel, showAllLegendItems],
  );
  const hasLegend = !hideLegend && legendItems.length > 0;

  const handleInit = useCallback((chart: EChartsType) => {
    chartRef.current = chart;
    setChartDom(chart.getDom());
    if (isWebkit()) {
      chartRef.current.on("finished", () => {
        const svg = containerRef.current?.querySelector("svg");
        if (svg) {
          const clipPaths = svg.querySelectorAll('defs > clipPath[id^="zr"]');
          clipPaths.forEach((cp) => cp.setAttribute("id", ""));
        }
      });
    }
  }, []);

  const handleToggleSeriesVisibility = useCallback(
    (event: ReactMouseEvent, seriesIndex: number) => {
      const seriesModel = chartModel.seriesModels[seriesIndex];
      const willShowSeries = hiddenSeries.has(seriesModel.dataKey);
      const hasMoreVisibleSeries =
        chartModel.seriesModels.length - hiddenSeries.size > 1;
      if (hasMoreVisibleSeries || willShowSeries) {
        toggleSeriesVisibility(seriesModel.dataKey);
      }
    },
    [chartModel, hiddenSeries, toggleSeriesVisibility],
  );

  const { onSelectSeries, onOpenQuestion, eventHandlers } = useChartEvents(
    chartRef,
    containerRef,
    chartModel,
    timelineEventsModel,
    option,
    renderingContext,
    props,
  );

  const axisLabelMap = useMemo(() => {
    const map = new Map<string, string>();
    const { xAxisModel, dataset } = chartModel;
    if (!("formatter" in xAxisModel)) {
      return map;
    }
    for (const row of dataset) {
      const rawValue = row[X_AXIS_DATA_KEY];
      if (rawValue == null) {
        continue;
      }
      const fullText = String(xAxisModel.formatter(rawValue as RowValue));
      const displayText = truncateAxisLabel(toTitleCase(fullText));
      if (displayText !== fullText && !map.has(displayText)) {
        map.set(displayText, fullText);
      }
    }
    return map;
  }, [chartModel]);

  const [axisLabelTooltip, setAxisLabelTooltip] = useState<{
    text: string;
    x: number;
    y: number;
  } | null>(null);

  useEffect(() => {
    const el = chartDom;
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
      const fullText = axisLabelMap.get(content);
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
  }, [axisLabelMap, chartDom]);

  const handleResize = useCallback((width: number, height: number) => {
    setChartSize({ width, height });
  }, []);

  // We can't navigate a user to a particular card from a visualizer viz,
  // so title selection is disabled in this case
  const canSelectTitle =
    !!onChangeCardAndRun &&
    (!isVisualizerCard || React.Children.count(titleMenuItems) === 1);

  const seriesColorsCss = useCartesianChartSeriesColorsClasses(
    chartModel,
    settings,
  );

  useCloseTooltipOnScroll(chartRef);

  return (
    <CartesianChartRoot
      isQueryBuilder={isQueryBuilder}
      className="CardVisualization"
    >
      {showTitle && (
        <LegendCaption
          title={settings["card.title"] ?? card.name}
          description={description}
          icon={headerIcon}
          actionButtons={actionButtons}
          hasInfoTooltip={!isDashboard || !isEditing}
          getHref={canSelectTitle ? getHref : undefined}
          onSelectTitle={
            canSelectTitle ? () => onOpenQuestion(card.id) : undefined
          }
          width={outerWidth}
          titleMenuItems={titleMenuItems}
        />
      )}
      <CartesianChartLegendLayout
        isReversed={settings["legend.is_reversed"]}
        hasLegend={hasLegend}
        items={legendItems}
        actionButtons={!showTitle ? actionButtons : undefined}
        hovered={hovered}
        isFullscreen={isFullscreen}
        isQueryBuilder={isQueryBuilder}
        onSelectSeries={onSelectSeries}
        onToggleSeriesVisibility={
          canToggleSeriesVisibility ? handleToggleSeriesVisibility : undefined
        }
        onHoverChange={onHoverChange}
        width={outerWidth}
        height={outerHeight}
      >
        <ResponsiveEChartsRenderer
          ref={containerRef}
          option={option}
          eventHandlers={eventHandlers}
          onResize={handleResize}
          onInit={handleInit}
        >
          <DataPointsVisiblePopover
            isDashboard={isDashboard}
            isVisualizer={isVisualizer}
            chartModel={chartModel}
            settings={settings}
          />
          {axisLabelTooltip && (
            <div
              style={{
                position: "absolute",
                left: axisLabelTooltip.x,
                top: axisLabelTooltip.y - 36,
                transform: "translateX(-50%)",
                background: "var(--mb-color-tooltip-background)",
                color: "var(--mb-color-tooltip-text)",
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "12px",
                pointerEvents: "none",
                whiteSpace: "nowrap",
                zIndex: 100,
                maxWidth: "300px",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {axisLabelTooltip.text}
            </div>
          )}
        </ResponsiveEChartsRenderer>
      </CartesianChartLegendLayout>
      {seriesColorsCss}
    </CartesianChartRoot>
  );
}

export function CartesianChart(props: VisualizationProps) {
  return (
    <ChartRenderingErrorBoundary onRenderError={props.onRenderError}>
      <CartesianChartInner {...props} />
    </ChartRenderingErrorBoundary>
  );
}
