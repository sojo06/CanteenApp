// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate,useLocation } from 'react-router-dom';
// import { toast } from 'react-hot-toast'; // Import toast from react-hot-toast
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { FACE_VERIFICATION_ROUTE, GET_STUDENT_DATA_ROUTE, HOST } from '../utils/constants';

// function FaceVerification() {
//   const [studentData, setStudentData] = useState(null);
//   const [isCapturing, setIsCapturing] = useState(false);
//   const [videoStream, setVideoStream] = useState(null);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const studentId = location.state.studentId
//   // Fetch student details when the component mounts
//   useEffect(() => {
//     const fetchStudentData = async () => {
//       const token = localStorage.getItem('token')

//       try {
//         const response = await axios.post(`${HOST}/${GET_STUDENT_DATA_ROUTE}`, { studentId },{headers:{token:token}});
//         if (response.data) {
//           setStudentData(response.data.studentData);
//         } else {
//           toast.error('Student not found');
//         }
//       } catch (error) {
//         toast.error('Error fetching student data');
//         console.error('Error fetching student data:', error);
//       }
//     };

//     fetchStudentData();
//   }, []);

//   // Start video capture
//   const startVideoCapture = () => {
//     setIsCapturing(true);
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then((stream) => {
//         setVideoStream(stream);
//         const videoElement = document.getElementById('videoElement');
//         videoElement.srcObject = stream;
//       })
//       .catch((err) => {
//         console.error('Error accessing webcam:', err);
//         toast.error('Error accessing webcam');
//       });
//   };

//   // Stop video capture and submit face data
//   // Stop video capture and submit face data
// const handleCaptureSubmit = async () => {
//   if (videoStream) {
//     // Stop the video stream
//     videoStream.getTracks().forEach((track) => track.stop());
//   }
  
//   setIsCapturing(false);

//   // Capture the frame
//   const videoElement = document.getElementById("videoElement");
//   const canvas = document.createElement("canvas");
//   canvas.width = videoElement.videoWidth;
//   canvas.height = videoElement.videoHeight;
//   const context = canvas.getContext("2d");

//   // Draw the current frame from the video onto the canvas
//   context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

//   // Convert canvas to a base64-encoded image (data URL)
//   const capturedData = canvas.toDataURL("image/png");
  
//    // Add buffer to FormData
// const token = localStorage.getItem("token")
  
//   try {
//     // Send the captured image data to the server
//     const response = await axios.post(
//       `${HOST}/${FACE_VERIFICATION_ROUTE}`, 
//        {
//         faceData:capturedData,
//         studentid:studentId
//        },
        
//         // Send the image data as faceData
//       { headers: { token: token } }
//     );
    
//     if (response.data) {
//       toast.success("Verification Successful");
//       console.log(response.data)
//     } else {
//       toast.error("Verification Failed");
//     }
//   } catch (error) {
//     console.error("Verification error:", error);
//     toast.error("Verification Error");
//   }
// };


//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
//       <Navbar />
//       <div className="flex-grow flex items-center justify-center p-6">
//         <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-lg mx-auto transform transition duration-500 hover:scale-105 hover:shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//             Face Verification
//           </h2>

//           {/* Display student details */}
//           {studentData ? (
//             <div className="bg-gray-100 p-4 rounded-lg shadow-md mb-6">
//               <h3 className="text-2xl font-medium text-gray-800 mb-4">Student Details</h3>
//               <div className="space-y-2">
//                 <p><strong>Fisrt Name:</strong> <span className="text-gray-600">{studentData.firstname}</span></p>
//                 <p><strong>Last Name:</strong> <span className="text-gray-600">{studentData.lastname}</span></p>
//                 <p><strong>ID:</strong> <span className="text-gray-600">{studentData.studentid}</span></p>
//                 <p><strong>Pass Status:</strong> <span className="text-gray-600">{studentData.activepasses}</span></p>
//                 <p><strong>Email:</strong> <span className="text-gray-600">{studentData.email}</span></p>
//               </div>
//             </div>
//           ) : (
//             <p className="text-center text-gray-500">Loading student details...</p>
//           )}

//           {/* Video Capture Section */}
//           {!isCapturing ? (
//             <div className="text-center mb-6">
//               <button 
//                 onClick={startVideoCapture} 
//                 className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-lg shadow-md hover:bg-purple-700 transition duration-300"
//               >
//                 Start Video Capture
//               </button>
//             </div>
//           ) : (
//             <div className="text-center mb-6">
//               <video id="videoElement" width="320" height="240" autoPlay className="border-2 border-gray-300 rounded-lg mb-4"></video>
//               <br />
//               <button 
//                 onClick={handleCaptureSubmit} 
//                 className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
//               >
//                 Capture & Verify Face
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <Footer />
//     </div>
//   );
// }

// export default FaceVerification;
import React, { useState, useEffect,useRef } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FACE_VERIFICATION_ROUTE, GET_STUDENT_DATA_ROUTE, HOST } from '../utils/constants';

function FaceVerification() {
  const [studentData, setStudentData] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [videoStream, setVideoStream] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const studentId = location.state.studentId;
  const videoRef = useRef(null);
  const canvasRef = useRef(null);


  // Fetch student details when the component mounts
  useEffect(() => {
    const fetchStudentData = async () => {
      const token = localStorage.getItem('token');

      try {
        const response = await axios.post(`${HOST}/${GET_STUDENT_DATA_ROUTE}`, { studentId }, { headers: { token: token } });
        if (response.data) {
          setStudentData(response.data.studentData);
        } else {
          toast.error('Student not found');
        }
      } catch (error) {
        toast.error('Error fetching student data');
        console.error('Error fetching student data:', error);
      }
    };

    fetchStudentData();
  }, [studentId]);

  // Start video capture
  // const startVideoCapture = () => {
  //   setIsCapturing(true);
  //   navigator.mediaDevices.getUserMedia({ video: true })
  //     .then((stream) => {
  //       setVideoStream(stream);
  //       const videoElement = document.getElementById('videoElement');
  //       videoElement.srcObject = stream;
  //     })
  //     .catch((err) => {
  //       console.error('Error accessing webcam:', err);
  //       toast.error('Error accessing webcam');
  //     });
  // };
  const startVideoCapture = async () => {
        setIsCapturing(true);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
      // setIsStreaming(true);
    } catch (err) {
      console.error("Error accessing webcam:", err);
    }
  };


  // Stop video capture and submit face data
  const handleCaptureSubmit = async () => {
    // if (videoStream) {
    //   // Stop the video stream
    //   videoStream.getTracks().forEach((track) => track.stop());
    // }
    
    setIsCapturing(false);

    // Capture the frame
    const videoElement = document.getElementById("videoElement");
    
    // Ensure video element is loaded and has videoWidth and videoHeight
    if (!videoElement.videoWidth || !videoElement.videoHeight) {
      toast.error('Unable to access video dimensions');
      return;
    }

    // Wait a bit to allow video stream to stabilize
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob) {
        let fd = new FormData();
        fd.append('image', blob, 'image.png');

        // Send the FormData to the backend
        const token = localStorage.getItem("token");
        const user = JSON.parse(localStorage.getItem("user"))
        fd.append("studentid",studentId)
      try {
        // Send the captured image data to the server
        const response = await axios.post(
          `${HOST}/${FACE_VERIFICATION_ROUTE}`,
        fd,
        
          { headers: { token: token } }
        );

        if (response.data.success) {
          toast.success("Verification Successful");
          console.log(response.data);
          setTimeout(() => navigate('/admin'), 2000);

        } else {
          console.log(response.data)
          toast.error("Verification Failed");
        }
      } catch (error) {
        console.error("Verification error:", error);
        toast.error("Verification Error");
      }
      }
    }, 'image/png');
  
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
    }

      
      // Add buffer to FormData
      
   
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
                <p><strong>First Name:</strong> <span className="text-gray-600">{studentData.firstname}</span></p>
                <p><strong>Last Name:</strong> <span className="text-gray-600">{studentData.lastname}</span></p>
                <p><strong>ID:</strong> <span className="text-gray-600">{studentData.studentid}</span></p>
                <p><strong>Pass Status:</strong> <span className="text-gray-600">{studentData.activepasses}</span></p>
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
              
              <video ref={videoRef} id="videoElement" width="320" height="240" autoPlay className="border-2 border-gray-300 rounded-lg mb-4"></video>
              <canvas ref={canvasRef}></canvas>
              
              <button
                onClick={handleCaptureSubmit}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition duration-300"
              >
                Capture & Verify Face
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default FaceVerification;
