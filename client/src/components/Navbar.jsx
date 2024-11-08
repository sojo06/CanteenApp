import React from 'react';

function Navbar() {
  return (
    <nav className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 shadow-lg">
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
          <li className="hover:underline">
            <a href="/admin">Admin</a>
          </li>
        </ul>

        {/* Profile Button */}
        <div className="relative group">
          <button className="bg-white text-blue-600 font-semibold py-2 px-4 rounded-full shadow hover:bg-gray-100 transition duration-300">
            Profile
          </button>
          {/* Dropdown Menu */}
          <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg hidden group-hover:block">
            <a href="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">View Profile</a>
            <a href="/logout" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">Logout</a>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <button className="text-white">
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
