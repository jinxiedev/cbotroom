import { ChatOptions, Message } from '../types/chat';
import { getConversationHistory, addToConversationHistory } from './chatStorage';

interface AIModel {
  name: string;
  model: string;
  apiBase: string;
  apiKey: string;
}

const AI_MODELS: AIModel[] = [
  {
    name: "DeepSeek R1 Distill Llama 70B (Top Performance)",
    model: "deepseek-r1-distill-llama-70b",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string
  },
  {
    name: "Llama 3.3 70B Versatile (Best Overall)",
    model: "llama-3.3-70b-versatile",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string
  },
  {
    name: "Gemma2 9B IT (Fast & Efficient)",
    model: "gemma2-9b-it",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string
  },
  {
    name: "Llama 4 Maverick 17B (Latest)",
    model: "meta-llama/llama-4-maverick-17b-128e-instruct",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string
  },
  {
    name: "Llama 3.1 8B Instant (Ultra Fast)",
    model: "llama-3.1-8b-instant",
    apiBase: "https://api.groq.com/openai/v1",
    apiKey: import.meta.env.VITE_GROQ_API_KEY as string
  }
];

export function getAvailableModels(): AIModel[] {
  return AI_MODELS;
}

export async function chatWithAI(message: string, options: ChatOptions & { selectedModel?: string } = {}): Promise<string> {
  const {
    selectedModel = "deepseek-r1-distill-llama-70b",
    imageUrl = null,
    chatId = null,
    senderId = null
  } = options;

  try {
    // Find the selected model
    const modelConfig = AI_MODELS.find(m => m.model === selectedModel) || AI_MODELS[0];
    
    // Check if API key is available
    if (!modelConfig.apiKey) {
      throw new Error(`API key not configured for model: ${modelConfig.name}`);
    }
    
    // Get conversation history if available
    let messages: any[] = [];
    if (chatId && senderId) {
      const history = getConversationHistory(chatId, senderId);
      messages = history.map(msg => ({
        role: msg.role,
        content: msg.content
      }));
    }

    // Add new message with proper format for OpenRouter
    const newMessage: any = {
      role: "user",
      content: []
    };

    // Add text content
    newMessage.content.push({
      type: "text",
      text: message
    });

    // Add image if provided
    if (imageUrl) {
      newMessage.content.push({
        type: "image_url",
        image_url: { url: imageUrl }
      });
    }

    // For non-OpenRouter models, use simple string content
    if (!modelConfig.model.includes('openrouter')) {
      newMessage.content = message;
    }

    messages.push(newMessage);

    const payload = {
      model: modelConfig.model,
      messages: messages,
      max_tokens: 1000,
      temperature: 0.7
    };

    const response = await fetch(`${modelConfig.apiBase}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${modelConfig.apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices?.[0]?.message?.content || '⚠️ No response from AI.';

    // Save to memory
    if (chatId && senderId) {
      addToConversationHistory(chatId, senderId, "user", message, imageUrl || undefined);
      addToConversationHistory(chatId, senderId, "assistant", aiResponse);
    }

    return aiResponse;

  } catch (err: any) {
    console.error('AI Service Error:', err);
    return `❌ Error: ${err.message}`;
  }
}