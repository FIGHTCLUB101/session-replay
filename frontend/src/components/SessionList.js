import React, { useEffect, useState } from 'react';
import api from '../api';
import { Link } from 'react-router-dom';

export default function SessionList() {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const res = await api.get('/sessions');
        setSessions(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchSessions();
  }, []);

  return (
    <div>
      <h2>Sessions</h2>
      <Link to="/record"><button>Start New Recording</button></Link>
      <ul>
        {sessions.map((sess) => (
          <li key={sess._id}>
            <Link to={`/sessions/${sess._id}`}>
              {new Date(sess.startTime).toLocaleString()} - {sess.user.name} - {sess.pageUrl}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}