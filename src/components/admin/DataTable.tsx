import type { ReactNode } from "react";

export default function DataTable({
  headers,
  children,
  empty,
  isEmpty,
}: {
  headers: string[];
  children: ReactNode;
  empty: string;
  isEmpty: boolean;
}) {
  if (isEmpty) {
    return (
      <div className="admin-surface px-5 py-14 text-center">
        <p className="text-sm text-text-gray">{empty}</p>
      </div>
    );
  }

  return (
    <div className="admin-surface overflow-x-auto">
      <table className="admin-table">
        <thead>
          <tr>
            {headers.map((header) => (
              <th key={header} scope="col">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}
