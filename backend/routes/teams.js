const express = require('express');
const router = express.Router();
const Team = require('../models/Team');
const User = require('../models/User');
const auth = require('../middleware/auth');

// @route   GET /api/teams/me
// @desc    Get current user's team info
router.get('/me', auth, async (req, res) => {
  try {
    const team = await Team.findById(req.user.team).populate('createdBy', 'name email');
    res.json(team);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/teams/invite
// @desc    Invite a user to the team (simplified: create user directly)
router.post('/invite', auth, async (req, res) => {
  const { email, name, role } = req.body;
  try {
    // Only admins can invite
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    // In real scenario, send email invite; here, directly create user with a temp password
    const tempPassword = Math.random().toString(36).slice(-8);
    let user = new User({ name, email, passwordHash: tempPassword, team: req.user.team, role: role || 'member' });
    await user.save();
    // TODO: send invite email with reset link
    res.json({ message: 'User invited. Temporary password: ' + tempPassword });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;