import React, { useState, useEffect } from 'react';
import { medicalApi } from '../utils/api';

const MedicalReports = () => {
  const [modalities, setModalities] = useState([]);
  const [selectedModality, setSelectedModality] = useState(null);

  useEffect(() => {
    const fetchModalities = async () => {
      try {
        const response = await medicalApi.getImagingModalities();
        setModalities(response.data.modalities);
        setSelectedModality(response.data.modalities[0]);
      } catch (error) {
        console.error('Error fetching modalities:', error);
      }
    };

    fetchModalities();
  }, []);

  const imagingFacts = [
    "MRI uses strong magnetic fields and radio waves to create detailed images",
    "CT scans provide cross-sectional views using X-rays from multiple angles",
    "Ultrasound is safe for pregnancy as it uses sound waves, not radiation",
    "X-rays are best for bone fractures and dental imaging",
    "PET scans show metabolic activity and are used in cancer detection"
  ];

  return (
    <div className="medical-reports">
      <div className="reports-container">
        <h2>📋 Medical Imaging Guide</h2>
        
        <div className="imaging-facts">
          <h3>🧠 Quick Imaging Facts</h3>
          <div className="facts-grid">
            {imagingFacts.map((fact, index) => (
              <div key={index} className="fact-card">
                {fact}
              </div>
            ))}
          </div>
        </div>

        <div className="modalities-section">
          <h3>🏥 Imaging Modalities</h3>
          <div className="modalities-container">
            <div className="modality-list">
              {modalities.map(modality => (
                <button
                  key={modality.id}
                  className={`modality-btn ${selectedModality?.id === modality.id ? 'active' : ''}`}
                  onClick={() => setSelectedModality(modality)}
                >
                  {modality.name}
                </button>
              ))}
            </div>
            
            {selectedModality && (
              <div className="modality-details">
                <h4>{selectedModality.name}</h4>
                <p className="modality-description">{selectedModality.description}</p>
                
                <div className="details-grid">
                  <div className="detail-group">
                    <h5>Common Uses:</h5>
                    <ul>
                      {selectedModality.uses.map((use, index) => (
                        <li key={index}>✅ {use}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="detail-group">
                    <h5>Limitations:</h5>
                    <ul>
                      {selectedModality.limitations.map((limit, index) => (
                        <li key={index}>⚠️ {limit}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="safety-guidelines">
          <h3>🛡️ Patient Safety Guidelines</h3>
          <div className="guidelines-grid">
            <div className="guideline-card">
              <h4>Radiation Safety</h4>
              <ul>
                <li>Use lowest necessary radiation dose (ALARA principle)</li>
                <li>Pregnancy must be ruled out for certain studies</li>
                <li>Use lead shielding when appropriate</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h4>Contrast Agents</h4>
              <ul>
                <li>Screen for kidney function before CT contrast</li>
                <li>Check for contrast allergies</li>
                <li>Monitor for adverse reactions</li>
              </ul>
            </div>
            
            <div className="guideline-card">
              <h4>MRI Safety</h4>
              <ul>
                <li>Screen for metallic implants and devices</li>
                <li>Remove all metal objects before scanning</li>
                <li>Consider claustrophobia and anxiety</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="educational-resources">
          <h3>📚 Educational Resources</h3>
          <div className="resources-list">
            <div className="resource-item">
              <strong>Radiology Basics:</strong> Anatomy and common pathologies
            </div>
            <div className="resource-item">
              <strong>Imaging Physics:</strong> How different modalities work
            </div>
            <div className="resource-item">
              <strong>Case Studies:</strong> Real-world imaging examples
            </div>
            <div className="resource-item">
              <strong>Protocol Guidelines:</strong> Standard imaging protocols
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicalReports;