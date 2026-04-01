const express   = require('express');
const router    = express.Router();
const Complaint = require('../models/Complaint');
const { protect, authorityOnly } = require('../middleware/auth');
const twilio    = require('twilio');

// GET /api/authority/complaints  — all complaints
router.get('/complaints', protect, authorityOnly, async (req, res) => {
  try {
    const { status, city } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (city)   filter.city   = city;
    const complaints = await Complaint.find(filter)
      .populate('reporter', 'name email phone')
      .sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/authority/complaints/:id/status  — update status
router.patch('/complaints/:id/status', protect, authorityOnly, async (req, res) => {
  try {
    const { status, notes } = req.body;
    const complaint = await Complaint.findByIdAndUpdate(
      req.params.id,
      { status, notes, assignedTo: req.user._id },
      { new: true }
    ).populate('reporter', 'name email phone');

    if (!complaint) return res.status(404).json({ message: 'Not found' });

    // Notify via WhatsApp if complaint came from WhatsApp
    if (complaint.source === 'whatsapp' && complaint.reporterPhone) {
      try {
        const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
        const statusMsg = {
          assigned:    'has been assigned to a field team.',
          in_progress: 'is currently being handled by our team.',
          resolved:    'has been resolved. Thank you for reporting!',
        };
        await client.messages.create({
          from: process.env.TWILIO_WHATSAPP_FROM,
          to:   `whatsapp:${complaint.reporterPhone}`,
          body: `🐾 PawAlert Update\n\nYour complaint *${complaint.complaintId}* ${statusMsg[status] || 'has been updated.'}\n\nStatus: ${status.toUpperCase()}`,
        });
      } catch (e) {
        console.log('WhatsApp notify failed:', e.message);
      }
    }

    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/authority/stats
router.get('/stats', protect, authorityOnly, async (req, res) => {
  try {
    const [total, pending, assigned, in_progress, resolved] = await Promise.all([
      Complaint.countDocuments(),
      Complaint.countDocuments({ status: 'pending' }),
      Complaint.countDocuments({ status: 'assigned' }),
      Complaint.countDocuments({ status: 'in_progress' }),
      Complaint.countDocuments({ status: 'resolved' }),
    ]);
    res.json({ total, pending, assigned, in_progress, resolved });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
