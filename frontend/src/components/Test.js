import React, { useEffect } from 'react';

const Test = () => {
  useEffect(() => {
    // Load SDK script dynamically
    const sdkScript = document.createElement('script');
    sdkScript.src = 'http://localhost:5000/sdk.js';
    sdkScript.async = true;
    document.body.appendChild(sdkScript);

    const html2canvasScript = document.createElement('script');
    html2canvasScript.src = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
    html2canvasScript.async = true;
    document.body.appendChild(html2canvasScript);
  }, []);

  const handleAutoRecord = () => {
    if (!window.SessionReplaySDK) {
      alert('⚠️ SDK not loaded yet!');
      return;
    }

    console.log('Recording started...');
    window.SessionReplaySDK.startRecording();

    setTimeout(async () => {
      console.log('Stopping recording...');
      const result = await window.SessionReplaySDK.stopRecording();

      if (!result || !Array.isArray(result.frames)) {
        alert('❌ No frames captured.');
        return;
      }

      // Send frames to backend
      fetch('http://localhost:5000/uploadFrames', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ frames: result.frames }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log('Upload successful:', data);
          alert(`✅ Video saved at: ${data.videoPath}`);
        })
        .catch((err) => {
          console.error('Upload failed:', err);
          alert('❌ Failed to upload frames.');
        });
    }, 20000);
  };

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>SDK Test</h1>

      {/* 🧾 Form */}
      <form id="userForm">
        <div>
          <label htmlFor="name">Name:</label><br />
          <input type="text" id="name" name="name" />
        </div>
        <br />
        <div>
          <label htmlFor="age">Age:</label><br />
          <input type="number" id="age" name="age" />
        </div>
        <br />
        <div>
          <label htmlFor="email">Email:</label><br />
          <input type="email" id="email" name="email" />
        </div>
      </form>

      {/* 🎬 Recording Controls */}
      <div style={{ marginTop: '2rem' }}>
        <button onClick={handleAutoRecord}>Start & Auto Stop (20s)</button>{' '}
        <button onClick={() => window.SessionReplaySDK?.startRecording()}>Start</button>{' '}
        <button onClick={() => window.SessionReplaySDK?.stopRecording()}>Stop</button>
      </div>
    </div>
  );
};

export default Test;
