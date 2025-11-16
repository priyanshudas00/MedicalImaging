import React, { useState, useEffect } from 'react';
import { medicalApi } from '../utils/api';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Load current settings from localStorage
    const savedApiKey = localStorage.getItem('geminiApiKey') || '';
    setApiKey(savedApiKey);
  }, []);

  const handleApiKeyChange = async (newApiKey) => {
    setIsUpdating(true);
    setMessage('');

    try {
      // Save to localStorage
      localStorage.setItem('geminiApiKey', newApiKey);
      setApiKey(newApiKey);

      // Update backend
      await medicalApi.updateSettings(newApiKey);

      setMessage('✅ API key updated successfully!');
    } catch (error) {
      console.error('Error updating API key:', error);
      setMessage('❌ Failed to update API key');
    } finally {
      setIsUpdating(false);
    }
  };

  const testConnection = async () => {
    setIsUpdating(true);
    setMessage('');

    try {
      const response = await medicalApi.testGeminiConnection(apiKey);

      if (response.success) {
        setMessage('✅ Gemini API connection successful!');
      } else {
        setMessage('❌ Gemini API connection failed');
      }
    } catch (error) {
      console.error('Connection test failed:', error);
      setMessage('❌ Failed to test Gemini API connection');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="settings-container">
      <div className="settings-card">
        <h2 className="settings-title">🤖 Gemini AI Settings</h2>
        <p className="settings-description">
          Configure your Google Gemini AI settings for medical imaging analysis.
        </p>

        {message && (
          <div className={`message ${message.includes('✅') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        <div className="setting-group">
          <label className="setting-label">
            <span className="label-icon">🔑</span>
            Gemini API Key
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your Google AI API key"
            className="setting-input"
            disabled={isUpdating}
          />
          <button
            onClick={() => handleApiKeyChange(apiKey)}
            disabled={isUpdating || !apiKey}
            className="setting-button primary"
          >
            {isUpdating ? 'Updating...' : 'Update API Key'}
          </button>
        </div>



        <div className="setting-group">
          <button
            onClick={testConnection}
            disabled={isUpdating || !apiKey}
            className="setting-button secondary"
          >
            {isUpdating ? 'Testing...' : 'Test Connection'}
          </button>
        </div>

        <div className="settings-info">
          <h3>📋 How to get your API Key:</h3>
          <ol>
            <li>Go to <a href="https://makersuite.google.com/app/apikey" target="_blank" rel="noopener noreferrer">Google AI Studio</a></li>
            <li>Sign in with your Google account</li>
            <li>Create a new API key or use an existing one</li>
            <li>Copy and paste the key above</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default Settings;
