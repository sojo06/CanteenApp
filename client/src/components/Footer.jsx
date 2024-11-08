// Footer.js
import React from 'react';

function Footer() {
  return (
    <footer className="w-full bg-gray-800 text-white py-4 mt-8">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <p className="text-sm">
          © {new Date().getFullYear()} Canteen Pass System. All rights reserved.
        </p>
        <nav className="space-x-4">
          <a href="/privacy" className="text-gray-400 hover:text-white transition">Privacy Policy</a>
          <a href="/terms" className="text-gray-400 hover:text-white transition">Terms of Service</a>
          <a href="/contact" className="text-gray-400 hover:text-white transition">Contact Us</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
