import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import rrwebPlayer from 'rrweb-player';
import 'rrweb-player/dist/style.css';
import api from '../api';

export default function SessionPlayer() {
  const { sessionId } = useParams();
  const playerRef = useRef(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get(`/sessions/${sessionId}/events`);
        setEvents(res.data.map((e) => ({
          timestamp: e.timestamp,
          data: e.data,
          type: e.type,
        })));
        setLoading(false);
      } catch (err) {
        console.error(err);
      }
    };
    fetchEvents();
  }, [sessionId]);

  useEffect(() => {
    if (!loading && events.length > 0) {
      new rrwebPlayer({
        target: playerRef.current,
        props: {
          events,
        },
      });
    }
  }, [loading]);

  return (
    <div>
      <h2>Playback Session</h2>
      {loading ? <p>Loading events...</p> : <div ref={playerRef} style={{ width: '100%' }}></div>}
    </div>
  );
}