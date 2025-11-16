const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const router = express.Router();

// Initialize Gemini AI with dynamic key support
let genAI = null;
const currentModel = 'gemini-2.0-flash';

function initializeGemini(apiKey) {
  if (apiKey) {
    genAI = new GoogleGenerativeAI(apiKey);
  }
}

// Initialize with environment variable if available
initializeGemini(process.env.GEMINI_API_KEY);

// Medical imaging analysis prompt template
const MEDICAL_ANALYSIS_PROMPT = `
You are a specialized Medical Imaging AI Assistant. Analyze the provided medical imaging context and provide:

1. **Clinical Findings**: Detailed description of visible anatomical structures and potential abnormalities
2. **Differential Diagnosis**: Possible conditions based on imaging findings
3. **Recommendations**: Next steps for further evaluation or treatment
4. **Urgency Level**: Low, Medium, or High priority for clinical review

IMPORTANT: Always include this disclaimer:
"⚠️ DISCLAIMER: This AI analysis is for educational and assistance purposes only. It is not a substitute for professional medical diagnosis by qualified healthcare providers. Always consult with licensed medical professionals for accurate diagnosis and treatment decisions."

Context: {context}
Question: {question}
`;

router.post('/analyze-image', async (req, res) => {
  try {
    const { imageData, question, clinicalContext, apiKey } = req.body;

    if (!imageData && !question) {
      return res.status(400).json({
        error: 'Either image data or question is required'
      });
    }

    // Use provided API key or existing one
    const keyToUse = apiKey || (genAI ? 'existing' : null);
    if (!keyToUse) {
      return res.status(500).json({
        error: 'Gemini AI not configured',
        message: 'Please configure your Gemini API key in the settings'
      });
    }

    // Initialize with provided key if different
    let modelInstance = genAI;
    if (apiKey && (!genAI || apiKey !== process.env.GEMINI_API_KEY)) {
      const tempGenAI = new GoogleGenerativeAI(apiKey);
      modelInstance = tempGenAI;
    }

    const model = modelInstance.getGenerativeModel({ model: currentModel });

    const prompt = MEDICAL_ANALYSIS_PROMPT
      .replace('{context}', clinicalContext || 'No specific clinical context provided')
      .replace('{question}', question || 'Please analyze this medical image');

    let result;

    if (imageData) {
      // For image analysis
      const imageParts = [{
        inlineData: {
          data: imageData,
          mimeType: 'image/jpeg'
        }
      }];

      result = await model.generateContent([prompt, ...imageParts]);
    } else {
      // For text-only queries
      const textModel = modelInstance.getGenerativeModel({ model: currentModel });
      result = await textModel.generateContent(prompt);
    }

    const response = await result.response;
    const analysis = response.text();

    res.json({
      success: true,
      analysis: analysis,
      timestamp: new Date().toISOString(),
      model: 'Gemini Pro Vision',
      disclaimer: 'AI analysis for educational purposes only - consult healthcare professionals'
    });

  } catch (error) {
    console.error('Analysis error:', error);
    res.status(500).json({
      error: 'Analysis failed',
      message: error.message
    });
  }
});

router.post('/chat', async (req, res) => {
  try {
    const { message, history = [], apiKey } = req.body;

    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Use provided API key or existing one
    const keyToUse = apiKey || (genAI ? 'existing' : null);
    if (!keyToUse) {
      return res.status(500).json({
        error: 'Gemini AI not configured',
        message: 'Please configure your Gemini API key in the settings'
      });
    }

    // Initialize with provided key if different
    let modelInstance = genAI;
    if (apiKey && (!genAI || apiKey !== process.env.GEMINI_API_KEY)) {
      const tempGenAI = new GoogleGenerativeAI(apiKey);
      modelInstance = tempGenAI;
    }

    const model = modelInstance.getGenerativeModel({ model: currentModel });
    
    const medicalChatPrompt = `You are a Medical Imaging Specialist AI. Provide accurate, educational information about medical imaging techniques, interpretations, and related healthcare topics.

Guidelines:
- Be precise and evidence-based
- Explain medical concepts clearly
- Include appropriate disclaimers
- Focus on imaging modalities (X-ray, CT, MRI, Ultrasound, etc.)
- Discuss common findings and their significance

User question: ${message}

Remember to include educational disclaimer.`;

    const result = await model.generateContent(medicalChatPrompt);
    const response = await result.response;
    const text = response.text();

    res.json({
      success: true,
      response: text,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ 
      error: 'Chat processing failed', 
      message: error.message 
    });
  }
});

router.get('/imaging-modalities', (req, res) => {
  const modalities = [
    {
      id: 'xray',
      name: 'X-Ray',
      description: 'Radiographic imaging using electromagnetic radiation',
      uses: ['Bone fractures', 'Chest conditions', 'Dental imaging'],
      limitations: ['Limited soft tissue detail', 'Radiation exposure']
    },
    {
      id: 'ct',
      name: 'CT Scan',
      description: 'Computed Tomography - cross-sectional imaging using X-rays',
      uses: ['Trauma', 'Cancer detection', 'Internal bleeding'],
      limitations: ['Higher radiation', 'Cost']
    },
    {
      id: 'mri',
      name: 'MRI',
      description: 'Magnetic Resonance Imaging using magnetic fields',
      uses: ['Brain disorders', 'Joint injuries', 'Soft tissue tumors'],
      limitations: ['Metallic implants', 'Claustrophobia', 'Cost and time']
    },
    {
      id: 'ultrasound',
      name: 'Ultrasound',
      description: 'Sonography using high-frequency sound waves',
      uses: ['Pregnancy', 'Abdominal organs', 'Blood flow'],
      limitations: ['Operator dependent', 'Limited bone penetration']
    }
  ];

  res.json({ modalities });
});

// Settings endpoints
router.post('/update-settings', (req, res) => {
  try {
    const { apiKey } = req.body;

    if (apiKey) {
      initializeGemini(apiKey);
    }

    res.json({
      success: true,
      message: 'Settings updated successfully',
      currentModel: currentModel
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({
      error: 'Failed to update settings',
      message: error.message
    });
  }
});

router.post('/test-gemini', async (req, res) => {
  try {
    const { apiKey } = req.body;

    if (!apiKey) {
      return res.status(400).json({
        error: 'API key is required for testing'
      });
    }

    // Temporarily initialize with provided key for testing
    const testGenAI = new GoogleGenerativeAI(apiKey);
    const model = testGenAI.getGenerativeModel({ model: currentModel });

    const testPrompt = 'Respond with "Connection successful" if you can read this message.';
    const result = await model.generateContent(testPrompt);
    const response = await result.response;
    const text = response.text();

    if (text.toLowerCase().includes('connection successful')) {
      res.json({
        success: true,
        message: 'Gemini API connection successful'
      });
    } else {
      res.json({
        success: false,
        message: 'Unexpected response from Gemini API'
      });
    }
  } catch (error) {
    console.error('Connection test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to connect to Gemini API',
      message: error.message
    });
  }
});

module.exports = router;
