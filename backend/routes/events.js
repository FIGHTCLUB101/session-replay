const express = require('express');
const router = express.Router({ mergeParams: true });
const auth = require('../middleware/auth');
const access = require('../middleware/access');
const Event = require('../models/Event');
const Session = require('../models/Session');
const maskEventData = require('../utils/mask');

// @route   POST /api/sessions/:sessionId/events
// @desc    Ingest session events (batch)
router.post('/:sessionId/events', auth, access, async (req, res) => {
  const { events } = req.body; // expects [{seq, timestamp, type, data}, ...]
  if (!Array.isArray(events)) return res.status(400).json({ message: 'Invalid events format' });
  try {
    // Mask data fields if needed
    const toInsert = events.map((evt) => ({
      session: req.params.sessionId,
      seq: evt.seq,
      timestamp: evt.timestamp,
      type: evt.type,
      data: maskEventData(evt.data),
    }));
    await Event.insertMany(toInsert);
    res.json({ message: 'Events stored' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/sessions/:sessionId/events
// @desc    Get all events for a session (ordered)
router.get('/:sessionId/events', auth, access, async (req, res) => {
  try {
    const events = await Event.find({ session: req.params.sessionId }).sort({ seq: 1 });
    res.json(events.map(({ seq, timestamp, type, data }) => ({ seq, timestamp, type, data })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;