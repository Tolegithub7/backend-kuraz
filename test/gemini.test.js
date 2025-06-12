const { GoogleGenerativeAI } = require('@google/generative-ai');
const geminiService = require('../services/gemini');
const mockResponse = "Mocked AI response";

// Mock the Gemini API
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn().mockResolvedValue({
        response: { text: () => mockResponse }
      })
    })
  }))
}));

describe('Gemini Service', () => {
  it('should generate AI response', async () => {
    const prompt = "Test prompt";
    const response = await geminiService.generateResponse(prompt);
    expect(response).toBe(mockResponse);
  });

  it('should handle API errors', async () => {
    GoogleGenerativeAI.mockImplementationOnce(() => {
      throw new Error('API Error');
    });
    await expect(geminiService.generateResponse("test"))
      .rejects.toThrow('Failed to generate response');
  });
});