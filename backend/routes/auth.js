const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const User = require('../models/User');
const Team = require('../models/Team');

dotenv.config();

// @route   POST /api/auth/register
// @desc    Register new user and create team
router.post('/register', async (req, res) => {
  const { name, email, password, teamName } = req.body;
  try {
    // Check if user or team exists
    let existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    let team = new Team({ name: teamName || `${name}'s Team` });
    await team.save();
    let user = new User({ name, email, passwordHash: password, team: team._id, role: 'admin' });
    await user.save();
    team.createdBy = user._id;
    await team.save();
    // Sign JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;