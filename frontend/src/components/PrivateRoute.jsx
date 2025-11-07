import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  // If user is logged in, render the children (the page)
  // Otherwise, redirect them to the /login page
  return currentUser ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
