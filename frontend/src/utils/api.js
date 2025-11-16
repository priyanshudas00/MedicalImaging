import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for image analysis
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error);

    if (error.response) {
      // Server responded with error status
      console.error('Error data:', error.response.data);
    } else if (error.request) {
      // Request made but no response received
      console.error('No response received:', error.request);
    } else {
      // Something else happened
      console.error('Error message:', error.message);
    }

    return Promise.reject(error);
  }
);

// Medical imaging specific API functions
export const medicalApi = {
  // Analyze medical image
  analyzeImage: async (imageData, question, clinicalContext) => {
    const apiKey = localStorage.getItem('geminiApiKey') || '';
    const response = await api.post('/api/analyze-image', {
      imageData,
      question,
      clinicalContext,
      apiKey,
    });
    return response;
  },

  // Chat with medical AI
  chat: async (message, history = []) => {
    const apiKey = localStorage.getItem('geminiApiKey') || '';
    const response = await api.post('/api/chat', {
      message,
      history,
      apiKey,
    });
    return response.data;
  },

  // Get imaging modalities information
  getImagingModalities: async () => {
    const response = await api.get('/api/imaging-modalities');
    return response.data;
  },

  // Settings API functions
  updateSettings: async (apiKey) => {
    const response = await api.post('/api/update-settings', {
      apiKey
    });
    return response.data;
  },

  testGeminiConnection: async (apiKey) => {
    const response = await api.post('/api/test-gemini', {
      apiKey
    });
    return response.data;
  },
};

export default api;
