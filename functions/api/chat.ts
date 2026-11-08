type ProviderConfig = {
  label: string;
  secret: keyof Env;
  url: string;
};

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

type ChatRole = "system" | "user" | "assistant";
type ChatMessage = { role: ChatRole; content: string };

const PROVIDERS: Record<string, ProviderConfig> = {
  openrouter: { label: "OpenRouter", secret: "OPENROUTER_API_KEY", url: "https://openrouter.ai/api/v1/chat/completions" },
  gemini: { label: "Google Gemini", secret: "GEMINI_API_KEY", url: "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions" },
  groq: { label: "Groq", secret: "GROQ_API_KEY", url: "https://api.groq.com/openai/v1/chat/completions" },
  deepseek: { label: "DeepSeek", secret: "DEEPSEEK_API_KEY", url: "https://api.deepseek.com/chat/completions" },
  mistral: { label: "Mistral", secret: "MISTRAL_API_KEY", url: "https://api.mistral.ai/v1/chat/completions" },
  cerebras: { label: "Cerebras", secret: "CEREBRAS_API_KEY", url: "https://api.cerebras.ai/v1/chat/completions" },
  together: { label: "Together AI", secret: "TOGETHER_API_KEY", url: "https://api.together.xyz/v1/chat/completions" },
  fireworks: { label: "Fireworks AI", secret: "FIREWORKS_API_KEY", url: "https://api.fireworks.ai/inference/v1/chat/completions" },
  openai: { label: "OpenAI", secret: "OPENAI_API_KEY", url: "https://api.openai.com/v1/chat/completions" },
  sambanova: { label: "SambaNova", secret: "SAMBANOVA_API_KEY", url: "https://api.sambanova.ai/v1/chat/completions" },
};

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" },
  });

function authorized(request: Request, env: Env): boolean {
  const expected = env.APP_ACCESS_TOKEN;
  const supplied = request.headers.get("X-Smart-Me-Token") ?? "";
  return Boolean(expected && supplied && supplied === expected);
}

export const onRequestOptions = async ({ request }: { request: Request }) => {
  const origin = request.headers.get("Origin");
  const sameOrigin = origin && origin === new URL(request.url).origin;
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": sameOrigin ? origin : "null",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, X-Smart-Me-Token",
      "Vary": "Origin",
    },
  });
};

export const onRequestPost = async ({ request, env }: { request: Request; env: Env }) => {
  if (!env.APP_ACCESS_TOKEN) return json({ error: "The API gateway is not configured. Set APP_ACCESS_TOKEN first." }, 503);
  if (!authorized(request, env)) return json({ error: "Unauthorized. Check your Smart Me access token." }, 401);

  let body: Record<string, unknown>;
  try {
    body = await request.json() as Record<string, unknown>;
  } catch {
    return json({ error: "Request body must be valid JSON." }, 400);
  }

  const providerId = typeof body.provider === "string" ? body.provider : "";
  const model = typeof body.model === "string" ? body.model.trim() : "";
  const provider = PROVIDERS[providerId];
  if (!provider) return json({ error: "Unsupported provider." }, 400);
  if (!model || model.length > 160) return json({ error: "A valid model ID is required." }, 400);
  if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 50) {
    return json({ error: "Send between 1 and 50 messages." }, 400);
  }

  const messages: ChatMessage[] = [];
  for (const item of body.messages) {
    if (!item || typeof item !== "object") return json({ error: "Invalid message." }, 400);
    const message = item as Record<string, unknown>;
    if (!["system", "user", "assistant"].includes(String(message.role)) || typeof message.content !== "string") {
      return json({ error: "Each message needs a valid role and text content." }, 400);
    }
    if (message.content.length > 20000) return json({ error: "A message is too long (20,000 characters max)." }, 400);
    messages.push({ role: message.role as ChatRole, content: message.content });
  }

  const apiKey = env[provider.secret];
  if (typeof apiKey !== "string" || !apiKey) {
    return json({ error: `${provider.label} is not configured on the server yet.` }, 503);
  }

  const requestedMaxTokens = Number(body.max_tokens);
  const maxTokens = Number.isFinite(requestedMaxTokens)
    ? Math.min(Math.max(Math.floor(requestedMaxTokens), 1), 4096)
    : 1200;

  try {
    const upstream = await fetch(provider.url, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        ...(providerId === "openrouter" ? { "HTTP-Referer": new URL(request.url).origin, "X-Title": "Smart Me" } : {}),
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens: maxTokens,
        temperature: 0.4,
        stream: false,
      }),
      signal: AbortSignal.timeout(60000),
    });

    const payload = await upstream.json() as {
      choices?: Array<{ message?: { content?: string | Array<{ type?: string; text?: string }> } }>;
      usage?: unknown;
      error?: { message?: string };
    };

    if (!upstream.ok) {
      const detail = payload.error?.message || `Provider request failed (${upstream.status}).`;
      return json({ error: detail, provider: providerId, status: upstream.status }, upstream.status >= 500 ? 502 : 400);
    }

    const content = payload.choices?.[0]?.message?.content;
    const text = typeof content === "string"
      ? content
      : Array.isArray(content)
        ? content.map((part) => part.text ?? "").join("")
        : "";

    if (!text) return json({ error: "The provider returned an empty response." }, 502);
    return json({ content: text, provider: providerId, model, usage: payload.usage ?? null });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown upstream error.";
    return json({ error: message.includes("Timeout") ? "The AI provider timed out. Try again." : "Could not reach the AI provider." }, 502);
  }
};
