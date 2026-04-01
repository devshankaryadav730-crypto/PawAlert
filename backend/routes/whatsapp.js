const express   = require('express');
const router    = express.Router();
const Complaint = require('../models/Complaint');

// In-memory session store (use Redis in production)
const sessions = {};

const MENU = `🐾 *Welcome to PawAlert*\nReport a stray animal emergency instantly.\n\nWhat would you like to report?\n1️⃣  Dead animal on road\n2️⃣  Injured animal\n3️⃣  Aggressive / dangerous animal\n4️⃣  Abandoned animal\n\nReply with a number (1-4)`;

const TYPES = { '1': 'dead', '2': 'injured', '3': 'aggressive', '4': 'abandoned' };
const TYPE_LABELS = { dead: '💀 Dead animal', injured: '🤕 Injured animal', aggressive: '⚠️ Aggressive animal', abandoned: '😔 Abandoned animal' };

// POST /api/whatsapp/webhook  — Twilio sends messages here
router.post('/webhook', async (req, res) => {
  const from    = req.body.From?.replace('whatsapp:', '');
  const body    = req.body.Body?.trim();
  const numMedia = parseInt(req.body.NumMedia || 0);
  const mediaUrl = numMedia > 0 ? req.body.MediaUrl0 : null;
  const lat     = req.body.Latitude;
  const lng     = req.body.Longitude;

  if (!from) return res.sendStatus(400);

  let session = sessions[from] || { step: 'menu' };
  let reply   = '';

  if (!body && !lat) {
    reply = MENU;
    session = { step: 'menu' };
  } else if (session.step === 'menu' || body?.toLowerCase() === 'hi' || body?.toLowerCase() === 'hello' || body?.toLowerCase() === 'start') {
    if (TYPES[body]) {
      session.type = TYPES[body];
      session.step = 'location';
      reply = `Got it — *${TYPE_LABELS[session.type]}*\n\nNow please share your *live location* 📍\n\nTap the attachment icon → Location → Send Current Location`;
    } else {
      reply = MENU;
      session.step = 'menu';
    }
  } else if (session.step === 'location') {
    if (lat && lng) {
      session.lat  = lat;
      session.lng  = lng;
      session.step = 'photo';
      reply = `📍 Location received!\n\nCan you send a *photo* of the animal? (Optional)\n\nSend a photo OR reply *skip* to continue without one.`;
    } else {
      reply = `Please share your *live location* 📍\n\nTap the attachment icon → Location → Send Current Location`;
    }
  } else if (session.step === 'photo') {
    if (mediaUrl) {
      session.photo = mediaUrl;
    }
    if (mediaUrl || body?.toLowerCase() === 'skip') {
      session.step = 'confirm';
      reply = `Almost done! Any additional details?\n\n(Describe what you see, or reply *done* to submit now)`;
    } else {
      reply = `Please send a photo OR reply *skip* to continue.`;
    }
  } else if (session.step === 'confirm') {
    const description = body?.toLowerCase() === 'done' ? '' : body;
    try {
      const complaint = await Complaint.create({
        type:          session.type,
        description:   description || '',
        photo:         session.photo || '',
        location:      { lat: parseFloat(session.lat), lng: parseFloat(session.lng), address: '' },
        source:        'whatsapp',
        reporterPhone: from,
        status:        'pending',
      });
      reply = `✅ *Complaint Registered!*\n\n📋 Complaint ID: *${complaint.complaintId}*\n🐾 Type: ${TYPE_LABELS[session.type]}\n📍 Location: Received\n\nAuthorities have been notified. You will receive an update when action is taken.\n\nThank you for helping! 🙏\n\n_Reply_ *hi* _to report another._`;
      delete sessions[from];
    } catch (err) {
      reply = `Sorry, something went wrong. Please try again.\n\n${MENU}`;
      delete sessions[from];
    }
  } else {
    reply = MENU;
    session = { step: 'menu' };
  }

  sessions[from] = session;

  // Respond in TwiML format
  res.set('Content-Type', 'text/xml');
  res.send(`<?xml version="1.0" encoding="UTF-8"?><Response><Message>${reply}</Message></Response>`);
});

module.exports = router;
