import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Login from './pages/Login';
import PassDashboard from './pages/PassDashboard';
import FaceVerification from './pages/FaceVerification';
import AdminDashboard from './pages/AdminDashboard';
import Signup from './pages/Signup';
import Profile from './pages/Profile'; // Import the Profile page
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicRoute from './components/PublicRoute';
import { GET_USER_INFO, HOST } from './utils/constants';

function App() {
  // const navigate = useNavigate();

  useEffect(() => {
    // Function to check if the user is logged in and fetch user data
    const checkAuth = async () => {
      const token = localStorage.getItem('token'); // Get token from localStorage

      if (token) {
        try {
          // Make a GET request to fetch user info, passing the token in the Authorization header
          const response = await axios.get(`${HOST}/${GET_USER_INFO}`, {
           headers: {token:token}
          });

          if (response.data.user) {
            // Save user data in localStorage
            localStorage.setItem('user', JSON.stringify(response.data.user));
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // localStorage.removeItem('token'); // Remove invalid token
          // navigate('/'); // Redirect to login page
        }
      } else {
        // If no token is found, redirect to login
        // navigate('/');
      }
    };

    checkAuth(); // Run checkAuth when the app loads
  }, []); // Run once on mount (page load/reload), passing navigate as dependency

  return (
    <Router> {/* Ensure Router is wrapping the Routes */}
      <div className="App">
        <Routes>
          {/* Public routes: accessible to anyone */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />

          {/* Protected routes: accessible only if logged in */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <PassDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/face-verification"
            element={
              <AdminRoute>
                <FaceVerification />
              </AdminRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Admin-only route: accessible only to admins */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
