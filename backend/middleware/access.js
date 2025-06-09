const Session = require('../models/Session');

// Ensure user belongs to the same team as the session
module.exports = async function (req, res, next) {
  const sessionId = req.params.sessionId || req.body.sessionId;
  if (!sessionId) return res.status(400).json({ message: 'Session ID missing' });
  const session = await Session.findById(sessionId);
  if (!session) return res.status(404).json({ message: 'Session not found' });
  if (session.team.toString() !== req.user.team.toString()) {
    return res.status(403).json({ message: 'Access denied' });
  }
  req.sessionObj = session;
  next();
};