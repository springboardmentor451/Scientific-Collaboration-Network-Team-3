import React, { useState, useRef } from 'react';

export default function FileUpload({ onFileSelect, accept }) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files[0]);
    }
  };

  const handleFiles = (file) => {
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div 
      className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-colors cursor-pointer
        ${isDragging ? 'border-primary-container bg-surface-container-low' : 'border-outline-variant hover:border-primary-container/50 bg-surface-container-lowest'}
      `}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        onChange={handleChange} 
        accept={accept}
      />
      
      <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-primary-container mb-4">
        <span className="material-symbols-outlined text-[24px]">cloud_upload</span>
      </div>
      
      {selectedFile ? (
        <div className="text-center">
          <p className="font-body-md font-semibold text-primary">{selectedFile.name}</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
      ) : (
        <div className="text-center">
          <p className="font-body-md font-semibold text-primary">Click to upload or drag and drop</p>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-1">
            PDF, DOCX up to 10MB
          </p>
        </div>
      )}
    </div>
  );
}
