import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from './button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';

/**
 * DataTable — universal data list for every admin section.
 *
 * columns: Array<{
 *   key: string,
 *   label: string,
 *   align?: 'start' | 'center' | 'end',
 *   width?: string,            // Tailwind w-* class
 *   skeletonWidth?: string,    // inline width for skeleton bar
 *   render?: (row) => ReactNode,
 * }>
 */
export function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyTitle = 'No results',
  emptyDescription,
  emptyIcon: EmptyIcon,
  countLabel,
  currentPage,
  totalPages,
  onPageChange,
  dir = 'ltr',
  className = '',
}) {
  const isRTL = dir === 'rtl';

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
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent bg-muted/40 border-border">
              {columns.map((col) => (
                <TableHead
                  key={col.key}
                  className={[
                    'text-[11px] font-semibold uppercase tracking-wider text-muted-foreground',
                    'py-3 px-4',
                    col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start',
                    col.width ?? '',
                  ].join(' ')}
                >
                  {col.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i} className="border-border">
                  {columns.map((col) => (
                    <TableCell key={col.key} className="py-4 px-4">
                      <div
                        className="h-4 bg-muted rounded animate-pulse"
                        style={{ width: col.skeletonWidth ?? '70%' }}
                      />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : data.length === 0 ? (
              <TableRow className="hover:bg-transparent border-0">
                <TableCell colSpan={columns.length} className="py-16">
                  <div className="flex flex-col items-center gap-2 text-center">
                    {EmptyIcon && (
                      <EmptyIcon className="h-8 w-8 text-muted-foreground/40" />
                    )}
                    <p className="text-sm font-medium text-foreground">{emptyTitle}</p>
                    {emptyDescription && (
                      <p className="text-xs text-muted-foreground">{emptyDescription}</p>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, i) => (
                <TableRow
                  key={row._id ?? i}
                  className="border-border hover:bg-muted/30 transition-colors"
                >
                  {columns.map((col) => (
                    <TableCell
                      key={col.key}
                      className={[
                        'py-3.5 px-4 text-sm',
                        col.align === 'center' ? 'text-center' : col.align === 'end' ? 'text-end' : 'text-start',
                      ].join(' ')}
                    >
                      {col.render ? col.render(row) : row[col.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
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
