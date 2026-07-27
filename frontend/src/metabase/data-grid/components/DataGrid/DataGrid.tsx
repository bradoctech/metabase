import { DndContext } from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import type { HeaderGroup } from "@tanstack/react-table";
import cx from "classnames";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import _ from "underscore";

import { useForceUpdate } from "metabase/common/hooks/use-force-update";
import { getScrollBarSize } from "metabase/lib/dom";

import {
  ADD_COLUMN_BUTTON_WIDTH,
  DEFAULT_FONT_SIZE,
  GRID_HORIZONTAL_PADDING,
  HEADER_HEIGHT,
  PINNED_BORDER_SEPARATOR_WIDTH,
} from "../../constants";
import { DataGridThemeProvider } from "../../hooks";
import { useDataGridColumnsReordering } from "../../hooks/use-data-grid-columns-reordering";
import type {
  DataGridColumnType,
  DataGridInstance,
  DataGridRowType,
  DataGridTheme,
} from "../../types";
import { AddColumnButton } from "../AddColumnButton/AddColumnButton";
import { DataGridHeader } from "../DataGridHeader/DataGridHeader";
import { DataGridRow } from "../DataGridRow/DataGridRow";
import { Footer } from "../Footer/Footer";

import S from "./DataGrid.module.css";
import type { DataGridStylesProps } from "./types";

export interface DataGridProps<TData>
  extends DataGridInstance<TData>, DataGridStylesProps {
  emptyState?: React.ReactNode;
  showRowsCount?: boolean;
  rowsTruncated?: number;
  isColumnReorderingDisabled?: boolean;
  theme?: DataGridTheme;
  zoomedRowIndex?: number;
  tableFooterExtraButtons?: React.ReactNode;
}

