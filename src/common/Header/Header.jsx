import Search from "../Search/Search";
import { Link } from 'react-router-dom';
import { useAuth } from '../../services/AuthContext';
import "./Header.css";

export const Header = () => {
  const { isAuthenticated, apiKey, logout } = useAuth();
  
  return (
    <div className="headerDesign">
      <div className="headerNavDesign">
        {isAuthenticated ? (
          <>
            <Link className="nav" to="/">Home</Link>
            <Link className="nav" to="/profile">Profile</Link>
            <button className="button" onClick={logout}>Log out</button>
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
