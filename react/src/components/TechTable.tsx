import type { ReactNode } from "react";

export interface ColumnDef {
  key: string;
  title: string;
  width?: number | string;
  render?: (value: unknown, row: Record<string, unknown>, index: number) => ReactNode;
}

interface TechTableProps {
  columns?: ColumnDef[];
  data?: Record<string, unknown>[];
  total?: number;
  page?: number;
  pageSize?: number;
  onPageChange?: (p: number) => void;
}

export default function TechTable({
  columns = [],
  data = [],
  total = 0,
  page = 1,
  pageSize = 10,
  onPageChange = () => {},
}: TechTableProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div data-cmp="TechTable" className="flex flex-col">
      <div className="overflow-x-auto tech-scrollbar">
        <table className="w-full text-xs border-collapse">
          <thead>
            <tr style={{ background: `rgba(0,80,160,0.3)` }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-3 py-2 text-left font-medium whitespace-nowrap"
                  style={{
                    color: `var(--tech-cyan)`,
                    borderBottom: `1px solid var(--tech-border)`,
                    width: col.width,
                  }}
                >
                  {col.title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="py-8 text-center text-xs"
                  style={{ color: `var(--tech-text-dim)` }}
                >
                  暂无数据
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={idx}
                  className="tech-table-row transition-all"
                  style={{ borderBottom: `1px solid rgba(0,100,200,0.12)` }}
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-3 py-2 whitespace-nowrap"
                      style={{ color: `var(--tech-text)` }}
                    >
                      {col.render
                        ? col.render(row[col.key], row, idx)
                        : String(row[col.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {total > 0 && (
        <div
          className="flex items-center justify-end gap-2 px-3 py-2 text-xs border-t"
          style={{
            borderColor: `var(--tech-border)`,
            color: `var(--tech-text-dim)`,
          }}
        >
          <span>共 {total} 条数据</span>
          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => onPageChange(p)}
                className="w-6 h-6 rounded flex items-center justify-center"
                style={{
                  background: page === p ? `var(--tech-active)` : `var(--tech-input-bg)`,
                  color: page === p ? `var(--tech-text)` : `var(--tech-text-dim)`,
                  border: `1px solid var(--tech-border)`,
                }}
              >
                {p}
              </button>
            ))}
          </div>
          <span>{pageSize} 条/页</span>
        </div>
      )}
    </div>
  );
}
