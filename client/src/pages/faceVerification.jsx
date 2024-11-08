import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function FaceVerification() {
  const [studentData, setStudentData] = useState(null);
  const [result, setResult] = useState('');
  const [isCapturing, setIsCapturing] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const navigate = useNavigate();

  // Fetch student details when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        const response = await axios.post('/api/verification', { studentId: '12345' });
        if (response.data.success) {
          setStudentData(response.data.studentData);
        } else {
          setResult('Student not found');
        }
      } catch (error) {
        setResult('Error fetching student data');
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, []);

  // Start video capture
  const startVideoCapture = () => {
    setIsCapturing(true);
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        setVideoStream(stream);
        const videoElement = document.getElementById('videoElement');
        videoElement.srcObject = stream;
      })
      .catch((err) => {
        console.error('Error accessing webcam:', err);
        setResult('Error accessing webcam');
      });
  };

  // Stop video capture and submit face data
  const handleCaptureSubmit = async () => {
    if (videoStream) {
      videoStream.getTracks().forEach(track => track.stop());
    }

    setIsCapturing(false);
    const capturedData = "mock_face_data"; // Replace with actual face data

    try {
      const response = await axios.post('/api/verify-face', { faceData: capturedData });
      setResult(response.data.match ? "Verification Successful" : "Verification Failed");
    } catch (error) {
      console.error('Verification error:', error);
      setResult("Verification Error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
      <Navbar />
      <div className="flex-grow flex items-center justify-center p-6">
        <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg mx-auto transform transition duration-500 hover:scale-105 hover:shadow-2xl">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
            Face Verification
          </h2>

          {/* Display student details */}
          {studentData ? (
            <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
              <h3 className="text-2xl font-medium text-gray-800 mb-4">Student Details</h3>
              <div className="space-y-2">
                <p><strong>Name:</strong> <span className="text-gray-600">{studentData.name}</span></p>
                <p><strong>ID:</strong> <span className="text-gray-600">{studentData.id}</span></p>
                <p><strong>Pass Status:</strong> <span className="text-gray-600">{studentData.passStatus}</span></p>
                <p><strong>Email:</strong> <span className="text-gray-600">{studentData.email}</span></p>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-500">Loading student details...</p>
          )}

          {/* Video Capture Section */}
          {!isCapturing ? (
            <div className="text-center mb-6">
              <button 
                onClick={startVideoCapture} 
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
              >
                Start Video Capture
              </button>
            </div>
          ) : (
            <div className="text-center mb-6">
              <video id="videoElement" width="320" height="240" autoPlay className="border-2 border-gray-300 rounded-lg mb-4"></video>
              <br />
              <button 
                onClick={handleCaptureSubmit} 
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
              >
                Capture & Verify Face
              </button>
            </div>
          )}

          {/* Verification Result */}
          {result && (
            <p className="mt-6 text-center font-semibold text-lg">
              {result === "Verification Successful" ? (
                <span className="text-green-600">{result}</span>
              ) : result === "Verification Failed" ? (
                <span className="text-red-600">{result}</span>
              ) : (
                <span className="text-yellow-500">{result}</span>
              )}
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FaceVerification;
