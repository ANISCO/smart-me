# Smart Me — AI Architecture

## Product objective

Smart Me is a personal, mobile-first AI agent. It should help with daily work, planning, translation, documents, business workflows and personal organization. The first milestone is a reliable private chat gateway; agent tools and long-term memory are added only after the gateway is tested.

## Architecture decisions

- **Frontend:** existing React + TypeScript + Vite PWA. Preserve the current UI and existing local-first modules.
- **Backend:** Cloudflare Pages Functions, deployed alongside the static Vite app. Static asset requests are free; Functions use the Cloudflare Workers request allowance.
- **Provider gateway:** one server-side API contract with adapters for OpenAI-compatible chat-completions endpoints.
- **Secrets:** provider API keys and `APP_ACCESS_TOKEN` are Cloudflare Pages environment secrets only. Never put provider keys in Vite variables, source code, localStorage, or client bundles.
- **Initial persistence:** keep existing localStorage behavior. Introduce remote database/auth only when cross-device sync and multi-device identity are implemented deliberately.
- **Provider independence:** provider ID and model ID are separate settings. The model ID is not hard-coded into the gateway, so model catalogs can evolve without changing the request protocol.

## Supported provider adapters

| Provider | Secret name | API style |
| --- | --- | --- |
| OpenRouter | `OPENROUTER_API_KEY` | OpenAI-compatible |
| Google Gemini | `GEMINI_API_KEY` | Google OpenAI-compatible endpoint |
| Groq | `GROQ_API_KEY` | OpenAI-compatible |
| DeepSeek | `DEEPSEEK_API_KEY` | OpenAI-compatible |
| Mistral | `MISTRAL_API_KEY` | OpenAI-compatible |
| Cerebras | `CEREBRAS_API_KEY` | OpenAI-compatible |
| Together AI | `TOGETHER_API_KEY` | OpenAI-compatible |
| Fireworks AI | `FIREWORKS_API_KEY` | OpenAI-compatible |
| OpenAI | `OPENAI_API_KEY` | OpenAI-compatible |
| SambaNova | `SAMBANOVA_API_KEY` | OpenAI-compatible |

OpenRouter is the broad-coverage option: one key can expose models from many upstream labs. Direct provider adapters remain useful for comparing latency, quotas, privacy terms and cost. Anthropic models can be reached through OpenRouter initially; a native Anthropic adapter can be added when its provider-specific message/tool format is needed. Local Ollama is a separate network mode and should not be routed through a public server by default.

## API contract

- `POST /api/chat`: authenticated chat request with `provider`, `model`, and `messages`.
- `GET /api/providers`: authenticated list of providers and whether their server-side key is configured.
- Client authentication: `X-Smart-Me-Token` header. This is an app access token, not an AI provider key.
- Provider keys never leave the server.
- The gateway validates roles, message counts, text size and output token limits; upstream errors are normalized.

## Security requirements

1. Deploy the Pages project privately or protect it with Cloudflare Access. Keep `APP_ACCESS_TOKEN` enabled as an additional application-level gate.
2. Store all provider keys as encrypted Cloudflare Pages secrets. Never commit `.env` files or secrets.
3. Do not enable arbitrary upstream URLs: that creates an SSRF surface.
4. Do not execute model-generated code or tool calls without explicit, narrowly scoped permissions.
5. Require user confirmation for external side effects (sending messages, purchases, deleting files, financial actions).
6. Add request throttling and usage budgets before sharing the application with anyone else.
7. Avoid logging prompts, uploaded documents or API keys.

## Cost policy

1. Start with free-tier direct providers and OpenRouter free models for experimentation.
2. Use a low-cost/fast model for classification, translation drafts and simple tasks.
3. Escalate to a stronger model only for complex reasoning, long documents or tasks that fail quality checks.
4. Keep max output tokens bounded and send only relevant context.
5. Track provider/model usage and show estimated spend before enabling paid workflows.
6. Never assume a model is free because its name contains "free"; check current provider pricing and quotas.

## Delivery phases

- **Phase 1 — Gateway:** secure server-side provider routing and a real chat round trip.
- **Phase 2 — Reliability:** streaming, model catalog refresh, retries/fallback, usage accounting and limits.
- **Phase 3 — Agent runtime:** typed tools, permission tiers, confirmation UI, task execution and audit history.
- **Phase 4 — Memory and files:** searchable personal knowledge, document extraction, explicit retention controls and cross-device sync.
- **Phase 5 — Voice and integrations:** speech-to-text/text-to-speech, calendar, email and other connectors.

## Non-goals for the first release

- No autonomous financial transactions.
- No unrestricted browser or shell access.
- No API keys stored in the browser.
- No mandatory paid database or model subscription.
- No claim that the app is a functioning agent until tools, permissions, persistence and recovery behavior are implemented and tested.
