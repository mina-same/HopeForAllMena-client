import React from 'react';
import { Search } from 'lucide-react';
import { Input } from './input';
import { Card, CardContent } from './card';

/**
 * SectionShell — standard page wrapper for every admin tab.
 *
 * Props:
 *   title     string
 *   subtitle  string
 *   actions   ReactNode   (add button slot, top-right)
 *   filters   ReactNode   (search + select filters, rendered inside a Card)
 *   dir       'ltr' | 'rtl'
 *   children  ReactNode   (DataTable + modals)
 */
export function SectionShell({
  title,
  subtitle,
  actions,
  filters,
  children,
  dir = 'ltr',
}) {
  const isRTL = dir === 'rtl';

  return (
    <div className={`space-y-6 ${isRTL ? 'rtl' : 'ltr'}`} dir={dir}>

      {/* ── Page header ─────────────────────────── */}
      <div
        className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${isRTL ? 'sm:flex-row-reverse' : ''}`}
      >
        <div className={isRTL ? 'text-right' : 'text-left'}>
          <div className={`flex items-center gap-2.5 mb-0.5 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <div className="w-1 h-5 rounded-full bg-brand flex-shrink-0" />
            <h2 className="text-xl font-semibold text-foreground tracking-tight">{title}</h2>
          </div>
          {subtitle && (
            <p className={`text-sm text-muted-foreground mt-0.5 ${isRTL ? 'mr-[14px]' : 'ml-[14px]'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {actions && <div className="flex-shrink-0">{actions}</div>}
      </div>

      {/* ── Filters ─────────────────────────────── */}
      {filters && (
        <Card className="border border-border shadow-xs">
          <CardContent className="p-3 sm:p-4">
            <div className={`flex flex-col sm:flex-row gap-3 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
              {filters}
            </div>
          </CardContent>
        </Card>
      )}

      {/* ── Content (DataTable + modals) ────────── */}
      {children}
    </div>
  );
}

/**
 * SearchInput — RTL-aware search bar, used inside filters slot.
 */
export function SearchInput({ value, onChange, placeholder, dir = 'ltr' }) {
  const isRTL = dir === 'rtl';
  return (
    <div className="relative flex-1">
      <Search
        className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none ${isRTL ? 'right-3' : 'left-3'}`}
      />
      <Input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        dir={dir}
        className={`h-9 ${isRTL ? 'pr-9 text-right' : 'pl-9'}`}
      />
    </div>
  );
}
