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
    <div style={{ width: '100%' }}>
      <input
        ref={inputRef}
        type="file"
        style={{ display: 'none' }}
        accept={acceptedTypes}
        onChange={handleChange}
      />
      
      {selectedFile ? (
        // Affichage du fichier sélectionné
        <div style={{ position: 'relative' }}>
          {preview ? (
            // Aperçu image
            <div style={{ position: 'relative' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{
                  width: '100%',
                  height: '120px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db'
                }}
              />
              <button
                onClick={removeFile}
                style={{
                  position: 'absolute',
                  top: '8px',
                  right: '8px',
                  background: '#ef4444',
                  color: 'white',
                  padding: '4px',
                  borderRadius: '50%',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                <XMarkIcon style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          ) : (
            // Aperçu fichier non-image
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px',
              border: '1px solid #d1d5db',
              borderRadius: '8px',
              background: '#f9fafb'
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <DocumentIcon style={{ width: '16px', height: '16px', color: '#6b7280', marginRight: '8px' }} />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={removeFile}
                style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }}
              >
                <XMarkIcon style={{ width: '16px', height: '16px' }} />
              </button>
            </div>
          )}
          
          <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px', textAlign: 'center', margin: '4px 0 0 0' }}>
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      ) : (
        // Zone de drop/upload
        <div
          style={{
            position: 'relative',
            border: '2px dashed #d1d5db',
            borderRadius: '8px',
            padding: '16px',
            textAlign: 'center',
            cursor: 'pointer',
            backgroundColor: dragActive ? '#f0f9ff' : 'transparent',
            borderColor: dragActive ? '#3b82f6' : '#d1d5db'
          }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            {Icon ? (
              <Icon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
            ) : (
              <CloudArrowUpIcon style={{ width: '20px', height: '20px', color: '#9ca3af' }} />
            )}
            <div style={{ fontSize: '14px', color: '#4b5563' }}>
              <span style={{ fontWeight: '500', color: '#3b82f6' }}>
                Cliquez pour sélectionner
              </span>{' '}
              ou glissez-déposez
            </div>
            {label && (
              <p style={{ fontSize: '12px', color: '#6b7280', margin: 0 }}>{label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;