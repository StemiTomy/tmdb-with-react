import { useState } from 'react';
import Search from "../Search/Search";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "./Header.css";

export const Header = () => {
  const { isAuthenticated, apiKey, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true); // Local loading state
    await logout();
    setIsLoading(false);
    navigate('/login');
  };
  
  return (
    <div className="headerDesign">
      <div className="headerNavDesign">
        {isAuthenticated ? (
          <>
            <Link className="nav" to="/">Home</Link>
            <Link className="nav" to="/profile">Profile</Link>
            <button className="button" onClick={handleLogout}>Log out</button>
            <Search apiKey={apiKey} />
          </>
        ) : (
          <>
            <Link className="nav" to="/register">Register</Link>
            <Link className="nav" to="/login">Login</Link>
          </>
        )}
      </div>
    </div>
  );
};
