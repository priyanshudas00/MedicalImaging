import React, { useState } from 'react';
import { medicalApi } from '../utils/api';

const ImageUpload = ({ onAnalysisComplete, isLoading, setIsLoading }) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [clinicalContext, setClinicalContext] = useState('');
  const [question, setQuestion] = useState('');

  const handleImageSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Basic validation for image files
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        return;
      }

      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('Please select an image smaller than 10MB');
        return;
      }

      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const convertImageToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        // Remove the data:image/...;base64, prefix
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!selectedImage && !question.trim()) {
      alert('Please either upload an image or enter a question');
      return;
    }

    setIsLoading(true);

    try {
      let imageData = null;
      if (selectedImage) {
        imageData = await convertImageToBase64(selectedImage);
      }

      const response = await medicalApi.analyzeImage(
        imageData,
        question || 'Please analyze this medical image',
        clinicalContext || 'General medical imaging analysis'
      );

      onAnalysisComplete(response.data);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearSelection = () => {
    setSelectedImage(null);
    setPreviewUrl('');
    setClinicalContext('');
    setQuestion('');
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
  };

  return (
    <div className="image-upload">
      <div className="upload-container">
        <h2>🖼️ Medical Image Analysis</h2>
        <p className="upload-description">
          Upload a medical image or ask questions about medical imaging for AI-powered analysis
        </p>

        <div className="upload-area">
          {!previewUrl ? (
            <div className="drop-zone">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageSelect}
                className="file-input"
              />
              <label htmlFor="image-upload" className="drop-label">
                <div className="upload-icon">📁</div>
                <p>Click to upload medical image</p>
                <span>Supports: JPG, PNG, DICOM (converted)</span>
              </label>
            </div>
          ) : (
            <div className="image-preview">
              <div className="preview-header">
                <h4>Selected Image</h4>
                <button onClick={clearSelection} className="clear-btn">✕</button>
              </div>
              <img src={previewUrl} alt="Medical preview" className="preview-image" />
            </div>
          )}
        </div>

        <div className="analysis-inputs">
          <div className="input-group">
            <label htmlFor="clinical-context">Clinical Context (Optional):</label>
            <textarea
              id="clinical-context"
              value={clinicalContext}
              onChange={(e) => setClinicalContext(e.target.value)}
              placeholder="E.g., Patient presents with chest pain, history of smoking..."
              rows="3"
            />
          </div>

          <div className="input-group">
            <label htmlFor="analysis-question">Specific Question:</label>
            <textarea
              id="analysis-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="E.g., Analyze for abnormalities, Describe findings, Compare with normal anatomy..."
              rows="3"
            />
          </div>
        </div>

        <div className="action-buttons">
          <button
            onClick={handleAnalyze}
            disabled={isLoading || (!selectedImage && !question.trim())}
            className="analyze-btn"
          >
            {isLoading ? '🔍 Analyzing...' : '🔍 Analyze Image'}
          </button>
          
          {selectedImage && (
            <button onClick={clearSelection} className="secondary-btn">
              🗑️ Clear
            </button>
          )}
        </div>

        <div className="upload-info">
          <h4>📋 Supported Use Cases:</h4>
          <ul>
            <li>Anatomical structure identification</li>
            <li>Abnormality detection assistance</li>
            <li>Imaging modality explanations</li>
            <li>Educational medical image analysis</li>
          </ul>
          
          <div className="privacy-notice">
            <strong>🔒 Privacy Notice:</strong> Your images are processed securely and 
            not stored permanently. For sensitive medical data, always follow HIPAA 
            guidelines and institutional policies.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;