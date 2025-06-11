
// (function (global) {
//   const SessionReplaySDK = (() => {
//     let frames = [];
//     let intervalId = null;
//     const captureInterval = 1000; // 1 frame per second

//     // Capture the current DOM state as an image
//     const captureFrame = () => {
//       html2canvas(document.body).then((canvas) => {
//         const dataURL = canvas.toDataURL('image/png');
//         frames.push(dataURL); // Store only the base64 image
//       }).catch((err) => {
//         console.error('[SDK] html2canvas failed:', err);
//       });
//     };

//     return {
//       startRecording: () => {
//         console.log('[SDK] Starting recording...');
//         frames = [];
//         intervalId = setInterval(captureFrame, captureInterval);
//       },

//       stopRecording: () => {
//         console.log('[SDK] Stopping recording...');
//         clearInterval(intervalId);

//         if (frames.length === 0) {
//           alert('No frames captured.');
//           return;
//         }

//         // Convert base64 images into expected format for backend
//         const payload = {
//           frames: frames.map(dataURL => ({ dataURL, timestamp: Date.now() }))
//         };

//         // Upload to backend
//         fetch('http://localhost:5000/uploadFrames', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         })
//           .then((res) => res.json())
//           .then((data) => {
//             alert(data.message || 'Upload complete!');
//             console.log('[SDK] Video saved at:', data.videoPath);
//           })
//           .catch((err) => {
//             alert('Upload failed.');
//             console.error('[SDK] Upload error:', err);
//           });
//       },
//     };
//   })();

//   // Expose globally
//   global.SessionReplaySDK = SessionReplaySDK;
// })(window);

(function (global) {
  const SessionReplaySDK = (() => {
    let frames = [];
    let intervalId = null;
    const captureInterval = 1000; // 1 frame per second

    const captureFrame = () => {
      html2canvas(document.body).then((canvas) => {
        const dataURL = canvas.toDataURL('image/png');
        frames.push(dataURL);
      }).catch((err) => {
        console.error('[SDK] html2canvas failed:', err);
      });
    };

    const convertFramesToVideoBlob = async (frames) => {
      
      const dummyBlob = new Blob(['dummy video content'], { type: 'video/mp4' });
      return dummyBlob;
    };

    return {
      startRecording: () => {
        console.log('[SDK] Starting recording...');
        frames = [];
        intervalId = setInterval(captureFrame, captureInterval);
      },

      stopRecording: async () => {
        console.log('[SDK] Stopping recording...');
        clearInterval(intervalId);

        if (frames.length === 0) {
          alert('No frames captured.');
          return;
        }

        try {
          const videoBlob = await convertFramesToVideoBlob(frames);

          const formData = new FormData();
          formData.append('video', videoBlob, 'recording.mp4');
          formData.append('teamId', '68471170b6ba427c56f76195'); // Replace with actual value
          formData.append('userId', '68471170b6ba427c56f76197'); // Replace with actual value
          formData.append('pageUrl', window.location.href);
          formData.append('browserInfo', JSON.stringify({
            userAgent: navigator.userAgent,
            language: navigator.language,
          }));

          fetch('http://localhost:5000/api/sessions/upload', {
            method: 'POST',
            body: formData,
          })
            .then(res => res.json())
            .then(data => {
              alert(`✅ Session saved. Video at: ${data.session.videoPath}`);
              console.log('[SDK] Video uploaded:', data.session.videoPath);
            })
            .catch(err => {
              console.error('[SDK] Upload failed:', err);
              alert('❌ Upload failed');
            });
        } catch (err) {
          console.error('[SDK] Failed to encode video:', err);
          alert('❌ Failed to create video');
        }
      },
    };
  })();

  global.SessionReplaySDK = SessionReplaySDK;
})(window);
