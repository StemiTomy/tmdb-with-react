import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PropTypes from 'prop-types';

const AuthenticatedRoutes = ({ redirectTo }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
};

AuthenticatedRoutes.propTypes = {
    redirectTo: PropTypes.string.isRequired,
};

export default AuthenticatedRoutes;