import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Added Link import
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HOST, LOGIN_ROUTE } from '../utils/constants';
import { toast, Toaster } from 'react-hot-toast';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    // Check if fields are empty
    if (!email || !password) {
      toast.error('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post(`${HOST}/${LOGIN_ROUTE}`, { email, password });
      if (response.data.user) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        console.log(response.data.user);
        if (response.data.user.role === 'admin') {
          toast.success('Login successful! Redirecting to dashboard...');
          setTimeout(() => navigate('/admin'), 3000);
          return;
        }
        toast.success('Login successful! Redirecting to dashboard...');
        setTimeout(() => navigate('/dashboard'), 3000);
      } else {
        toast.error('Invalid email or password.');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
      <Toaster position="top-center" reverseOrder={false} />
      <Navbar />

      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-md mx-auto transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center">Login</h2>

          {/* Add signup redirection line */}
          <p className="text-center text-gray-600 text-sm mb-8">
            Don't have an account?{' '}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg transform transition-transform hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl"
            >
              Login
            </button>
          </form>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Login;
