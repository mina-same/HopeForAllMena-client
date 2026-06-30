import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';

/**
 * DataTable — universal data list for every admin section.
 *
 * columns: Array<{
 *   key: string,
 *   label: string,
 *   align?: 'start' | 'center' | 'end',
 *   width?: string,
 *   skeletonWidth?: string,
 *   render?: (row) => ReactNode,
 * }>
 *
 * emptyIcon: component reference OR pre-rendered JSX element — both accepted.
 */
export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No results',
  emptyDescription,
  emptyIcon,
  countLabel,
  currentPage,
  totalPages,
  onPageChange,
  dir = 'ltr',
  className = '',
}) {
  const isRTL = dir === 'rtl';

  // Accept both a component reference (Icon) and a pre-rendered element (<Icon />).
  const renderEmptyIcon = () => {
    if (!emptyIcon) return null;
    if (React.isValidElement(emptyIcon)) return emptyIcon;
    const Icon = emptyIcon;
    return <Icon className="h-8 w-8 text-muted-foreground/40" />;
  };

  const cellAlign = (col) =>
    col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start';

  return (
    <div className={`bg-card border border-border rounded-xl shadow-sm overflow-hidden ${className}`}>

      {/* Row count header */}
      {countLabel && (
        <div className={`flex items-center px-5 py-3 border-b border-border ${isRTL ? 'flex-row-reverse' : ''}`}>
          <p className="text-sm font-medium text-foreground">{countLabel}</p>
        </div>
      )}

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full caption-bottom text-sm">
          <thead>
            <tr className="bg-muted/40 border-b border-border">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={[
                    'text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                    'py-3 px-4 align-middle',
                    cellAlign(col),
                    col.width ?? '',
                  ].join(' ')}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="[&_tr:last-child]:border-0">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-border">
                  {columns.map((col) => (
                    <td key={col.key} className="py-4 px-4 align-middle">
                      <div
                        className="h-4 bg-muted rounded animate-pulse"
                        style={{ width: col.skeletonWidth ?? '70%' }}
                      />
                    </td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="py-16 align-middle">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {renderEmptyIcon()}
                    <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
                    {emptyDescription && (
                      <p className="text-xs text-muted-foreground">{emptyDescription}</p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr
                  key={row._id ?? i}
                  className="border-b border-border hover:bg-muted/30 transition-colors"
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={[
                        'py-3.5 px-4 text-sm align-middle',
                        cellAlign(col),
                      ].join(' ')}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div
          className={`flex items-center justify-between px-5 py-3 border-t border-border ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <p className="text-xs text-muted-foreground tabular-nums">
            {currentPage} / {totalPages}
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="h-7 w-7 p-0 border-border"
            >
              {isRTL
                ? <ChevronRight className="h-3.5 w-3.5" />
                : <ChevronLeft className="h-3.5 w-3.5" />}
            </Button>
            <span className="text-xs font-medium text-foreground min-w-[2rem] text-center tabular-nums">
              {currentPage}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="h-7 w-7 p-0 border-border"
            >
              {isRTL
                ? <ChevronLeft className="h-3.5 w-3.5" />
                : <ChevronRight className="h-3.5 w-3.5" />}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
