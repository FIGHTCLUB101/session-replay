
const Session = require('./models/Session');

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

const connectDB = require('./config/db');

dotenv.config();
connectDB();

const app = express();

app.use(cors());

// Increase JSON body limit to accept large base64-encoded images
app.use(bodyParser.json({ limit: '200mb' }));

// Serve static files (e.g., sdk.js) from the "public" folder
app.use(express.static(path.join(__dirname, 'public')));



// Authentication, Teams, Sessions, Events routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/sessions', require('./routes/sessions'));
app.use('/api/sessions', require('./routes/events')); // Nested route for session events
app.post('/uploadFrames', async (req, res) => {
  try {
    const { frames } = req.body;
    if (!Array.isArray(frames)) {
      return res.status(400).json({ message: 'Invalid payload: "frames" must be an array.' });
    }

    // Create a unique timestamp‐named directory
    const timestamp = Date.now();
    const tempDir = path.join(__dirname, `recording_${timestamp}`);
    fs.mkdirSync(tempDir);

    // Write each base64 frame to a PNG file
    for (let i = 0; i < frames.length; i++) {
      const { dataURL } = frames[i];
      if (!dataURL.startsWith('data:image/png;base64,')) {
        // Skip invalid frame entries
        continue;
      }
      const base64Data = dataURL.replace(/^data:image\/png;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const filename = path.join(tempDir, `frame_${String(i).padStart(5, '0')}.png`);
      fs.writeFileSync(filename, buffer);
    }

    const outputVideoPath = path.join(__dirname, `replay_${timestamp}.mp4`);
    const inputPath = path.join(tempDir, 'frame_%05d.png');
    const ffmpegCmd = `ffmpeg -y -framerate 1 -i "${inputPath}" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`;


    exec(ffmpegCmd, (error, stdout, stderr) => {
      if (error) {
        console.error('[Server] FFmpeg error:', stderr);
        // Cleanup tempDir on failure
        fs.rmSync(tempDir, { recursive: true, force: true });
        return res.status(500).json({ message: 'Failed to compile video.' });
      }

      // Success: delete temporary frames folder
      fs.rmSync(tempDir, { recursive: true, force: true });
      console.log(`[Server] Video compiled to ${outputVideoPath}`);
      return res.json({
        message: 'Video compiled successfully.',
        videoPath: outputVideoPath,
      });
    });
  } catch (err) {
    console.error('[Server] Error in /uploadFrames:', err);
    return res.status(500).json({ message: 'Internal server error.' });
  }
});
app.get('/', (req, res) => {
  res.send('Session Replay API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));



// const express = require('express');
// const cors = require('cors');
// const bodyParser = require('body-parser');
// const dotenv = require('dotenv');
// const app = express();
// // const path = require('path');
// // const fs = require('fs');
// // const { exec } = require('child_process');
// const fs = require('fs');
// const path = require('path');
// const { exec } = require('child_process');

// app.use(cors());
// app.use(bodyParser.json({ limit: '50mb' })); // for base64 image payloads
// app.use(bodyParser.urlencoded({ extended: true }));

// app.post('/uploadFrames', async (req, res) => {
//   const { frames } = req.body;
//   if (!frames || !Array.isArray(frames) || frames.length === 0) {
//     return res.status(400).json({ message: 'No frames received' });
//   }

//   const timestamp = Date.now();
//   const folderPath = path.join(__dirname, `frames-${timestamp}`);

//   fs.mkdirSync(folderPath, { recursive: true });

//   // Save each base64 frame as a PNG file
//   frames.forEach((frame, index) => {
//     const base64Data = frame.dataURL.replace(/^data:image\/png;base64,/, '');
//     const filePath = path.join(folderPath, `frame_${String(index).padStart(4, '0')}.png`);
//     fs.writeFileSync(filePath, base64Data, 'base64');
//   });

//   // Output video path
//   const outputVideoPath = path.join(__dirname, `video-${timestamp}.mp4`);

//   // Use FFmpeg to compile video from images
//   const ffmpegCmd = `ffmpeg -y -framerate 1 -i "${folderPath}/frame_%04d.png" -c:v libx264 -pix_fmt yuv420p "${outputVideoPath}"`;

//   exec(ffmpegCmd, (error, stdout, stderr) => {
//     if (error) {
//       console.error('[Server] FFmpeg error:', stderr);
//       return res.status(500).json({ message: 'Failed to compile video.' });
//     }

//     console.log('[Server] Video successfully created:', outputVideoPath);
//     res.json({ message: 'Video created.', videoPath: outputVideoPath });
//   });
// });
