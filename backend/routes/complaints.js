const express   = require('express');
const router    = express.Router();
const Complaint = require('../models/Complaint');
const { protect } = require('../middleware/auth');
const { upload }  = require('../middleware/upload');

// POST /api/complaints  — submit a complaint
router.post('/', protect, upload.single('photo'), async (req, res) => {
  try {
    const { type, description, lat, lng, address, city } = req.body;
    const complaint = await Complaint.create({
      type,
      description,
      photo: req.file?.path || '',
      location: { lat: parseFloat(lat), lng: parseFloat(lng), address },
      city,
      reporter: req.user._id,
      source: 'website',
    });
    res.status(201).json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints/track/:id  — track by complaint ID (public)
router.get('/track/:id', async (req, res) => {
  try {
    const complaint = await Complaint.findOne({ complaintId: req.params.id });
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json(complaint);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/complaints/mine  — logged-in user's complaints
router.get('/mine', protect, async (req, res) => {
  try {
    const complaints = await Complaint.find({ reporter: req.user._id }).sort({ createdAt: -1 });
    res.json(complaints);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
