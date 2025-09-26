import React, { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import {
  CameraIcon,
  XMarkIcon,
  ArrowPathIcon,
  CheckIcon,
} from '@heroicons/react/24/outline';

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
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-lg w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Prendre une photo</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="relative">
          {!capturedImage ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                videoConstraints={videoConstraints}
                className="w-full rounded-lg"
              />
              
              {/* Contrôles caméra */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={switchCamera}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-3 rounded-full"
                >
                  <ArrowPathIcon className="w-6 h-6" />
                </button>
                
                <button
                  onClick={capture}
                  className="bg-primary-600 hover:bg-primary-700 text-white p-4 rounded-full"
                >
                  <CameraIcon className="w-8 h-8" />
                </button>
              </div>
            </>
          ) : (
            <>
              <img src={capturedImage} alt="Captured" className="w-full rounded-lg" />
              
              {/* Contrôles après capture */}
              <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-4">
                <button
                  onClick={retake}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg flex items-center"
                >
                  <ArrowPathIcon className="w-5 h-5 mr-2" />
                  Reprendre
                </button>
                
                <button
                  onClick={confirmCapture}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg flex items-center"
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Confirmer
                </button>
              </div>
            </>
          )}
        </div>

        <div className="mt-4 text-center">
          <p className="text-sm text-gray-600">
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