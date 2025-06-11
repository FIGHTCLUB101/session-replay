// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const Session = require('../models/Session');

// // @route   GET /api/sessions
// // @desc    List sessions for current user's team
// router.get('/', auth, async (req, res) => {
//   try {
//     const sessions = await Session.find({ team: req.user.team }).
//       populate('user', 'name').
//       sort({ startTime: -1 }).
//       limit(100);
//     res.json(sessions);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // @route   GET /api/sessions/:sessionId
// // @desc    Get session metadata
// router.get('/:sessionId', auth, async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId).populate('user', 'name email');
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     if (session.team.toString() !== req.user.team.toString()) return res.status(403).json({ message: 'Forbidden' });
//     res.json(session);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // @route   POST /api/sessions/start
// // @desc    Create a new session entry
// router.post('/start', auth, async (req, res) => {
//   const { pageUrl, browserInfo } = req.body;
//   try {
//     const session = new Session({
//       team: req.user.team,
//       user: req.user._id,
//       pageUrl,
//       browserInfo,
//     });
//     console.log("start");
//     await session.save();
//     res.json({ sessionId: session._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // @route   POST /api/sessions/:sessionId/end
// // @desc    Mark session end time
// router.post('/:sessionId/end', auth, async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     if (session.team.toString() !== req.user.team.toString()) return res.status(403).json({ message: 'Forbidden' });
//     session.endTime = Date.now();
//     await session.save();
//     console.log("end");
//     res.json({ message: 'Session ended' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// module.exports = router;



//---------------------------------------------


// const express = require('express');
// const router = express.Router();
// const auth = require('../middleware/auth');
// const upload = require('../uploads/uploads');

// const Session = require('../models/Session');

// // GET /api/sessions - List sessions for current user's team
// router.get('/', auth, async (req, res) => {
//   try {
//     const sessions = await Session.find({ team: req.user.team })
//       .populate('user', 'name')
//       .sort({ startTime: -1 })
//       .limit(100);
//     res.json(sessions);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // GET /api/sessions/:sessionId - Get session metadata
// router.get('/:sessionId', auth, async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId)
//       .populate('user', 'name email');
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     if (session.team.toString() !== req.user.team.toString())
//       return res.status(403).json({ message: 'Forbidden' });
//     res.json(session);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // POST /api/sessions/start - Create a new session entry
// router.post('/start', auth, async (req, res) => {
//   const { pageUrl, browserInfo } = req.body;
//   try {
//     const session = new Session({
//       team: req.user.team,
//       user: req.user._id,
//       pageUrl,
//       browserInfo,
//     });
//     console.log('start');
//     await session.save();
//     res.json({ sessionId: session._id });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // POST /api/sessions/:sessionId/end - Mark session end time
// router.post('/:sessionId/end', auth, async (req, res) => {
//   try {
//     const session = await Session.findById(req.params.sessionId);
//     if (!session) return res.status(404).json({ message: 'Session not found' });
//     if (session.team.toString() !== req.user.team.toString())
//       return res.status(403).json({ message: 'Forbidden' });
//     session.endTime = Date.now();
//     await session.save();
//     console.log('end');
//     res.json({ message: 'Session ended' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Server error');
//   }
// });

// // POST /api/sessions/upload - Upload video and create session
// router.post('/uploads', upload.single('video'), async (req, res) => {
//   try {
//     const { teamId, userId, pageUrl, browserInfo } = req.body;

//     if (!req.file) {
//       return res.status(400).json({ message: 'No video file uploaded' });
//     }

//     const session = new Session({
//       team: teamId,
//       user: userId,
//       pageUrl,
//       browserInfo: JSON.parse(browserInfo),
//       videoPath: req.file.path,
//       startTime: new Date(),
//       endTime: new Date(),
//     });

//     const saved = await session.save();

//     res.status(200).json({ message: 'Session saved', session: saved });
//   } catch (err) {
//     console.error('[Multer Upload] Error:', err);
//     res.status(500).json({ message: 'Internal server error' });
//   }
// });

// module.exports = router;



//-------------------------------------------



const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const upload = require('../uploads/uploads');

const Session = require('../models/Session');

// GET /api/sessions - List sessions for current user's team
router.get('/', auth, async (req, res) => {
  try {
    const sessions = await Session.find({ team: req.user.team })
      .populate('user', 'name')
      .sort({ startTime: -1 })
      .limit(100);
    res.json(sessions);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/sessions/:sessionId - Get session metadata
router.get('/:sessionId', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId)
      .populate('user', 'name email');
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.team.toString() !== req.user.team.toString())
      return res.status(403).json({ message: 'Forbidden' });
    res.json(session);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/sessions/start - Create a new session entry
router.post('/start', auth, async (req, res) => {
  const { pageUrl, browserInfo } = req.body;
  try {
    const session = new Session({
      team: req.user.team,
      user: req.user._id,
      pageUrl,
      browserInfo,
    });
    console.log('start');
    await session.save();
    res.json({ sessionId: session._id });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/sessions/:sessionId/end - Mark session end time
router.post('/:sessionId/end', auth, async (req, res) => {
  try {
    const session = await Session.findById(req.params.sessionId);
    if (!session) return res.status(404).json({ message: 'Session not found' });
    if (session.team.toString() !== req.user.team.toString())
      return res.status(403).json({ message: 'Forbidden' });
    session.endTime = Date.now();
    await session.save();
    console.log('end');
    res.json({ message: 'Session ended' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/sessions/upload - Upload video and create session (with hardcoded team & user IDs)
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const { pageUrl, browserInfo } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'No video file uploaded' });
    }

    const session = new Session({
      team: '',
      user: '',
      pageUrl,
      browserInfo: JSON.parse(browserInfo),
      videoPath: req.file.path,
      startTime: new Date(),
      endTime: new Date(),
    });

    const saved = await session.save();

    res.status(200).json({ message: 'Session saved', session: saved });
  } catch (err) {
    console.error('[Multer Upload] Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
