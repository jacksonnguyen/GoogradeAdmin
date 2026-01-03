import { GoogleGenerativeAI } from '@google/generative-ai';

export interface GenerationParams {
  apiKey: string;
  topic: string;
  grade: string;
  type: 'theory' | 'practice';
  additionalInstructions?: string;
}

export const generateLessonContent = async ({
  apiKey,
  topic,
  grade,
  type,
  additionalInstructions
}: GenerationParams) => {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
    You are an expert math curriculum designer for Vietnamese students (Grade ${grade}).
    Create a detailed ${type} lesson about "${topic}" in HTML format.
    
    Requirements:
    - Use semantic HTML (h2, h3, p, ul, ol, li, strong, em).
    - Do NOT include <html>, <head>, or <body> tags. Just the content.
    - CSS Class Rules:
      - Do NOT use more than 4 utility classes per element.
      - Use BEM (Block Element Modifier) class names for complex styling (e.g., 'lesson-card', 'lesson-card__title', 'example-box', 'example-box--highlight').
      - Avoid deep nesting.
    - Language: Vietnamese.
    - Tone: Educational, encouraging, and clear.
    ${additionalInstructions ? `- Additional: ${additionalInstructions}` : ''}
    
    Format the output as raw HTML string.
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  
  // Strip markdown code blocks if present
  return text.replace(/```html|```/g, '');
};

export const chatWithGemini = async (apiKey: string, history: {role: 'user' | 'model', parts: string}[], message: string) => {
  if (!apiKey) throw new Error("API Key is required");

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  // Map simplified history to SDK format
  const formattedHistory = history.map(msg => ({
    role: msg.role,
    parts: [{ text: msg.parts }]
  }));

  const chat = model.startChat({
    history: formattedHistory,
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });

  const result = await chat.sendMessage(message);
  const response = await result.response;
  return response.text();
};
