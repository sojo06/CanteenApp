import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('/api/auth/signup', { username, password });
      if (response.data.success) {
        navigate('/login');
      } else {
        setErrorMessage('Signup failed. Please try again.');
      }
    } catch (error) {
      setErrorMessage('Signup failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">Sign Up</h2>

          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Username</label>
              <input
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
              <input
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                required
              />
            </div>

            {errorMessage && (
              <p className="text-center text-red-500 text-sm font-medium">{errorMessage}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg transform transition-transform hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl"
            >
              Sign Up
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Signup;
