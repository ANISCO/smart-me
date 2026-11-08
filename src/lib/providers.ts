import type { AIProvider, ProviderDef } from '../types';

export const PROVIDERS: Record<AIProvider, ProviderDef> = {
  gemini: {
    id: 'gemini',
    label: 'geminiLabel',
    description: 'geminiDesc',
    secretKey: 'GEMINI_API_KEY',
    docsUrl: 'https://aistudio.google.com/apikey',
    models: [
      { id: 'gemini-2.0-flash', label: 'Gemini 2.0 Flash', free: true, contextWindow: '1M' },
      { id: 'gemini-2.0-flash-lite', label: 'Gemini 2.0 Flash Lite', free: true, contextWindow: '1M' },
      { id: 'gemini-1.5-flash', label: 'Gemini 1.5 Flash', free: true, contextWindow: '1M' },
      { id: 'gemini-1.5-flash-8b', label: 'Gemini 1.5 Flash 8B', free: true, contextWindow: '1M' },
      { id: 'gemini-1.5-pro', label: 'Gemini 1.5 Pro', free: false, contextWindow: '2M' },
    ],
  },
  groq: {
    id: 'groq',
    label: 'groqLabel',
    description: 'groqDesc',
    secretKey: 'GROQ_API_KEY',
    docsUrl: 'https://console.groq.com/keys',
    models: [
      { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B Versatile', free: true, contextWindow: '128K' },
      { id: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant', free: true, contextWindow: '128K' },
      { id: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B Versatile', free: true, contextWindow: '128K' },
      { id: 'gemma2-9b-it', label: 'Gemma 2 9B', free: true, contextWindow: '8K' },
      { id: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B', free: true, contextWindow: '32K' },
    ],
  },
  openrouter: {
    id: 'openrouter',
    label: 'openrouterLabel',
    description: 'openrouterDesc',
    secretKey: 'OPENROUTER_API_KEY',
    docsUrl: 'https://openrouter.ai/keys',
    models: [
      { id: 'google/gemini-2.0-flash-exp:free', label: 'Gemini 2.0 Flash (Free)', free: true, contextWindow: '1M' },
      { id: 'meta-llama/llama-3.3-70b-instruct:free', label: 'Llama 3.3 70B (Free)', free: true, contextWindow: '128K' },
      { id: 'google/gemini-flash-1.5:free', label: 'Gemini Flash 1.5 (Free)', free: true, contextWindow: '1M' },
      { id: 'qwen/qwen-2.5-72b-instruct:free', label: 'Qwen 2.5 72B (Free)', free: true, contextWindow: '32K' },
      { id: 'openai/gpt-4o-mini', label: 'GPT-4o Mini', free: false, contextWindow: '128K' },
      { id: 'anthropic/claude-3.5-sonnet', label: 'Claude 3.5 Sonnet', free: false, contextWindow: '200K' },
      { id: 'openai/gpt-4o', label: 'GPT-4o', free: false, contextWindow: '128K' },
    ],
  },
};

export const PROVIDER_ORDER: AIProvider[] = ['gemini', 'groq', 'openrouter'];

export function getProvider(id: AIProvider): ProviderDef {
  return PROVIDERS[id];
}

export function sortedModels(provider: ProviderDef) {
  return [...provider.models].sort((a, b) => {
    if (a.free === b.free) return 0;
    return a.free ? -1 : 1;
  });
}
