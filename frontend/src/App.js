import React, { useState } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import ImageUpload from './components/ImageUpload';
import AnalysisResults from './components/AnalysisResults';
import MedicalReports from './components/MedicalReports';
import Settings from './components/Settings';
import './styles/App.css';

function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    setActiveTab('results');
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'chat':
        return <ChatInterface />;
      case 'upload':
        return (
          <ImageUpload
            onAnalysisComplete={handleAnalysisComplete}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        );
      case 'results':
        return (
          <AnalysisResults
            result={analysisResult}
            onBack={() => setActiveTab('upload')}
          />
        );
      case 'reports':
        return <MedicalReports />;
      case 'settings':
        return <Settings />;
      default:
        return <ChatInterface />;
    }
  };

  return (
    <div className="App">
      <Header activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="main-content">
        {renderActiveComponent()}
      </main>
      
      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="loading-overlay">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing medical image... Please wait</p>
          </div>
        </div>
      )}

      {/* Disclaimer Footer */}
      <footer className="disclaimer-footer">
        <div className="disclaimer-content">
          <strong>⚠️ IMPORTANT DISCLAIMER:</strong> This AI tool is for educational and 
          assistance purposes only. It is not a substitute for professional medical 
          diagnosis, treatment, or advice from qualified healthcare providers. 
          Always consult with licensed medical professionals for healthcare decisions.
        </div>
      </footer>
    </div>
  );
}

export default App;