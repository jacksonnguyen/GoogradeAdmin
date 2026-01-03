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
    - Use generic classes for styling if needed: 'highlight', 'example-box', 'warning-box'.
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
