const { GoogleGenerativeAI } = require('@google/generative-ai');

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('Missing GEMINI_API_KEY in environment variables');
    }
    
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ 
      model: "gemini-pro",
      generationConfig: { temperature: 0.9 }
    });
  }

  async generateResponse(prompt) {
    try {
      console.log('Sending prompt to Gemini:', prompt); // Debug log
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      console.log('Received response:', text); // Debug log
      return text;
    } catch (error) {
      console.error('Full Gemini API Error:', {
        message: error.message,
        stack: error.stack,
        response: error.response?.data
      });
      throw new Error(`Failed to generate response: ${error.message}`);
    }
  }
}

module.exports = new GeminiService();