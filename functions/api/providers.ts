interface Env {
  APP_ACCESS_TOKEN?: string;
  OPENROUTER_API_KEY?: string;
  GEMINI_API_KEY?: string;
  GROQ_API_KEY?: string;
  DEEPSEEK_API_KEY?: string;
  MISTRAL_API_KEY?: string;
  CEREBRAS_API_KEY?: string;
  TOGETHER_API_KEY?: string;
  FIREWORKS_API_KEY?: string;
  OPENAI_API_KEY?: string;
  SAMBANOVA_API_KEY?: string;
}

const PROVIDERS: Array<{ id: string; label: string; secret: keyof Env }> = [
  { id: "openrouter", label: "OpenRouter", secret: "OPENROUTER_API_KEY" },
  { id: "gemini", label: "Google Gemini", secret: "GEMINI_API_KEY" },
  { id: "groq", label: "Groq", secret: "GROQ_API_KEY" },
  { id: "deepseek", label: "DeepSeek", secret: "DEEPSEEK_API_KEY" },
  { id: "mistral", label: "Mistral", secret: "MISTRAL_API_KEY" },
  { id: "cerebras", label: "Cerebras", secret: "CEREBRAS_API_KEY" },
  { id: "together", label: "Together AI", secret: "TOGETHER_API_KEY" },
  { id: "fireworks", label: "Fireworks AI", secret: "FIREWORKS_API_KEY" },
  { id: "openai", label: "OpenAI", secret: "OPENAI_API_KEY" },
  { id: "sambanova", label: "SambaNova", secret: "SAMBANOVA_API_KEY" },
];

export const onRequestGet = async ({ request, env }: { request: Request; env: Env }) => {
  const expected = env.APP_ACCESS_TOKEN;
  const supplied = request.headers.get("X-Smart-Me-Token") ?? "";
  if (!expected || !supplied || supplied !== expected) {
    return new Response(JSON.stringify({ error: "Unauthorized." }), {
      status: expected ? 401 : 503,
      headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
    });
  }

  const providers = PROVIDERS.map(({ id, label, secret }) => ({
    id,
    label,
    configured: Boolean(env[secret]),
  }));

  return new Response(JSON.stringify({ providers }), {
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });
};
