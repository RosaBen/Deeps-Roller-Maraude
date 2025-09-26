import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = ({ onCapture, onClose }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [facingMode, setFacingMode] = useState('user'); // 'user' pour caméra frontale, 'environment' pour caméra arrière

  const videoConstraints = {
    width: 1280,
    height: 720,
    facingMode: facingMode
  };

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  }, [webcamRef]);

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      // Convertir base64 en File
      fetch(capturedImage)
        .then(res => res.blob())
        .then(blob => {
          const file = new File([blob], 'photo.jpg', { type: 'image/jpeg' });
          onCapture(file);
        });
    }
  };

  const switchCamera = () => {
    setFacingMode(prevMode => prevMode === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="camera-modal-overlay">
      <div className="camera-modal">
        <div className="camera-header">
          <h3 className="camera-title">Prendre une photo</h3>
          <button
            onClick={onClose}
            className="camera-close-btn"
          >
            ❌
          </button>
        </div>

        <div className="camera-content">
          {!capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="camera-video"
              />
              
              {/* Contrôles caméra */}
              <div className="camera-controls-overlay">
                <button
                  onClick={switchCamera}
                  className="camera-control-btn camera-switch-btn"
                >
                  🔄
                </button>
                
                <button
                  onClick={capture}
                  className="camera-control-btn camera-capture-btn"
                >
                  📷
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={capturedImage} alt="Captured" className="camera-preview" />
              
              {/* Contrôles après capture */}
              <div className="camera-controls-overlay">
                <button
                  onClick={retake}
                  className="camera-action-btn camera-retake-btn"
                >
                  🔄 Reprendre
                </button>
                
                <button
                  onClick={confirmCapture}
                  className="camera-action-btn camera-confirm-btn"
                >
                  ✅ Confirmer
                </button>
              </div>
            </>
          )}
        </div>

        <div className="camera-help">
          <p className="camera-help-text">
            {!capturedImage 
              ? "Positionnez la caméra et appuyez sur le bouton pour prendre une photo"
              : "Êtes-vous satisfait de cette photo ?"
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;