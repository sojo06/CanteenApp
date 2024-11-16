import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'react-hot-toast';
import { HOST } from '../utils/constants';

function Navbar() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [profile, setprofile] = useState(undefined)
  // Sample profile picture URL fetched from the database
    const user = JSON.parse(localStorage.getItem("user"))

  if(user){
    if(user.image){
       profilePicture = user.image ;
    }
  } // Replace with actual profile URL from the database
  // console.log(profilePicture)
  useEffect(() => {
    // Check for token when the navbar component loads
    const token = localStorage.getItem('token');
    if (!token) {
      // toast.error('Already logged out, please login');
      setprofile(false);
    }
    else{
      setprofile(true);
    }
  }, []);

  const handleLogout = () => {
    // Get token from localStorage
    const token = localStorage.getItem('token');

    if (token) {
      // Delete token from localStorage
      localStorage.removeItem('token');

      // Show success message
      toast.success('Successfully logged out! Redirecting to login page...');

      // Redirect to login page after 3 seconds
      setTimeout(() => navigate('/'), 3000);
    } else {
      // If token is not found, show error message
      toast.error('Already logged out, please login');
    }
  };

  return (
    <nav className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="container mx-auto px-6 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-white transform hover:scale-105 transition duration-300">
          CanteenApp
        </a>

        {/* Navigation Links */}
        <ul className="hidden md:flex space-x-6 font-medium text-white">
          <li className="hover:underline">
            <a href="/">Home</a>
          </li>
          <li className="hover:underline">
            <a href="/dashboard">Dashboard</a>
          </li>
        </ul>

        {/* Profile Button with Picture */}
        {
          profile &&(
            <div className="relative">
          <button onClick={() => setDropdownOpen(!isDropdownOpen)} className="flex items-center focus:outline-none">
            <img
              src={`${HOST}/${profilePicture}`}
              alt="Profile"
              className="w-10 h-10 rounded-full border-2 border-white"
            />
          </button>
          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg">
              <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">View Profile</a>
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
              >
                Logout
              </button>
            </div>
          )}
        </div>
          )
        }

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
