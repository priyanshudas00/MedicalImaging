import React from 'react';

const AnalysisResults = ({ result, onBack }) => {
  if (!result) {
    return (
      <div className="analysis-results">
        <div className="no-results">
          <h3>No analysis results available</h3>
          <button onClick={onBack} className="back-btn">
            ← Back to Upload
          </button>
        </div>
      </div>
    );
  }

  const formatAnalysisText = (text) => {
    // Split text into sections based on markdown-like headers
    const sections = text.split(/(?=\*\*[0-9]+\.)/g);
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length === 0) return null;

      const firstLine = lines[0];
      const isHeader = firstLine.startsWith('**');
      
      return (
        <div key={index} className={`analysis-section ${isHeader ? 'section-header' : 'section-content'}`}>
          {lines.map((line, lineIndex) => {
            if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <h4 key={lineIndex} className="section-title">
                  {line.replace(/\*\*/g, '')}
                </h4>
              );
            } else if (line.startsWith('⚠️')) {
              return (
                <div key={lineIndex} className="disclaimer-box">
                  {line}
                </div>
              );
            } else {
              return (
                <p key={lineIndex} className="analysis-line">
                  {line}
                </p>
              );
            }
          })}
        </div>
      );
    });
  };

  return (
    <div className="analysis-results">
      <div className="results-header">
        <button onClick={onBack} className="back-btn">
          ← Back to Upload
        </button>
        <h2>🔍 Analysis Results</h2>
        <div className="results-meta">
          <span>Model: {result.model}</span>
          <span>Time: {new Date(result.timestamp).toLocaleString()}</span>
        </div>
      </div>

      <div className="results-content">
        <div className="analysis-output">
          {formatAnalysisText(result.analysis)}
        </div>

        <div className="results-disclaimer">
          <div className="disclaimer-alert">
            <strong>⚠️ MEDICAL DISCLAIMER</strong>
            <p>
              This AI analysis is for educational and assistance purposes only. 
              It is not a substitute for professional medical diagnosis by qualified 
              healthcare providers. Always consult with licensed medical professionals 
              for accurate diagnosis and treatment decisions.
            </p>
          </div>
        </div>

        <div className="results-actions">
          <button onClick={onBack} className="primary-btn">
            <span>🖼️</span>
            <span>New Analysis</span>
          </button>
          <button
            onClick={() => window.print()}
            className="secondary-btn"
          >
            <span>🖨️</span>
            <span>Print Report</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;