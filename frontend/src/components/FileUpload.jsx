import React, { useState, useRef } from 'react';

const FileUpload = ({ onFileSelect, acceptedTypes = 'image/*,application/pdf', label }) => {
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
    <div className="file-upload-container">
      <input
        ref={inputRef}
        type="file"
        className="file-input-hidden"
        accept={acceptedTypes}
        onChange={handleChange}
      />
      
      {selectedFile ? (
        // Affichage du fichier sélectionné
        <div className="file-selected">
          {preview ? (
            // Aperçu image
            <div className="image-preview-container">
              <img 
                src={preview} 
                alt="Preview" 
                className="image-preview"
              />
              <button
                onClick={removeFile}
                className="remove-file-button image-remove"
              >
                ❌
              </button>
            </div>
          ) : (
            // Aperçu fichier non-image
            <div className="file-preview-container">
              <div className="file-info">
                <span className="file-icon">📄</span>
                <span className="file-name">
                  {selectedFile.name}
                </span>
              </div>
              <button
                onClick={removeFile}
                className="remove-file-button"
              >
                ❌
              </button>
            </div>
          )}
          
          <p className="file-size">
            {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
          </p>
        </div>
      ) : (
        // Zone de drop/upload
        <div
          className={`upload-zone ${dragActive ? 'upload-zone-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
        >
          <div className="upload-content">
            <div className="upload-icon">
              ☁️⬆️
            </div>
            <div className="upload-text">
              <span className="upload-action">
                Cliquez pour sélectionner
              </span>{' '}
              ou glissez-déposez un fichier
            </div>
            {label && (
              <p className="upload-label">{label}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;