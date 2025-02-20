import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize with environment variable
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Validate API key
if (!API_KEY) {
  console.warn('Gemini API key is not set. Please set VITE_GEMINI_API_KEY in your .env file.');
}

const genAI = new GoogleGenerativeAI(API_KEY || '');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

type AIAction = {
  type: 'rewrite' | 'modify' | 'tone' | 'transform';
  action: string;
  prompt: string;
};

const AI_ACTIONS: Record<string, AIAction> = {
  rewrite: { type: 'rewrite', action: 'Rewrite', prompt: 'Rewrite the following text and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  improveWriting: { type: 'rewrite', action: 'Improve writing', prompt: 'Improve the writing of the following text and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  fixSpellingGrammar: { type: 'rewrite', action: 'Fix spelling and grammar', prompt: 'Fix the spelling and grammar of the following text and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  singleSentence: { type: 'rewrite', action: 'Single sentence', prompt: 'Rewrite the following text as a single sentence and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  convertToUS: { type: 'rewrite', action: 'Convert to US English', prompt: 'Convert the following text to US English and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  simplifyLanguage: { type: 'rewrite', action: 'Simplify language', prompt: 'Simplify the language of the following text and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  singleParagraph: { type: 'rewrite', action: 'Single paragraph', prompt: 'Rewrite the following text into a single paragraph and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  
  shorten: { type: 'modify', action: 'Shorten', prompt: 'Shorten the following text while maintaining its key points and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  expand: { type: 'modify', action: 'Expand', prompt: 'Expand the following text with more details and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  summarize: { type: 'modify', action: 'Summarize', prompt: 'Summarize the following text and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  explain: { type: 'modify', action: 'Explain', prompt: 'Explain the following text in simple terms and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  
  friendly: { type: 'tone', action: 'Friendly tone', prompt: 'Rewrite the following text in a friendly tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  casual: { type: 'tone', action: 'Casual tone', prompt: 'Rewrite the following text in a casual tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  professional: { type: 'tone', action: 'Professional tone', prompt: 'Rewrite the following text in a professional tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  excited: { type: 'tone', action: 'Excited tone', prompt: 'Rewrite the following text in an excited tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  confident: { type: 'tone', action: 'Confident tone', prompt: 'Rewrite the following text in a confident tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  appreciative: { type: 'tone', action: 'Appreciative tone', prompt: 'Rewrite the following text in an appreciative tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  direct: { type: 'tone', action: 'Direct tone', prompt: 'Rewrite the following text in a direct tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  regretful: { type: 'tone', action: 'Regretful tone', prompt: 'Rewrite the following text in a regretful tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  thoughtful: { type: 'tone', action: 'Thoughtful tone', prompt: 'Rewrite the following text in a thoughtful tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  critical: { type: 'tone', action: 'Critical tone', prompt: 'Rewrite the following text in a critical tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  hopeful: { type: 'tone', action: 'Hopeful tone', prompt: 'Rewrite the following text in a hopeful tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  surprised: { type: 'tone', action: 'Surprised tone', prompt: 'Rewrite the following text in a surprised tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  optimistic: { type: 'tone', action: 'Optimistic tone', prompt: 'Rewrite the following text in an optimistic tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  curious: { type: 'tone', action: 'Curious tone', prompt: 'Rewrite the following text in a curious tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  assertive: { type: 'tone', action: 'Assertive tone', prompt: 'Rewrite the following text in an assertive tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  informative: { type: 'tone', action: 'Informative tone', prompt: 'Rewrite the following text in an informative tone and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  
  bulletList: { type: 'transform', action: 'Bullet list', prompt: 'Convert the following text into a bullet list and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
  numberedList: { type: 'transform', action: 'Numbered list', prompt: 'Convert the following text into a numbered list and return it as a JSON object with a "content" field. Do not include any markdown formatting or special characters:' },
};

function cleanupText(text: string): string {
  return text
    // Remove markdown formatting
    .replace(/\*\*/g, '') // Remove all asterisks
    .replace(/\*/g, '')   // Remove single asterisks
    .replace(/`/g, '')    // Remove backticks
    .replace(/~/g, '')    // Remove tildes
    .replace(/_{1,2}/g, '') // Remove underscores
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove markdown links, keep text
    
    // Remove quotes
    .replace(/^["'`]|["'`]$/g, '') // Remove quotes at start/end
    .replace(/\\"/g, '"')          // Unescape quotes
    .replace(/\\'/g, "'")          // Unescape single quotes
    
    // Remove HTML-like formatting
    .replace(/<[^>]+>/g, '')       // Remove HTML tags
    .replace(/&[a-z]+;/g, '')      // Remove HTML entities
    
    // Clean up whitespace
    .replace(/\s+/g, ' ')          // Normalize whitespace
    .trim();                       // Remove leading/trailing whitespace
}

function extractJSONContent(text: string): string {
  // Try to find a JSON object in the text
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    try {
      const jsonObj = JSON.parse(jsonMatch[0]);
      if (jsonObj.content) {
        return jsonObj.content;
      }
    } catch (e) {
      // If JSON parsing fails, continue to regular cleanup
    }
  }
  return text;
}

export async function generateAIResponse(text: string, actionKey: keyof typeof AI_ACTIONS) {
  // Validate API key first
  if (!API_KEY) {
    throw new Error('Gemini API key is not set. Please set VITE_GEMINI_API_KEY in your .env file.');
  }

  const action = AI_ACTIONS[actionKey];
  if (!action) throw new Error('Invalid action');

  const prompt = `${action.prompt}\n\nText: "${text}"\n\nRespond ONLY with a JSON object that has a single "content" field containing the result. The content should not include any markdown formatting, special characters, or HTML. Example: {"content": "Your plain text here"}\n\nDo not include any other text or formatting in your response.`;
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let responseText = response.text();
    
    // First try to extract and parse JSON
    responseText = extractJSONContent(responseText);
    
    // Then clean up any remaining formatting
    responseText = cleanupText(responseText);
    
    // Verify the result is not empty
    if (!responseText.trim()) {
      throw new Error('Empty response from AI');
    }
    
    return responseText;
  } catch (error) {
    console.error('AI generation error:', error);
    if (!API_KEY) {
      throw new Error('Missing API key. Please set VITE_GEMINI_API_KEY in your .env file.');
    }
    throw new Error('Failed to generate AI response. Please try again later.');
  }
}

export const aiActions = Object.entries(AI_ACTIONS).reduce((acc, [key, value]) => {
  const category = acc.find(c => c.type === value.type) || { type: value.type, actions: [] };
  if (!acc.includes(category)) {
    acc.push(category);
  }
  category.actions.push({ key, label: value.action });
  return acc;
}, [] as Array<{ type: string; actions: Array<{ key: string; label: string }> }>);