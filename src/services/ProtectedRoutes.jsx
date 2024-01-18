import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoutes = () => {
    const { isAuthenticated } = useAuth();
    return (isAuthenticated ? <Outlet /> : <Navigate to="/login" />)
};

export default ProtectedRoutes
