import { Navigate } from 'react-router-dom';
import React from 'react';

function PublicRoute({ children }) {
    const isLoggedIn = localStorage.getItem('token'); // Check if token exists
    const user = JSON.parse(localStorage.getItem('user'))
    // Redirect to dashboard if already logged in
    if (isLoggedIn && user.role=='student') {
      return <Navigate to="/dashboard" replace />;
    }
    if(user){
        if(isLoggedIn && user.role=='admin'){
      return <Navigate to="/admin" replace />;

    } 
    }
   
  
    return children;
  }
  
  export default PublicRoute;
  
