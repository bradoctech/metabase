import { type HeaderGroup, flexRender } from "@tanstack/react-table";
import cx from "classnames";
import type React from "react";

import { HEADER_BASE_HEIGHT } from "metabase/data-grid/constants";
import { getColumnPositionStyles } from "metabase/data-grid/utils/stylings";
import { Icon } from "metabase/ui";

import type { DataGridColumnType } from "../../types";
import S from "../DataGrid/DataGrid.module.css";
import type { DataGridStylesProps } from "../DataGrid/types";
import { SortableHeader } from "../SortableHeader/SortableHeader";

export interface DataGridHeaderProps<TData> extends DataGridStylesProps {
  headerGroup: HeaderGroup<TData>;
  columns: DataGridColumnType<TData>[];
  backgroundColor?: string;
  isColumnReorderingDisabled?: boolean;
  // pinnedDataColumnsCount?: number;
  onPinColumn?: (columnId: string) => void;
  onHeaderCellClick?: (
    event: React.MouseEvent<HTMLDivElement>,
    columnId?: string,
  ) => void;
}

export const DataGridHeader = <TData,>({
  headerGroup,
  columns,
  backgroundColor,
  isColumnReorderingDisabled,
  onHeaderCellClick,
  // pinnedDataColumnsCount = 0,
  onPinColumn,
  classNames,
  styles,
}: DataGridHeaderProps<TData>) => {
  const paddingLeft = columns[0]?.virtualItem?.start ?? 0;

  return (
    <div
      className={cx(S.row, classNames?.row)}
      role="row"
      style={{
        backgroundColor,
        paddingLeft,
        height: `${HEADER_BASE_HEIGHT}px`,
        ...styles?.row,
      }}
    >
      {columns.map((column) => {
        const header = headerGroup.headers[column.origin.getIndex()];
        const headerCell = flexRender(
          header.column.columnDef.header,
          header.getContext(),
        );
        const isUtilityColumn =
          header.column.columnDef.meta?.isUtilityColumn === true;
        const columnPositionStyles = getColumnPositionStyles(column);
        const isPinned = header.column.getIsPinned() === "left";

        const pinButton =
          !isUtilityColumn && onPinColumn ? (
            <button
              className={cx(S.pinButton, { [S.pinButtonPinned]: isPinned })}
              title={
                isPinned ? "Descongelar colunas" : "Congelar até esta coluna"
              }
              onMouseDown={(e) => e.stopPropagation()}
              onMouseUp={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                onPinColumn(header.column.id);
              }}
            >
              <Icon name={isPinned ? "chevronup" : "chevrondown"} size={9} />
            </button>
          ) : null;

        const headerContent = isUtilityColumn ? (
          headerCell
        ) : (
          <SortableHeader
            className={cx(S.headerCell, classNames?.headerCell)}
            style={styles?.headerCell}
            isColumnReorderingDisabled={isColumnReorderingDisabled}
            header={header}
            onClick={onHeaderCellClick}
            pinButton={pinButton}
          >
            {headerCell}
          </SortableHeader>
        );

        return (
          <div
            key={header.id}
            role="columnheader"
            style={columnPositionStyles}
            data-header-id={header.id}
          >
            {headerContent}
          </div>
        );
      })}
    </div>
  );
};
