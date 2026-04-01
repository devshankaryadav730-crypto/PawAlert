# 🐾 PawAlert — Setup Guide

## Project Structure
```
pawalert/
├── frontend/   ← React app (port 3000)
└── backend/    ← Node.js API (port 5000)
```

---

## Step 1 — Get Your Free Accounts (15 min)

### MongoDB Atlas (Database)
1. Go to https://cloud.mongodb.com → Sign up free
2. Create a cluster (free M0 tier)
3. Click "Connect" → "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://...`)

### Cloudinary (Photo Storage)
1. Go to https://cloudinary.com → Sign up free
2. Dashboard → copy Cloud Name, API Key, API Secret

### Twilio (WhatsApp Bot)
1. Go to https://www.twilio.com → Sign up free
2. Go to Messaging → Try it → WhatsApp Sandbox
3. Copy Account SID and Auth Token
4. Note the sandbox number: `+14155238886`
5. Follow the sandbox join instructions (send a WhatsApp message to activate)

---

## Step 2 — Backend Setup

```bash
cd pawalert/backend

# Install dependencies
npm install

# Create your .env file
cp .env.example .env
```

Now open `.env` and fill in all values:
```
MONGO_URI=mongodb+srv://youruser:yourpass@cluster0.mongodb.net/pawalert
JWT_SECRET=any_long_random_string_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_WHATSAPP_FROM=whatsapp:+14155238886
PORT=5000
CLIENT_URL=http://localhost:3000
```

Start the backend:
```bash
npm run dev
# → Server running on port 5000
# → MongoDB connected
```

---

## Step 3 — Frontend Setup

```bash
cd pawalert/frontend

# Install dependencies
npm install

# Start the app
npm start
# → Opens at http://localhost:3000
```

---

## Step 4 — Create an Authority Account

The authority dashboard is for municipal officers. To create an authority account:

1. Register normally at `/register`
2. Open MongoDB Atlas → Browse Collections → users
3. Find your user → Edit → change `role` from `"user"` to `"authority"`
4. Save → Login again → you'll be redirected to `/authority`

---

## Step 5 — Connect WhatsApp Bot

1. In Twilio Console → Messaging → Sandbox Settings
2. Set "When a message comes in" webhook to:
   ```
   https://your-backend-url.com/api/whatsapp/webhook
   ```
3. For local testing, use **ngrok**:
   ```bash
   npx ngrok http 5000
   # Copy the https URL → paste in Twilio webhook
   ```
4. Now WhatsApp anyone who messages the sandbox number will go through your bot!

---

## How to Deploy (Free)

### Frontend → Vercel
```bash
cd frontend
npm run build
# Upload to vercel.com or use Vercel CLI:
npx vercel
```

### Backend → Render
1. Push code to GitHub
2. Go to render.com → New Web Service → connect repo
3. Set Root Directory: `backend`
4. Build command: `npm install`
5. Start command: `node server.js`
6. Add all environment variables

---

## API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /api/auth/register | — | Register user |
| POST | /api/auth/login | — | Login |
| GET | /api/auth/me | JWT | Get current user |
| POST | /api/complaints | JWT | Submit complaint |
| GET | /api/complaints/mine | JWT | My complaints |
| GET | /api/complaints/track/:id | — | Track by ID (public) |
| GET | /api/authority/complaints | Authority | All complaints |
| PATCH | /api/authority/complaints/:id/status | Authority | Update status |
| GET | /api/authority/stats | Authority | Dashboard stats |
| POST | /api/whatsapp/webhook | — | Twilio webhook |

---

## Features Built

- ✅ User register & login (JWT)
- ✅ Submit complaint with GPS + photo upload (Cloudinary)
- ✅ Unique complaint ID generated automatically
- ✅ Track complaint by ID (public, no login needed)
- ✅ User dashboard (see all your reports)
- ✅ Authority dashboard with status updates + filters + stats
- ✅ WhatsApp bot (full flow: menu → type → location → photo → confirmation)
- ✅ WhatsApp notification when authority updates status
- ✅ Mobile responsive UI

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS Design System |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Photos | Cloudinary + Multer |
| WhatsApp | Twilio WhatsApp API |
| Hosting | Vercel (frontend) + Render (backend) |
