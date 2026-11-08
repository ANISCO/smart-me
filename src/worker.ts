import { onRequestPost as chatPost, onRequestOptions as chatOptions } from "../functions/api/chat";
import { onRequestGet as providersGet } from "../functions/api/providers";

interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
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

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/health") {
      if (request.method !== "GET") {
        return new Response("Method Not Allowed", {
          status: 405,
          headers: { Allow: "GET" },
        });
      }
      return new Response(JSON.stringify({ ok: true, service: "smart-me-api", apiVersion: 1 }), {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
        },
      });
    }

    if (pathname === "/api/chat") {
      if (request.method === "OPTIONS") return chatOptions({ request });
      if (request.method === "POST") return chatPost({ request, env });
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "POST, OPTIONS" },
      });
    }

    if (pathname === "/api/providers") {
      if (request.method === "GET") return providersGet({ request, env });
      return new Response("Method Not Allowed", {
        status: 405,
        headers: { Allow: "GET" },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
