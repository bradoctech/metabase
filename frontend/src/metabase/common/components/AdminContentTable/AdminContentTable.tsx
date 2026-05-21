import { type ReactNode, useCallback, useRef } from "react";

import AdminS from "metabase/css/admin.module.css";

export const AdminContentTable = ({
  columnTitles,
  children,
}: {
  columnTitles: ReactNode[];
  children: ReactNode;
}) => {
  const activeRowRef = useRef<HTMLTableRowElement | null>(null);

  const handleBodyClick = useCallback(
    (e: React.MouseEvent<HTMLTableSectionElement>) => {
      const clickedRow = (e.target as HTMLElement).closest(
        "tr",
      ) as HTMLTableRowElement | null;
      if (!clickedRow) {
        return;
      }

      if (activeRowRef.current === clickedRow) {
        clickedRow.classList.remove(AdminS.ActiveRow);
        activeRowRef.current = null;
      } else {
        if (activeRowRef.current) {
          activeRowRef.current.classList.remove(AdminS.ActiveRow);
        }
        clickedRow.classList.add(AdminS.ActiveRow);
        activeRowRef.current = clickedRow;
      }
    },
    [],
  );

  return (
    <table data-testid="admin-content-table" className={AdminS.ContentTable}>
      <thead>
        <tr>
          {columnTitles &&
            columnTitles.map((title, index) => <th key={index}>{title}</th>)}
        </tr>
      </thead>
      <tbody onClick={handleBodyClick}>{children}</tbody>
    </table>
  );
};
