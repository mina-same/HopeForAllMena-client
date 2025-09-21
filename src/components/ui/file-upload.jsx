import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from './button';
import { cn } from '../../lib/utils';

const FileUpload = ({ 
  onFileChange, 
  accept = "*", 
  className = "",
  placeholder = "Choose file",
  noFileText = "No file chosen",
  dragDropText = "Drag and drop a file here, or click to select",
  isRTL = false,
  ...props 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const inputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setSelectedFile(file);
      onFileChange(file);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      onFileChange(file);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleChange}
        {...props}
      />
      
      {!selectedFile ? (
        <div
          className={cn(
            "relative border-2 border-dashed rounded-lg p-6 transition-colors",
            dragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
            "cursor-pointer group"
          )}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="flex flex-col items-center justify-center space-y-3 text-center">
            <Upload className={cn(
              "w-8 h-8 text-muted-foreground group-hover:text-primary transition-colors",
              dragActive && "text-primary"
            )} />
            <div className="space-y-1">
              <p className="text-sm font-medium text-foreground">
                {dragDropText}
              </p>
              <p className="text-xs text-muted-foreground">
                {noFileText}
              </p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={(e) => {
                e.stopPropagation();
                onButtonClick();
              }}
            >
              <Upload className={cn("w-4 h-4", isRTL ? "ml-2" : "mr-2")} />
              {placeholder}
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg border">
          <div className="flex items-center space-x-3">
            <FileText className="w-5 h-5 text-primary" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {selectedFile.name}
              </p>
              <p className="text-xs text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={removeFile}
            className="text-muted-foreground hover:text-destructive"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
