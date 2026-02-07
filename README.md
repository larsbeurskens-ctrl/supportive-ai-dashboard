# Supportive AI Dashboard

Business owner dashboard for Supportive AI - the AI receptionist platform for home services businesses.

## Features

- **Dashboard** — Top-line metrics (calls, bookings, revenue, sentiment)
- **Calls** — View all incoming calls with transcripts
- **Bookings** — Manage scheduled appointments
- **Customers** — Customer history and details
- **Settings** — Business configuration

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- Lucide React (icons)
- Recharts (charts)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

## API

Connects to the Supportive AI backend at:
- Production: `https://supportive-ai-backend-production.up.railway.app`

## Deployment

Deploy to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/larsbeurskens-ctrl/supportive-ai-dashboard)
