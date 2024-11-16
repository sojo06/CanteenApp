import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem("user"))
  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }
  if(user){
     if(isLoggedIn && user.role=='admin' ){
    return <Navigate to="/admin" replace />;

  }
  }
 
  return children;
}

export default ProtectedRoute;
