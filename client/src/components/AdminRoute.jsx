import React from 'react';
import { Navigate } from 'react-router-dom';

function AdminRoute({ children }) {
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  const userRole = user.role
 
  // Assuming role is stored in localStorage

  if (!isLoggedIn || userRole !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AdminRoute;
