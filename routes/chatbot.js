const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');
const auth = require('../middleware/auth');

router.post('/ask', auth, async (req, res) => {
  try {
    const { message } = req.body;
    
    // Enhanced validation
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message must be a non-empty string' });
    }

    const prompt = `You're a helpful task management assistant. 
    User asks: "${message}". 
    Respond concisely and helpfully about productivity or task management.`;

    const response = await geminiService.generateResponse(prompt);
    
    res.json({ 
      response,
      metadata: {
        length: response.length,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Chatbot endpoint error:', error);
    res.status(500).json({ 
      error: 'Failed to process your request',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;