import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast'; // For toast notifications
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import { HOST, UPDATE_PROFILE, UPDATE_PROFILE_IMAGE } from '../utils/constants';

function ProfilePage() {
  const [isEditing, setIsEditing] = useState({
    email: false,
    firstName: false,
    lastName: false,
    studentId: false,
    profilePicture: false,
  });
  const [profile, setProfile] = useState({
    email: '',
    firstName: '',
    lastName: '',
    studentId: '',
    profilePicture: '', // URL of the profile picture
  });
  const [newProfilePicture, setNewProfilePicture] = useState(null); // State for new profile picture
  const [imagePreview, setImagePreview] = useState(''); // State for image preview
  const navigate = useNavigate();

  // Function to handle profile update
  const handleUpdate = async () => {
    const updatedProfile = { ...profile };
    const token = localStorage.getItem("token")

    try {
      if (newProfilePicture) {
        // Upload the new profile image if changed
        console.log("updating profile")
        const formData = new FormData();
        formData.append('profilePicture', newProfilePicture);
        const imageResponse = await axios.post(`${HOST}/${UPDATE_PROFILE_IMAGE}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data',token:token }
        });

        if (imageResponse.data.image) {
          updatedProfile.profilePicture = imageResponse.data.image;
        }
      }

      // Update profile information
      const response = await axios.post(`${HOST}/${UPDATE_PROFILE}`, updatedProfile, {
        headers: {token:token }
      });

      if (response.status === 200) {
        toast.success('Profile updated successfully!');
        setProfile(updatedProfile); // Update profile in state
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error) {
      toast.error('Error updating profile');
    }
  };

  const handleInputChange = (field, value) => {
    setProfile({ ...profile, [field]: value });
  };

  const handleEditToggle = (field) => {
    setIsEditing({ ...isEditing, [field]: !isEditing[field] });
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setNewProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set image preview
      };
      reader.readAsDataURL(file); // Convert the image file to base64
    }
  };

  // Load user data from localStorage when component mounts
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem('user'));
    console.log(userData.image) // Retrieve user data from localStorage
    if (userData) {
      setProfile({
        email: userData.email || '',
        firstName: userData.firstname || '',
        lastName: userData.lastname || '',
        studentId: userData.studentid || '',
        profilePicture: userData.image || 'https://via.placeholder.com/150', // Default image if no profile picture
      });
    } else {
      toast.error('No user data found!');
      navigate('/'); // Redirect to login if no user data is found
    }
  }, [navigate]);

//   return (
//     <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
//       {/* Navbar */}
//       <Navbar />

//       {/* Profile Section */}
//       <div className="flex-grow flex items-center justify-center p-6">
//         <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl mx-auto mt-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
//           <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
//             Profile Information
//           </h2>

//           <div className="flex justify-center mb-6 relative">
//             {/* Profile Picture */}
//             <div className="relative">
//               <img
//                 src={imagePreview || profile.profilePicture}
//                 alt="Profile12121"
//                 className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4"
//               />
//               {/* Edit Icon */}
//               {!isEditing.profilePicture && (
//                 <button
//                   onClick={() => setIsEditing({ ...isEditing, profilePicture: true })}
//                   className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:scale-110 transform transition duration-200"
//                 >
//                   ✏️
//                 </button>
//               )}
//               {/* Image Upload */}
//               {isEditing.profilePicture && (
//                 <div className="absolute bottom-0 right-0 flex flex-col items-center">
//                   <input
//                     type="file"
//                     accept="image/*"
//                     onChange={handleImageChange}
//                     className="text-white opacity-75"
//                   />
//                   <button
//                     onClick={() => setIsEditing({ ...isEditing, profilePicture: false })}
//                     className="mt-2 text-blue-500"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>

//           {/* Editable Profile Fields */}
//           <div className="grid gap-6">
//             {/* Email */}
//             <div className="flex items-center justify-between">
//               <label className="text-gray-700">Email</label>
//               <div className="flex items-center">
//                 {isEditing.email ? (
//                   <input
//                     type="email"
//                     value={profile.email}
//                     onChange={(e) => handleInputChange('email', e.target.value)}
//                     className="border border-gray-300 rounded px-2 py-1"
//                   />
//                 ) : (
//                   <span>{profile.email}</span>
//                 )}
//                 <button
//                   className="ml-2 text-blue-500"
//                   onClick={() => handleEditToggle('email')}
//                 >
//                   {isEditing.email ? 'Save' : 'Edit'}
//                 </button>
//               </div>
//             </div>

//             {/* First Name */}
//             <div className="flex items-center justify-between">
//               <label className="text-gray-700">First Name</label>
//               <div className="flex items-center">
//                 {isEditing.firstName ? (
//                   <input
//                     type="text"
//                     value={profile.firstName}
//                     onChange={(e) => handleInputChange('firstName', e.target.value)}
//                     className="border border-gray-300 rounded px-2 py-1"
//                   />
//                 ) : (
//                   <span>{profile.firstName}</span>
//                 )}
//                 <button
//                   className="ml-2 text-blue-500"
//                   onClick={() => handleEditToggle('firstName')}
//                 >
//                   {isEditing.firstName ? 'Save' : 'Edit'}
//                 </button>
//               </div>
//             </div>

//             {/* Last Name */}
//             <div className="flex items-center justify-between">
//               <label className="text-gray-700">Last Name</label>
//               <div className="flex items-center">
//                 {isEditing.lastName ? (
//                   <input
//                     type="text"
//                     value={profile.lastName}
//                     onChange={(e) => handleInputChange('lastName', e.target.value)}
//                     className="border border-gray-300 rounded px-2 py-1"
//                   />
//                 ) : (
//                   <span>{profile.lastName}</span>
//                 )}
//                 <button
//                   className="ml-2 text-blue-500"
//                   onClick={() => handleEditToggle('lastName')}
//                 >
//                   {isEditing.lastName ? 'Save' : 'Edit'}
//                 </button>
//               </div>
//             </div>

//             {/* Student ID */}
//             <div className="flex items-center justify-between">
//               <label className="text-gray-700">Student ID</label>
//               <div className="flex items-center">
//                 {isEditing.studentId ? (
//                   <input
//                     type="text"
//                     value={profile.studentId}
//                     onChange={(e) => handleInputChange('studentId', e.target.value)}
//                     className="border border-gray-300 rounded px-2 py-1"
//                   />
//                 ) : (
//                   <span>{profile.studentId}</span>
//                 )}
//                 <button
//                   className="ml-2 text-blue-500"
//                   onClick={() => handleEditToggle('studentId')}
//                 >
//                   {isEditing.studentId ? 'Save' : 'Edit'}
//                 </button>
//               </div>
//             </div>
//           </div>

//           {/* Update Profile Button */}
//           <button
//             onClick={handleUpdate}
//             className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transform transition duration-300"
//           >
//             Update Profile
//           </button>
//         </div>
//       </div>

//       <Footer />
//     </div>
//   );
// }
return (
    profile.email ? (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-teal-300 via-blue-400 to-purple-600">
        {/* Navbar */}
        <Navbar />
  
        {/* Profile Section */}
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="bg-white shadow-2xl rounded-2xl p-8 w-full max-w-3xl mx-auto mt-8 transform transition duration-500 hover:scale-105 hover:shadow-2xl">
            <h2 className="text-3xl font-extrabold text-gray-800 mb-8 text-center">
              Profile Information
            </h2>
  
            <div className="flex justify-center mb-6 relative">
              {/* Profile Picture */}
              <div className="relative">
                <img
                  src={imagePreview || `${HOST}/${profile.profilePicture}`}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-blue-500 mb-4"
                />
                {/* Edit Icon */}
                {!isEditing.profilePicture && (
                  <button
                    onClick={() => setIsEditing({ ...isEditing, profilePicture: true })}
                    className="absolute bottom-0 right-0 bg-white text-blue-500 rounded-full p-2 shadow-lg hover:scale-110 transform transition duration-200"
                  >
                    ✏️
                  </button>
                )}
                {/* Image Upload */}
                {isEditing.profilePicture && (
                  <div className="absolute bottom-0 right-0 flex flex-col items-center">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="text-white opacity-75"
                    />
                    <button
                      onClick={() => setIsEditing({ ...isEditing, profilePicture: false })}
                      className="mt-2 text-blue-500"
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
  
            {/* Editable Profile Fields */}
            <div className="grid gap-6">
              {/* Email */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Email</label>
                <div className="flex items-center">
                <span className="text-gray-800">{profile.email}</span>
                  {/* {isEditing.email ? (
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.email}</span>
                  )}
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => handleEditToggle('email')}
                  >
                    {isEditing.email ? 'Save' : 'Edit'}
                  </button> */}
                </div>
              </div>
  
              {/* First Name */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">First Name</label>
                <div className="flex items-center">
                  {isEditing.firstName ? (
                    <input
                      type="text"
                      value={profile.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.firstName}</span>
                  )}
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => handleEditToggle('firstName')}
                  >
                    {isEditing.firstName ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>
  
              {/* Last Name */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Last Name</label>
                <div className="flex items-center">
                  {isEditing.lastName ? (
                    <input
                      type="text"
                      value={profile.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.lastName}</span>
                  )}
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => handleEditToggle('lastName')}
                  >
                    {isEditing.lastName ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>
  
              {/* Student ID */}
              <div className="flex items-center justify-between">
                <label className="text-gray-700">Student ID</label>
                <div className="flex items-center">
                  {isEditing.studentId ? (
                    <input
                      type="text"
                      value={profile.studentId}
                      onChange={(e) => handleInputChange('studentId', e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1"
                    />
                  ) : (
                    <span>{profile.studentId}</span>
                  )}
                  <button
                    className="ml-2 text-blue-500"
                    onClick={() => handleEditToggle('studentId')}
                  >
                    {isEditing.studentId ? 'Save' : 'Edit'}
                  </button>
                </div>
              </div>
            </div>
  
            {/* Update Profile Button */}
            <button
              onClick={handleUpdate}
              className="w-full mt-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-lg hover:scale-105 transform transition duration-300"
            >
              Update Profile
            </button>
          </div>
        </div>
  
        <Footer />
      </div>
    ) : null // Render nothing if profile is empty
  );
}
 export default ProfilePage;
