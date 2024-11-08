import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PassDashboard from './pages/PassDashboard';
import FaceVerification from './pages/faceVerification';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PassDashboard />} />
          <Route path="/face-verification" element={<FaceVerification />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;