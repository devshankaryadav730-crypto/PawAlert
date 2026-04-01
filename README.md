# 🐾 PawAlert — Setup Guide

## Project Structure
```
pawalert/
├── frontend/   ← React app (port 3000)
└── backend/    ← Node.js API (port 5000)


### MongoDB Atlas (Database)

### Cloudinary (Photo Storage)

### Twilio (WhatsApp Bot)

### Backend → Render


## Features Built

-  User register & login (JWT)
-  Submit complaint with GPS + photo upload (Cloudinary)
-  Unique complaint ID generated automatically
-  Track complaint by ID (public, no login needed)
-  User dashboard (see all your reports)
-  Authority dashboard with status updates + filters + stats
-  WhatsApp bot (full flow: menu → type → location → photo → confirmation)
-  WhatsApp notification when authority updates status
-  Mobile responsive UI

---

## Tech Stack

| Layer | Tech |
| Frontend | React 18, React Router v6 |
| Styling | Custom CSS Design System |
| Backend | Node.js, Express |
| Database | MongoDB + Mongoose |
| Auth | JWT |
| Photos | Cloudinary + Multer |
| WhatsApp | Twilio WhatsApp API |
| Hosting | Vercel (frontend) + Render (backend) |
