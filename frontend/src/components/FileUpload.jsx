import React, { useState, useRef } from 'react';
import {
  DocumentIcon,
  XMarkIcon,
  CloudArrowUpIcon,
} from '@heroicons/react/24/outline';

const FileUpload = ({ onFileSelect, acceptedTypes = 'image/*,application/pdf', label, icon: Icon }) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) {
      const file = files[0];
      setSelectedFile(file);
      
      // Créer un aperçu pour les images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setPreview(null);
      }
      
      onFileSelect(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const onButtonClick = () => {
    inputRef.current?.click();
  };

  const removeFile = () => {
    setSelectedFile(null);
    setPreview(null);
    onFileSelect(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="w-full">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={acceptedTypes}
        onChange={handleChange}
      />
      
      {selectedFile ? (
        // Affichage du fichier sélectionné
        <div className="relative">
          {preview ? (
            // Aperçu image
            <div className="relative">
              <img 
                src={preview} 
                alt="Preview" 
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                onClick={removeFile}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <XMarkIcon className="w-4 h-4" />
              </button>
            </div>
          ) : (
            // Aperçu fichier non-image
            <div className="flex items-center justify-between p-3 border border-gray-300 rounded-lg bg-gray-50">
              <div className="flex items-center">
                <DocumentIcon className="w-6 h-6 text-gray-500 mr-2" />
                <span className="text-sm text-gray-700 truncate">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={removeFile}
                className="text-red-500 hover:text-red-700"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          )}
          
          <p className="text-xs text-gray-500 mt-1 text-center">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      ) : (
        // Zone de drop/upload
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            dragActive 
              ? 'border-primary-400 bg-primary-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="space-y-2">
            {Icon ? (
              <Icon className="mx-auto h-12 w-12 text-gray-400" />
            ) : (
              <CloudArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
            )}
            <div className="text-sm text-gray-600">
              <span className="font-medium text-primary-600 hover:text-primary-500">
                Cliquez pour sélectionner
              </span>{' '}
              ou glissez-déposez un fichier
            </div>
            {label && (
              <p className="text-xs text-gray-500">{label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;