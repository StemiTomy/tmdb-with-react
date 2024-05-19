// Profile.jsx
import { useState } from 'react';
import './Profile.css';
import PropTypes from 'prop-types';

const Profile = ({ apiKey }) => {
    const [userEmail, setUserEmail] = useState('stemitomy@gmail.com'); // Suponiendo un email por defecto
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [moviesToWatch, setMoviesToWatch] = useState([]);
    const [favoriteActors, setFavoriteActors] = useState([]);

    // Aquí puedes usar useEffect para cargar datos del usuario desde tu base de datos

    const handleChangePassword = () => {
        // Función para manejar el cambio de contraseña
    };

    return (
        <>
            <div className="profile-container">
                <div className="profile-sidebar">
                    <img src="./src/assets/foto.png" alt="Profile" className="profile-image" />
                </div>
                <div className="profile-content">
                    <h1>Mi Perfil</h1>
                    <p>Email: {userEmail}</p>
                    <p>API Key: {apiKey}</p>
                    <button onClick={handleChangePassword}>Cambiar Contraseña</button>
                </div>
            </div>
            <div className="profile-sections">
                <div className="profile-section">
                    <div>Películas Favoritas</div>
                    {/* Renderiza aquí las películas favoritas */}
                </div>

                <div className="profile-section">
                    <div>Películas por Ver</div>
                    {/* Renderiza aquí las películas por ver */}
                </div>

                <div className="profile-section">
                    <div>Actores Favoritos</div>
                    {/* Renderiza aquí los actores favoritos */}
                </div>
            </div>
        </>
    );
};

Profile.propTypes = {
    apiKey: PropTypes.func.isRequired,
};

export default Profile;
