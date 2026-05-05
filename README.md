# AI Crypto Advisor

A fullstack personalized crypto investor dashboard. Users sign up, complete a short onboarding quiz, and receive a daily dashboard tailored to their selected assets, investor type, and content preferences.

---

## Live Demo

- **Frontend (Vercel):** https://moveo-ai-crypto-advisor-ten.vercel.app
- **Backend API (Railway):** https://moveo-ai-crypto-advisor-production.up.railway.app
- **Health Check:** https://moveo-ai-crypto-advisor-production.up.railway.app/api/health

The frontend is deployed on Vercel and the backend API is deployed on Railway. The backend uses SQLite for simplicity — note that the database is non-persistent between Railway redeploys, so data may reset.

---

## Features

- **Authentication** — Signup and login with JWT. Passwords hashed with bcrypt.
- **Onboarding quiz** — Shown only on first login. Captures assets of interest, investor type, and content preferences. Saved to the database.
- **Personalized dashboard** — Four sections, all always visible:
  - **Market News** — Headlines relevant to selected assets, filtered by content preference
  - **Coin Prices** — Live prices from CoinGecko for selected assets only
  - **AI Insight of the Day** — Short personalized insight via OpenRouter, influenced by investor type and content preferences
  - **Fun Crypto Meme** — A meme matched to selected assets
- **Thumbs up / down voting** — Each dashboard item can be voted on. Feedback stored in the database per user.
- **Graceful fallbacks** — All external APIs (CoinGecko, OpenRouter, CryptoPanic) have static fallbacks. The app works fully without any optional API key.

---

## Tech Stack

| Layer      | Technology                          |
|------------|--------------------------------------|
| Frontend   | React + Vite                         |
| Backend    | Node.js + Express                    |
| Database   | SQLite + Prisma ORM                  |
| Auth       | JWT + bcrypt                         |
| Prices     | CoinGecko free API                   |
| AI Insight | OpenRouter (free tier, optional)     |
| News       | CryptoPanic (free tier, optional)    |

---

## Project Structure

```
├── client/        # React + Vite frontend
├── server/        # Node.js + Express backend
├── .gitignore
└── README.md
```

**`client/`** contains all frontend pages (Login, Signup, Onboarding, Dashboard), API helpers, and styles.

**`server/`** contains Express routes, controllers, Prisma schema, services for each external API, and the SQLite database.

---

## Environment Variables

Create a `server/.env` file based on `server/.env.example`. This file must not be committed.

```env
PORT=3000
JWT_SECRET=your_jwt_secret_here
DATABASE_URL="file:./dev.db"
OPENROUTER_API_KEY=your_openrouter_api_key_here
CRYPTOPANIC_API_KEY=your_cryptopanic_api_key_here
```

`OPENROUTER_API_KEY` and `CRYPTOPANIC_API_KEY` are **optional**. If not provided, the app uses static fallback data for AI insights and news headlines.

---

## Running Locally

### Backend

```bash
cd server
npm install
npx prisma migrate dev
npm run dev
```

Runs on `http://localhost:3000`

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`

Open `http://localhost:5173` in your browser.

---

## API Endpoints

| Method | Endpoint            | Auth     | Description                                      |
|--------|---------------------|----------|--------------------------------------------------|
| POST   | `/api/auth/signup`  | None     | Create a new account. Returns JWT + user.        |
| POST   | `/api/auth/login`   | None     | Log in. Returns JWT + user with onboarding flag. |
| GET    | `/api/auth/me`      | Required | Returns current user from token.                 |
| POST   | `/api/onboarding`   | Required | Save user preferences. Sets onboarding complete. |
| GET    | `/api/dashboard`    | Required | Returns personalized dashboard data.             |
| POST   | `/api/votes`        | Required | Submit thumbs up/down for a dashboard item.      |

---

## Personalization Logic

The dashboard is personalized using the preferences saved during onboarding:

- **Assets** (e.g. BTC, ETH, SOL) — filter coin prices, news headlines, AI insight coins, and meme selection
- **Investor type** (long-term, short-term, balanced) — influences the tone and strategy focus of the AI insight
- **Content preferences** (Market News, Charts, Social, Fun) — shift the focus of news headlines and the AI insight accordingly

All four dashboard sections are always displayed regardless of content preferences. Preferences influence content and wording, not visibility.

---

## Notes on AI Tools

AI tools were used to support planning, code review, and debugging during development. All implementation decisions were reviewed and validated manually to ensure correctness and alignment with the assignment requirements.
