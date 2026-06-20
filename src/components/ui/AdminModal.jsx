import React from 'react';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';

const SIZE_MAP = {
  sm: 'sm:max-w-md',
  md: 'sm:max-w-2xl',
  lg: 'sm:max-w-4xl',
  xl: 'sm:max-w-5xl',
};

/**
 * AdminModal — universal dialog shell for every admin section.
 *
 * Props:
 *   open      boolean
 *   onClose   (open: boolean) => void   ← pass setState setter directly
 *   title     string
 *   size      'sm' | 'md' | 'lg' | 'xl'
 *   dir       'ltr' | 'rtl'
 *   disabled  boolean   (locks close button while submitting)
 *   footer    ReactNode (action buttons rendered below a divider)
 *   children  ReactNode (form / view content)
 */
export function AdminModal({
  open,
  onClose,
  title,
  size = 'md',
  dir = 'ltr',
  disabled = false,
  children,
  footer,
}) {
  const isRTL = dir === 'rtl';

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent
        className={`w-full ${SIZE_MAP[size]} max-h-[90vh] overflow-y-auto [&>button]:hidden`}
        dir={dir}
      >
        {/* ── Header ────────────────────────────── */}
        <DialogHeader
          className={`flex flex-row items-center gap-3 pb-4 border-b border-border ${isRTL ? 'flex-row-reverse' : ''}`}
        >
          <DialogTitle
            className={`flex-1 text-base font-semibold text-foreground leading-snug ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {title}
          </DialogTitle>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onClose(false)}
            disabled={disabled}
            className="h-7 w-7 p-0 flex-shrink-0 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        {/* ── Body ──────────────────────────────── */}
        <div className="py-5">
          {children}
        </div>

        {/* ── Footer ────────────────────────────── */}
        {footer && (
          <div
            className={`flex items-center gap-3 pt-4 border-t border-border ${isRTL ? 'flex-row-reverse' : 'justify-end'}`}
          >
            {footer}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
