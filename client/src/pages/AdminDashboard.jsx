import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { HOST, PASS_ISSUE_ROUTE } from '../utils/constants';

function AdminDashboard() {
  const [studentId, setStudentId] = useState('');
  const navigate = useNavigate();

  const handleIssuePass = async (e) => {
    e.preventDefault();
    try {
      console.log(studentId)
      const token = localStorage.getItem("token")
      const response = await axios.post(`${HOST}/${PASS_ISSUE_ROUTE}`, { studentId },{headers:{token:token}});
      if (response.data.success) {
        toast.success("Pass Issued Successfully!");
        navigate('/admin/face-verification', { state: { studentId } });
      } else {
        toast.error("Error: Unable to issue pass");
      }
    } catch (error) {
      console.error("Pass issuance error:", error);
      toast.error("Error: Unable to issue pass");
      
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg mx-auto transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Admin Dashboard
          </h2>
          <p className="text-gray-500 mb-4 text-center">
            Issue new meal passes to students.
          </p>
          <form onSubmit={handleIssuePass} className="space-y-6">
            <div className="relative">
              <label htmlFor="studentId" className="absolute -top-4 left-3 text-sm text-gray-600 bg-white px-1">
                Student ID
              </label>
              <input
                id="studentId"
                type="text"
                placeholder="Enter Student ID"
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition duration-300"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold shadow-lg transform transition-all duration-300 hover:scale-105 hover:from-indigo-600 hover:to-purple-700 hover:shadow-2xl"
            >
              Issue Pass
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default AdminDashboard;
