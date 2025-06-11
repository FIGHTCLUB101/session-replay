import React, { useEffect, useRef, useState } from 'react';
import * as rrweb from 'rrweb';
import api from '../api';

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const sessionIdRef = useRef(null);
  const eventsBufferRef = useRef([]);
  const flushInterval = 5000; // Flush every 5 seconds

  useEffect(() => {
    const startSession = async () => {
      try {
        // Create session metadata on the server
        const browserInfo = { userAgent: navigator.userAgent, language: navigator.language };
        const pageUrl = window.location.href;
        const res = await api.post('/sessions/start', { pageUrl, browserInfo });
        sessionIdRef.current = res.data.sessionId;
        setRecording(true);

        // Start rrweb recording
        rrweb.record({
          emit(event) {
            // Store raw rrweb events directly
            eventsBufferRef.current.push(event);
          },
          maskAllInputs: true,
          recordCanvas: true, // optional: if your site uses canvas
          inlineStylesheet: true, // better for replay consistency
        });
      } catch (err) {
        console.error('Failed to start session:', err);
      }
    };

    startSession();

    // Periodically flush events to the server
    const intervalId = setInterval(async () => {
      if (!recording || eventsBufferRef.current.length === 0) return;
      const toSend = eventsBufferRef.current.splice(0);
      try {
        await api.post(`/sessions/${sessionIdRef.current}/events`, { events: toSend });
      } catch (err) {
        console.error('Failed to send events', err);
      }
    }, flushInterval);

    // On unmount or page close
    return () => {
      clearInterval(intervalId);
      const finalize = async () => {
        if (eventsBufferRef.current.length > 0) {
          try {
            await api.post(`/sessions/${sessionIdRef.current}/events`, {
              events: eventsBufferRef.current,
            });
          } catch (err) {
            console.error('Failed to send final events', err);
          }
        }
        await api.post(`/sessions/${sessionIdRef.current}/end`);
      };
      finalize();
    };
  }, []);

  return (
    <div>
      <h2>Recording Session</h2>
      <p>Session ID: {sessionIdRef.current}</p>
      <p>Do not close this page during recording.</p>
    </div>
  );
}
