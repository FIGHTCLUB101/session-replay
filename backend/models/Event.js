const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'Session', required: true },
  seq: { type: Number, required: true },
  timestamp: { type: Number, required: true },
  type: { type: String, required: true },
  data: { type: Object, required: true },
});

// Create a compound index for efficient retrieval by session & ordered seq
eventSchema.index({ session: 1, seq: 1 });

module.exports = mongoose.model('Event', eventSchema);