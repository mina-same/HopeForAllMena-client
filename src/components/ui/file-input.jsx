import React from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from './button';
import { Label } from './label';
import { cn } from '../../lib/utils';

const FileInput = React.forwardRef(({ 
  label, 
  accept, 
  onChange, 
  value, 
  preview, 
  className, 
  ...props 
}, ref) => {
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    onChange?.(file);
  };

  const clearFile = () => {
    onChange?.(null);
  };

  return (
    <div className={cn("space-y-2", className)}>
      {label && <Label>{label}</Label>}
      
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center">
        {preview ? (
          <div className="space-y-2">
            <div className="relative inline-block">
              <img 
                src={preview} 
                alt="Preview" 
                className="max-w-32 max-h-32 object-cover rounded-md"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 h-6 w-6 p-0"
                onClick={clearFile}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              {value?.name || 'Image selected'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
            <div>
              <input
                ref={ref}
                type="file"
                accept={accept}
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                {...props}
              />
              <Label 
                htmlFor="file-input" 
                className="cursor-pointer text-sm text-primary hover:text-primary/80"
              >
                Click to upload or drag and drop
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {accept || 'All file types supported'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

FileInput.displayName = "FileInput";

export default FileInput;
