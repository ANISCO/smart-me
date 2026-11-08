# Deploy Smart Me on Cloudflare Pages

This repository is a Vite app with Cloudflare Pages Functions under `functions/`.

## 1. Create the Pages project

1. Sign in to Cloudflare.
2. Open **Workers & Pages → Create → Pages → Connect to Git**.
3. Select `ANISCO/smart-me`.
4. For the first deployment, select branch `feat/ai-agent-foundation` (after the pull request is reviewed) or the branch you intentionally want to deploy.
5. Set:
   - Framework preset: **Vite**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
6. Deploy.

Cloudflare Pages automatically detects the `functions/` directory at the repository root. Do not put it inside `src/` or `dist/`.

## 2. Add secrets

In **Workers & Pages → your Pages project → Settings → Variables and Secrets**, add encrypted secrets for the Production environment:

- `APP_ACCESS_TOKEN` — generate a long random value (at least 32 bytes).
- At least one provider key, for example `OPENROUTER_API_KEY` or `GEMINI_API_KEY`.

Optional provider secrets:

- `GROQ_API_KEY`
- `DEEPSEEK_API_KEY`
- `MISTRAL_API_KEY`
- `CEREBRAS_API_KEY`
- `TOGETHER_API_KEY`
- `FIREWORKS_API_KEY`
- `OPENAI_API_KEY`
- `SAMBANOVA_API_KEY`

Save and trigger a new deployment after changing secrets.

## 3. Protect the app

For a personal deployment, enable Cloudflare Access for the Pages hostname and allow only your own email identity. Keep the app access token as a second gate. Do not rely on an obscure URL as authentication.

## 4. Verify the gateway

After deployment, test the API from the browser developer console or a REST client:

```http
GET /api/providers
X-Smart-Me-Token: YOUR_APP_ACCESS_TOKEN
```

Then send a small `POST /api/chat` request with a provider, a valid model ID for that provider, and one user message.

## 5. Local development

The frontend can run with `npm run dev`, but Vite does not execute Cloudflare Pages Functions. To test the API locally, install Wrangler as a development dependency and use `wrangler pages dev` after setting local secrets in an ignored `.dev.vars` file. Never commit `.dev.vars`.

## Important

- The gateway code is not deployed merely because it exists on GitHub; the Pages project must be created and deployed.
- Model IDs, free quotas and provider pricing change. Verify them in the provider's current dashboard before selecting a production model.
- The current gateway returns non-streaming text. Streaming, tools/function calling and agent execution are later milestones.