export const DataGrid = function DataGrid<TData>({
  table,
  gridRef,
  virtualGrid,
  measureRoot,
  columnsReordering,
  selection,
  theme,
  classNames,
  styles,
  enablePagination,
  showRowsCount,
  getPinnedRows,
  getCenterRows,
  getPinnedColumns,
  getCenterColumns,
  getTotalHeight,
  datasetIndexAttributeName,
  rowMeasureRef,
  emptyState,
  zoomedRowIndex,
  onBodyCellClick,
  onWheel,
  tableFooterExtraButtons,
  rowsTruncated,
  onAddColumnClick,
  onHeaderCellClick,
  isColumnReorderingDisabled,
  setPinnedLeftColumnsCount,
}: DataGridProps<TData>) {
  const { columnVirtualizer, virtualIndexAttributeName } = virtualGrid;

  const [activeRowIndex, setActiveRowIndex] = useState<number | null>(null);
  const activeRowIndexRef = useRef<number | null>(null);

  const [headerHeight, setHeaderHeight] = useState(HEADER_HEIGHT);
  const headerRef = useCallback((node: HTMLDivElement | null) => {
    setHeaderHeight(node?.offsetHeight ?? HEADER_HEIGHT);
  }, []);

  const forceUpdate = useForceUpdate();
  useEffect(() => {
    const handleResize = _.debounce(forceUpdate, 100);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [forceUpdate]);

  const hasAddColumnButton = onAddColumnClick != null;
  const isAddColumnButtonSticky =
    hasAddColumnButton &&
    table.getTotalSize() >=
      (gridRef.current?.offsetWidth ?? Infinity) - ADD_COLUMN_BUTTON_WIDTH;

  const rowsCount = table.getRowModel().rows.length;
  const backgroundColor =
    theme?.cell?.backgroundColor ?? "var(--mb-color-background-primary)";
  const stickyElementsBackgroundColor =
    theme?.stickyBackgroundColor ??
    (backgroundColor == null || backgroundColor === "transparent"
      ? "var(--mb-color-background-primary)"
      : backgroundColor);

  const centerRows = getCenterRows();
  const pinnedRows = getPinnedRows();
  const pinnedColumns = getPinnedColumns();
  const centerColumns = getCenterColumns();
  const lastPinnedColumn = pinnedColumns.at(-1);
  const isLastPinnedColumnSpecial =
    lastPinnedColumn?.origin.columnDef.meta?.isUtilityColumn === true;
  const hasSeparator = lastPinnedColumn != null && !isLastPinnedColumnSpecial;

  // const pinnedDataColumnsCount = pinnedColumns.filter(
  //   (col) => col.origin.columnDef.meta?.isUtilityColumn !== true,
  // ).length;

  const handlePinColumn = useCallback(
    (columnId: string) => {
      if (!setPinnedLeftColumnsCount) {
        return;
      }
      const targetColumn = table.getColumn(columnId);
      const isPinned = targetColumn?.getIsPinned() === "left";
      if (isPinned) {
        setPinnedLeftColumnsCount(0);
        return;
      }
      const dataColumnOrder = table
        .getState()
        .columnOrder.filter(
          (id) => table.getColumn(id)?.columnDef.meta?.isUtilityColumn !== true,
        );
      const colDataIndex = dataColumnOrder.indexOf(columnId);
      if (colDataIndex !== -1) {
        setPinnedLeftColumnsCount(colDataIndex + 1);
      }
    },
    [table, setPinnedLeftColumnsCount],
  );

  const dndContextProps = useDataGridColumnsReordering(
    columnsReordering,
    pinnedColumns,
  );

  const pinnedColumnsWidth = table.getLeftTotalSize();
  const pinnedPanelWidth = hasSeparator
    ? pinnedColumnsWidth + PINNED_BORDER_SEPARATOR_WIDTH
    : pinnedColumnsWidth;

  const totalHeight = getTotalHeight();

  const addColumnMarginRight =
    totalHeight >= (gridRef.current?.offsetHeight ?? Infinity)
      ? getScrollBarSize()
      : 0;

  const handleBodyCellClickWithRowHighlight = useCallback(
    (
      event: React.MouseEvent<HTMLDivElement>,
      rowIndex: number,
      columnId: string,
    ) => {
      const next = activeRowIndexRef.current === rowIndex ? null : rowIndex;
      activeRowIndexRef.current = next;
      setActiveRowIndex(next);
      onBodyCellClick?.(event, rowIndex, columnId);
    },
    [onBodyCellClick],
  );

  const renderRow = (
    row: DataGridRowType<TData>,
    columns: DataGridColumnType<TData>[],
    measureRef?: (element: Element | null) => void,
  ) => (
    <DataGridRow
      key={row.virtualItem?.key ?? row.origin.id}
      row={row}
      rowMeasureRef={measureRef}
      pinnedRowsCount={pinnedRows.length}
      columns={columns}
      datasetIndexAttributeName={datasetIndexAttributeName}
      virtualIndexAttributeName={virtualIndexAttributeName}
      zoomedRowIndex={zoomedRowIndex}
      activeRowIndex={activeRowIndex}
      selection={selection}
      onBodyCellClick={handleBodyCellClickWithRowHighlight}
      classNames={classNames}
      styles={styles}
    />
  );

  const renderHeader = (
    headerGroup: HeaderGroup<TData>,
    columns: DataGridColumnType<TData>[],
  ) => (
    <DataGridHeader
      headerGroup={headerGroup}
      columns={columns}
      backgroundColor={backgroundColor}
      onHeaderCellClick={onHeaderCellClick}
      isColumnReorderingDisabled={isColumnReorderingDisabled}
      // pinnedDataColumnsCount={pinnedDataColumnsCount}
      onPinColumn={setPinnedLeftColumnsCount ? handlePinColumn : undefined}
      styles={styles}
    />
  );

  const renderGridPanels = ({
    pinnedContent,
    centerContent,
    rowsSection,
    minHeight,
  }: {
    pinnedContent: React.ReactNode;
    centerContent: React.ReactNode;
    rowsSection: "pinned" | "center" | "header";
    minHeight?: string;
  }) => (
    <>
      {pinnedColumns.length > 0 && (
        <div
          className={cx(S.pinnedColumnsSection, {
            [S.withSeparator]: hasSeparator,
          })}
          data-testid={`${rowsSection}-pinned-quadrant`}
          style={{
            width: pinnedPanelWidth,
            minHeight,
            backgroundColor: stickyElementsBackgroundColor,
          }}
        >
          {pinnedContent}
        </div>
      )}
      <div
        className={S.centerColumnsSection}
        data-testid={`${rowsSection}-center-quadrant`}
        style={{
          minHeight,
          width: `${columnVirtualizer.getTotalSize()}px`,
          backgroundColor,
        }}
      >
        {centerContent}
      </div>
    </>
  );

  const renderBodyGridPanels = (
    rows: DataGridRowType<TData>[],
    rowsSection: "pinned" | "center" | "header",
    measureRef?: (element: Element | null) => void,
    minHeight?: string,
  ) =>
    renderGridPanels({
      pinnedContent: rows.map((row) => renderRow(row, pinnedColumns)),
      centerContent: rows.map((row) =>
        renderRow(row, centerColumns, measureRef),
      ),
      minHeight,
      rowsSection,
    });

  return (
    <DataGridThemeProvider theme={theme}>
      <DndContext {...dndContextProps}>
        {measureRoot}
        <div
          className={cx(S.table, classNames?.root)}
          data-testid="table-root"
          data-rows-count={rowsCount}
          style={{
            fontSize: theme?.fontSize ?? DEFAULT_FONT_SIZE,
            backgroundColor,
            ...styles?.root,
          }}
        >
          <div
            ref={gridRef}
            data-testid="table-scroll-container"
            className={cx(S.tableGrid, classNames?.tableGrid)}
            role="grid"
            style={{
              backgroundColor,
              color: theme?.cell?.textColor,
              boxSizing: "border-box",
              paddingLeft: `${GRID_HORIZONTAL_PADDING}px`,
              paddingRight:
                hasAddColumnButton && isAddColumnButtonSticky
                  ? `calc(${GRID_HORIZONTAL_PADDING}px + ${ADD_COLUMN_BUTTON_WIDTH}px)`
                  : `${GRID_HORIZONTAL_PADDING}px`,
              ...styles?.tableGrid,
            }}
            onWheel={onWheel}
          >
            <div
              ref={headerRef}
              data-testid="table-header"
              role="rowgroup"
              className={cx(S.headerContainer, classNames?.headerContainer)}
              style={{
                backgroundColor: stickyElementsBackgroundColor,
                ...styles?.headerContainer,
              }}
            >
              {table.getHeaderGroups().map((headerGroup) => (
                <SortableContext
                  key={headerGroup.id}
                  items={table.getState().columnOrder}
                  strategy={horizontalListSortingStrategy}
                >
                  {renderGridPanels({
                    pinnedContent: renderHeader(headerGroup, pinnedColumns),
                    centerContent: renderHeader(headerGroup, centerColumns),
                    rowsSection: "header",
                  })}
                </SortableContext>
              ))}
              {hasAddColumnButton && !isAddColumnButtonSticky && (
                <AddColumnButton onClick={onAddColumnClick} />
              )}
            </div>

            {rowsCount === 0 ? (
              emptyState
            ) : (
              <div
                data-testid="table-body"
                role="rowgroup"
                className={cx(
                  S.bodyContainer,
                  {
                    [S.selectableBody]: selection.isEnabled,
                  },
                  classNames?.bodyContainer,
                )}
                style={styles?.bodyContainer}
              >
                {pinnedRows.length > 0 && (
                  <div
                    className={S.pinnedRowsSection}
                    style={{
                      backgroundColor: stickyElementsBackgroundColor,
                      top: `${headerHeight}px`,
                    }}
                  >
                    {renderBodyGridPanels(pinnedRows, "pinned")}
                  </div>
                )}
                <div className={S.centerRowsSection}>
                  {renderBodyGridPanels(
                    centerRows,
                    "center",
                    rowMeasureRef,
                    `${totalHeight}px`,
                  )}
                </div>
              </div>
            )}
          </div>
          {isAddColumnButtonSticky && (
            <AddColumnButton
              isSticky
              marginRight={addColumnMarginRight}
              onClick={onAddColumnClick}
            />
          )}

          <Footer
            table={table}
            enablePagination={enablePagination}
            showRowsCount={showRowsCount}
            rowsTruncated={rowsTruncated}
            style={styles?.footer}
            className={classNames?.footer}
            tableFooterExtraButtons={tableFooterExtraButtons}
          />
        </div>
      </DndContext>
    </DataGridThemeProvider>
  );
};
