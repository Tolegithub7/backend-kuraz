const express = require('express');
const router = express.Router();
const geminiService = require('../services/gemini');
const auth = require('../middleware/auth');
const validateChatInput = require('../middleware/validateChatInput');

router.post('/ask', auth, validateChatInput, async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Add task context to the prompt
    const prompt = `You're a task management assistant. User asks: "${message}". 
    Respond helpfully about task management, productivity, or related topics.`;
    
    const response = await geminiService.generateResponse(prompt);
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;