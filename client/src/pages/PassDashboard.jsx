import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PassDashboard() {
  const [passes, setPasses] = useState([]);

  useEffect(() => {
    const fetchPasses = async () => {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/passes', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasses(response.data.passes);
    };

    fetchPasses();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
      {/* Navbar */}
      <Navbar />

      {/* Passes Section */}
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl mx-auto mt-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Your Active Passes
          </h2>
          
          <div className="grid gap-6">
            {passes && passes.length > 0 ? (
              passes.map((pass) => (
                <div
                  key={pass._id}
                  className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-lg flex justify-between items-center transition-transform transform hover:scale-105 hover:shadow-xl"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">Pass ID: {pass._id}</h3>
                    <p className="text-gray-500">Expires: {new Date(pass.expiryDate).toLocaleDateString()}</p>
                  </div>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2 rounded-full font-semibold shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
                    Use Pass
                  </button>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-600 font-medium">
                You have no active passes.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PassDashboard;
