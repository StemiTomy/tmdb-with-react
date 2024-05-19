import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import PropTypes from 'prop-types';

const AuthenticatedRoutes = ({ redirectTo }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? <Navigate to={redirectTo} /> : <Outlet />;
};

AuthenticatedRoutes.propTypes = {
    redirectTo: PropTypes.func.isRequired,
};

export default AuthenticatedRoutes;