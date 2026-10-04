# Blindspot

Blindspot is a decision-support app with an animated **Debate Room Powered by AI**. It frames the user's current direction, a respectful skeptical challenge, and a neutral moderator synthesis. It does not make the decision for the user.

## Run locally

```bash
npm install
npm run dev
```

## Connect Gemini AI

The Debate Room uses a server-side development endpoint, so the API key is never sent to the browser.

Choose one of these options before starting `npm run dev`:

1. Open `api/key.txt` in the project folder and paste your Gemini API key into it. You can paste only the key, or use `GEMINI_API_KEY=your_key_here`.
2. Set the `GEMINI_API_KEY` environment variable.

Optionally set `GEMINI_MODEL` to use a different Gemini model. The default is `gemini-3.8-flash`.

`api/key.txt` is ignored by Git, and the key is used only by the local server, not sent to the browser. After adding or changing a key, restart `npm run dev`. Without a key, the Debate Room displays an in-app setup message and a retry button instead of an AI response.

## Checks

```bash
npm run build
npm run lint
```

For a production deployment, move the `/api/debate` handler from the Vite development middleware to your platform's serverless function or backend before exposing the app publicly.
