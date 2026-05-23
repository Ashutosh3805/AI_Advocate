import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import CaseTerminal from './pages/CaseTerminal';

// Protect the terminal route from unauthenticated users
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/terminal" element={
          <ProtectedRoute>
            <CaseTerminal />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
