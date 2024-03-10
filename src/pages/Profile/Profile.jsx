// Profile.jsx
import React, { useState, useEffect } from 'react';
import './Profile.css';
// Puedes importar otros componentes o hooks si es necesario

const Profile = ({ apiKey }) => {
    const [userEmail, setUserEmail] = useState('stemitomy@gmail.com'); // Suponiendo un email por defecto
    const FAKE_APIKEY = "1234567891011121314151617181920"
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
                    <p>API Key: {FAKE_APIKEY}</p>
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

export default Profile;