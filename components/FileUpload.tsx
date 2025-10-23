
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons/UploadIcon';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      if(e.dataTransfer.files[0].type === "application/pdf") {
        onFileSelect(e.dataTransfer.files[0]);
      } else {
        alert("Please upload a PDF file.");
      }
    }
  }, [onFileSelect]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
       onFileSelect(e.target.files[0]);
    }
  };

  const borderClass = isDragging 
    ? 'border-blue-500 bg-blue-50' 
    : 'border-slate-300 hover:border-blue-400';

  return (
    <div 
      className={`relative w-full max-w-lg p-8 border-2 ${borderClass} border-dashed rounded-xl text-center transition-colors duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        id="file-upload"
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        onChange={handleChange}
        accept="application/pdf"
        disabled={disabled}
      />
      <div className="flex flex-col items-center justify-center space-y-4 text-slate-500">
        <UploadIcon className="w-12 h-12 text-slate-400" />
        <p className="font-semibold">
          <span className="text-blue-600">Click to upload</span> or drag and drop
        </p>
        <p className="text-sm">PDF statement file</p>
      </div>
    </div>
  );
};
