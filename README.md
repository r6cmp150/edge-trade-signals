# EDGE Trade Signals

A personal mobile-first trading signals web app for identifying short-term opportunities in stocks priced $1–$20.

## Setup

1. **Fork** this repo to your GitHub account
2. Go to **Settings → Pages → Source: main branch → Save**
3. Your app URL: `https://{your-username}.github.io/edge-trade-signals`
4. Get free Alpaca API keys at [alpaca.markets](https://alpaca.markets) → API Keys section
5. Get free Gemini API key at [aistudio.google.com](https://aistudio.google.com) → API Keys section
6. Open app URL → **Settings tab** → paste both keys → tap **Test Connections**
7. Go to **Signals tab** → tap **Refresh** → first scan runs

## iPhone Install

1. Open the app URL in Safari
2. Tap **Share** → **Add to Home Screen**
3. App opens full-screen like a native app

## Features

- **Signals** — live screener with BUY/WATCH ratings, trade duration badges, RSI/ATR scoring
- **Watchlist** — monitor stocks before buying
- **Portfolio** — track positions with live P&L and sell warnings
- **Sold** — complete trade history with "what if held?" analysis
- **News** — live headlines filtered to your screener stocks
- **Settings** — API keys, budget, screener preferences

## Data Sources (Free Tier)

- [Alpaca Markets](https://alpaca.markets) — real-time quotes, historical OHLCV, news
- [Google Gemini](https://aistudio.google.com) — AI trade analysis (15 req/min free tier)

## Notes

- No backend required — all data stored in your browser's localStorage
- Does not place trades automatically
- Does not connect to Robinhood
- App version: v1.0.0
