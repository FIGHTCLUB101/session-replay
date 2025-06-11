import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './auth/Login';
import Register from './auth/Register';
import SessionList from './components/SessionList';
import SessionPlayer from './components/SessionPlayer';
import Recorder from './components/Recorder';
import PrivateRoute from './auth/PrivateRoute';
import Test from './components/Test';
function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Routes */}
      <Route
        path="/"
        element={
          <PrivateRoute>
            <Test />
          </PrivateRoute>
        }
      />
      <Route
        path="/session"
        element={
          <PrivateRoute>
            <SessionList />
          </PrivateRoute>
        }
      />
      <Route
        path="/record"
        element={
          <PrivateRoute>
            <Recorder />
          </PrivateRoute>
        }
      />
      <Route
        path="/sessions/:sessionId"
        element={
          <PrivateRoute>
            <SessionPlayer />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;