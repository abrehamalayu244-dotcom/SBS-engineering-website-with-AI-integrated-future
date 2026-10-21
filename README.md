# SBS Engineering Consultancy Website

## Run locally
1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env`
3. Enter your Gemini API key and Gmail App Password in `.env`
4. Start: `npm start`
5. Open the site at `http://localhost:3000`

## Production
Set the same environment variables in your hosting provider's secret/environment settings. Do not upload your real `.env` file to a public repository.

The frontend now uses the same website origin in production, so `/api/chat` and `/api/contact` work after deployment without editing the frontend URL.

### Gmail
Use a Google **App Password**, not your normal Gmail password. The Gmail account must have 2-Step Verification enabled before creating an App Password.

### AI
Set `GEMINI_API_KEY` and optionally change `GEMINI_MODEL` if your account supports another Gemini model. The default is `gemini-2.5-flash`.
