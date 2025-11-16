import React from 'react';

const Header = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'chat', label: 'AI Chat', icon: '💬' },
    { id: 'upload', label: 'Image Analysis', icon: '🖼️' },
    { id: 'reports', label: 'Imaging Guide', icon: '📋' },
    { id: 'settings', label: 'Settings', icon: '⚙️' }
  ];

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="logo-section">
          <div className="logo">🏥</div>
          <div className="title">
            <h1>MedImaging AI</h1>
            <p>Medical Imaging Analysis Agent</p>
          </div>
        </div>
        
        <nav className="navigation">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => onTabChange(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              <span className="tab-label">{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;