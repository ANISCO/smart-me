# Deploy Smart Me on Cloudflare Workers

The existing Cloudflare project is a **Worker** (not a Pages project). This repository uses Workers Static Assets plus a Worker entry point to serve the Vite PWA and handle the AI API routes.

## Build configuration

Keep the Cloudflare Worker name as `smart-me` so it matches `wrangler.jsonc`.

- Git repository: `ANISCO/smart-me`
- Production branch: `main`
- Build command: `npm run build`
- Deploy command: `npx wrangler deploy`
- Root directory: `/`

The Wrangler config uses `dist` as the static asset directory, routes `/api/*` through `src/worker.ts`, and serves the React SPA for navigation requests.

## Add encrypted secrets

In **Workers & Pages → smart-me → Settings → Variables and Secrets**, add these as **encrypted secrets** (not plain-text variables):

Required:
- `APP_ACCESS_TOKEN` — generate a long random value (at least 32 bytes).
- At least one provider key, for example `GEMINI_API_KEY` or `OPENROUTER_API_KEY`.

Optional:
- `GROQ_API_KEY`
- `DEEPSEEK_API_KEY`
- `MISTRAL_API_KEY`
- `CEREBRAS_API_KEY`
- `TOGETHER_API_KEY`
- `FIREWORKS_API_KEY`
- `OPENAI_API_KEY`
- `SAMBANOVA_API_KEY`

Do not paste provider keys into the app, GitHub, source files, or this chat. After adding or changing secrets, deploy a new Worker version.

## Protect the personal app

Use **Cloudflare Access** to restrict the `workers.dev` hostname to your own identity. The app access token is a second gate, not a substitute for Access. Do not share the access token.

## Configure the app

After the new Worker deployment is active:

1. Open Smart Me → Settings.
2. Paste the `APP_ACCESS_TOKEN` value into the gateway access-token field and save.
3. Select a provider and a model that is currently available for that provider.
4. Open Chat and send a short test message.

## API behavior

- `GET /api/providers` with `X-Smart-Me-Token` returns configured-provider status.
- `POST /api/chat` with `X-Smart-Me-Token` sends the selected model request to the provider.
- The current gateway is non-streaming and does not yet execute agent tools.

## Local validation

Run `npm ci`, `npm run typecheck`, `npm run lint`, and `npm run build`. For Worker runtime testing, use Wrangler with local secrets in an ignored `.dev.vars` file. Never commit `.dev.vars`.
