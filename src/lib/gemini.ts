import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCIaiCgec4aica0Ver-z4jWuBln9pI59vY');
const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

type AIAction = {
  type: 'rewrite' | 'modify' | 'tone' | 'transform';
  action: string;
  prompt: string;
};

const AI_ACTIONS: Record<string, AIAction> = {
  rewrite: { type: 'rewrite', action: 'Rewrite', prompt: 'Rewrite the following text:' },
  improveWriting: { type: 'rewrite', action: 'Improve writing', prompt: 'Improve the writing of the following text:' },
  fixSpellingGrammar: { type: 'rewrite', action: 'Fix spelling and grammar', prompt: 'Fix the spelling and grammar of the following text:' },
  singleSentence: { type: 'rewrite', action: 'Single sentence', prompt: 'Rewrite the following text as a single sentence:' },
  convertToUS: { type: 'rewrite', action: 'Convert to US English', prompt: 'Convert the following text to US English:' },
  simplifyLanguage: { type: 'rewrite', action: 'Simplify language', prompt: 'Simplify the language of the following text:' },
  singleParagraph: { type: 'rewrite', action: 'Single paragraph', prompt: 'Rewrite the following text into a single paragraph:' },
  
  shorten: { type: 'modify', action: 'Shorten', prompt: 'Shorten the following text while maintaining its key points:' },
  expand: { type: 'modify', action: 'Expand', prompt: 'Expand the following text with more details:' },
  summarize: { type: 'modify', action: 'Summarize', prompt: 'Summarize the following text:' },
  explain: { type: 'modify', action: 'Explain', prompt: 'Explain the following text in simple terms:' },
  
  friendly: { type: 'tone', action: 'Friendly tone', prompt: 'Rewrite the following text in a friendly tone:' },
  casual: { type: 'tone', action: 'Casual tone', prompt: 'Rewrite the following text in a casual tone:' },
  professional: { type: 'tone', action: 'Professional tone', prompt: 'Rewrite the following text in a professional tone:' },
  excited: { type: 'tone', action: 'Excited tone', prompt: 'Rewrite the following text in an excited tone:' },
  confident: { type: 'tone', action: 'Confident tone', prompt: 'Rewrite the following text in a confident tone:' },
  appreciative: { type: 'tone', action: 'Appreciative tone', prompt: 'Rewrite the following text in an appreciative tone:' },
  direct: { type: 'tone', action: 'Direct tone', prompt: 'Rewrite the following text in a direct tone:' },
  regretful: { type: 'tone', action: 'Regretful tone', prompt: 'Rewrite the following text in a regretful tone:' },
  thoughtful: { type: 'tone', action: 'Thoughtful tone', prompt: 'Rewrite the following text in a thoughtful tone:' },
  critical: { type: 'tone', action: 'Critical tone', prompt: 'Rewrite the following text in a critical tone:' },
  hopeful: { type: 'tone', action: 'Hopeful tone', prompt: 'Rewrite the following text in a hopeful tone:' },
  surprised: { type: 'tone', action: 'Surprised tone', prompt: 'Rewrite the following text in a surprised tone:' },
  optimistic: { type: 'tone', action: 'Optimistic tone', prompt: 'Rewrite the following text in an optimistic tone:' },
  curious: { type: 'tone', action: 'Curious tone', prompt: 'Rewrite the following text in a curious tone:' },
  assertive: { type: 'tone', action: 'Assertive tone', prompt: 'Rewrite the following text in an assertive tone:' },
  informative: { type: 'tone', action: 'Informative tone', prompt: 'Rewrite the following text in an informative tone:' },
  
  bulletList: { type: 'transform', action: 'Bullet list', prompt: 'Convert the following text into a bullet list:' },
  numberedList: { type: 'transform', action: 'Numbered list', prompt: 'Convert the following text into a numbered list:' },
};

export async function generateAIResponse(text: string, actionKey: keyof typeof AI_ACTIONS) {
  const action = AI_ACTIONS[actionKey];
  if (!action) throw new Error('Invalid action');

  const prompt = `${action.prompt}\n\n${text}`;
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

export const aiActions = Object.entries(AI_ACTIONS).reduce((acc, [key, value]) => {
  const category = acc.find(c => c.type === value.type) || { type: value.type, actions: [] };
  if (!acc.includes(category)) {
    acc.push(category);
  }
  category.actions.push({ key, label: value.action });
  return acc;
}, [] as Array<{ type: string; actions: Array<{ key: string; label: string }> }>);