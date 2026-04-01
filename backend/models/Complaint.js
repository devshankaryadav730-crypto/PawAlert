const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const complaintSchema = new mongoose.Schema({
  complaintId: {
    type: String,
    default: () => 'PA-' + uuidv4().slice(0, 6).toUpperCase(),
    unique: true,
  },
  type: {
    type: String,
    enum: ['dead', 'injured', 'aggressive', 'abandoned'],
    required: true,
  },
  description: { type: String, default: '' },
  photo:        { type: String, default: '' },   // Cloudinary URL
  location: {
    lat:     { type: Number, required: true },
    lng:     { type: Number, required: true },
    address: { type: String, default: '' },
  },
  city:   { type: String, default: '' },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'in_progress', 'resolved'],
    default: 'pending',
  },
  source:   { type: String, enum: ['website', 'whatsapp'], default: 'website' },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  reporterPhone: { type: String, default: '' }, // for WhatsApp reporters
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  notes:  { type: String, default: '' },
}, { timestamps: true });

module.exports = mongoose.model('Complaint', complaintSchema);
