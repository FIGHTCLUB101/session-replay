import React, { useEffect, useRef, useState } from 'react';
import rrweb from 'rrweb';
import api from '../api';

export default function Recorder() {
  const [recording, setRecording] = useState(false);
  const sessionIdRef = useRef(null);
  const seqRef = useRef(0);
  const eventsBufferRef = useRef([]);
  const flushInterval = 5000; // Flush events every 5 seconds

  useEffect(() => {
    const startSession = async () => {
      // Create session metadata on server
      const browserInfo = { userAgent: navigator.userAgent, language: navigator.language };
      const pageUrl = window.location.href;
      const res = await api.post('/sessions/start', { pageUrl, browserInfo });
      sessionIdRef.current = res.data.sessionId;
      setRecording(true);
      
      // Initialize rrweb recording
      rrweb.record({
        emit(event) {
          const evt = {
            seq: seqRef.current++,
            timestamp: event.timestamp,
            type: event.type,
            data: event,
          };
          eventsBufferRef.current.push(evt);
        },
        // Mask all inputs by default
        maskAllInputs: true,
      });
    };
    startSession();

    // Periodically flush events to server
    const intervalId = setInterval(async () => {
      if (!recording || eventsBufferRef.current.length === 0) return;
      const toSend = eventsBufferRef.current.splice(0, eventsBufferRef.current.length);
      try {
        await api.post(`/sessions/${sessionIdRef.current}/events`, { events: toSend });
      } catch (err) {
        console.error('Failed to send events', err);
      }
    }, flushInterval);

    // On unmount, send remaining events and end session
    return () => {
      clearInterval(intervalId);
      const finalize = async () => {
        if (eventsBufferRef.current.length > 0) {
          try {
            await api.post(`/sessions/${sessionIdRef.current}/events`, { events: eventsBufferRef.current });
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
      <p>If you close this page, recording will stop.</p>
    </div>
  );
}