import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const AuthenticatedRoutes = ({ redirectTo }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
};

export default AuthenticatedRoutes;