# Smart Me — AI Architecture

## Product objective

Smart Me is a personal, mobile-first AI agent. The first milestone is a private, reliable chat gateway. Agent tools and long-term memory follow only after the gateway is tested.

## Architecture

- **Frontend:** React + TypeScript + Vite PWA, served as Cloudflare Worker Static Assets.
- **Backend:** a Cloudflare Worker entry point in `src/worker.ts` routes API requests and serves the static app through the `ASSETS` binding.
- **Provider gateway:** one server-side API contract with adapters for OpenAI-compatible chat-completions endpoints.
- **Secrets:** provider API keys and `APP_ACCESS_TOKEN` are encrypted Worker secrets. Never put provider keys in Vite variables, source code, localStorage, or client bundles.
- **Initial persistence:** localStorage remains device-local. Remote database/auth is a separate future milestone for cross-device sync.
- **Provider independence:** provider ID and model ID are separate settings; the gateway accepts model IDs without hard-coding a catalog.

## Supported provider adapters

| Provider | Secret name |
| --- | --- |
| OpenRouter | `OPENROUTER_API_KEY` |
| Google Gemini | `GEMINI_API_KEY` |
| Groq | `GROQ_API_KEY` |
| DeepSeek | `DEEPSEEK_API_KEY` |
| Mistral | `MISTRAL_API_KEY` |
| Cerebras | `CEREBRAS_API_KEY` |
| Together AI | `TOGETHER_API_KEY` |
| Fireworks AI | `FIREWORKS_API_KEY` |
| OpenAI | `OPENAI_API_KEY` |
| SambaNova | `SAMBANOVA_API_KEY` |

OpenRouter is the broad-coverage option: one key can expose models from multiple upstream providers. Direct adapters remain useful for comparing latency, quotas, privacy terms and cost. Provider model IDs and free quotas change; the static frontend catalog must be refreshed and verified before relying on it.

## API contract

- `POST /api/chat`: authenticated chat request with `provider`, `model`, and `messages`.
- `GET /api/providers`: authenticated list of providers and whether a server-side key is configured.
- Client authentication uses `X-Smart-Me-Token`. This is an app access token, not a provider API key.
- Provider keys never leave the Worker.
- The gateway validates roles, message counts, text size and output token limits; upstream errors are normalized.

## Security requirements

1. Restrict the personal app with Cloudflare Access where practical; keep `APP_ACCESS_TOKEN` as an additional application-level gate.
2. Store provider keys as encrypted Worker secrets. Never commit `.env` or secret values.
3. Do not allow arbitrary upstream URLs (SSRF risk).
4. Do not execute model-generated code or tools without narrow permissions.
5. Require confirmation for external side effects such as sending messages, purchases, deleting files or financial actions.
6. Add rate limits and usage budgets before sharing the app.
7. Avoid logging prompts, uploaded documents or API keys.
8. The current browser-held app token is a convenience gate, not a replacement for Cloudflare Access.

## Cost policy

1. Start with verified free-tier models and provider quotas.
2. Use fast/low-cost models for simple tasks; escalate only when needed.
3. Bound output tokens and send only relevant context.
4. Track provider/model usage and show estimated spend before paid workflows.
5. Never assume a model is free from its label; verify current pricing and quotas.

## Delivery phases

- **Phase 1 — Gateway:** secure server-side routing and a real chat round trip.
- **Phase 2 — Reliability:** streaming, live model catalog, retries/fallback, usage accounting and limits.
- **Phase 3 — Agent runtime:** typed tools, permission tiers, confirmation UI, task execution and audit history.
- **Phase 4 — Memory and files:** searchable personal knowledge, document extraction, retention controls and cross-device sync.
- **Phase 5 — Voice and integrations:** speech-to-text/text-to-speech, calendar, email and other connectors.

## First-release boundaries

- No autonomous financial transactions.
- No unrestricted browser or shell access.
- No provider API keys in the browser.
- No mandatory paid database or model subscription.
- Do not call the app a functioning agent until tools, permissions, persistence and recovery behavior are implemented and tested.
