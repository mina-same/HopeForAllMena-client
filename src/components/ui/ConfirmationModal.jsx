import React from 'react';
import { AlertTriangle, Info, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { Button } from './button';

const VARIANTS = {
  danger: {
    iconBg:  'bg-destructive/10',
    iconColor: 'text-destructive',
    Icon:    AlertTriangle,
    confirmClass: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  },
  warning: {
    iconBg:  'bg-status-pending',
    iconColor: 'text-status-pending',
    Icon:    AlertTriangle,
    confirmClass: 'bg-status-pending-solid text-white hover:opacity-90',
  },
  info: {
    iconBg:  'bg-brand-light',
    iconColor: 'text-brand',
    Icon:    Info,
    confirmClass: 'bg-brand text-white hover:opacity-90',
  },
};

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = 'Confirm',
  cancelText  = 'Cancel',
  variant     = 'danger',
  isLoading   = false,
  icon        = null,
}) => {
  const v = VARIANTS[variant] ?? VARIANTS.danger;
  const DefaultIcon = v.Icon;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            {icon ?? (
              <div className={`flex items-center justify-center h-12 w-12 rounded-full ${v.iconBg}`}>
                <DefaultIcon className={`h-6 w-6 ${v.iconColor}`} />
              </div>
            )}
          </div>
          <DialogTitle className="text-lg font-semibold text-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            {description}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            className={`w-full sm:w-auto ${v.confirmClass}`}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing…
              </span>
            ) : (
              confirmText
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
