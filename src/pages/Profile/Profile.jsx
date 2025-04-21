// Profile.jsx
import { useState, useEffect } from 'react';
import './Profile.css';
import PropTypes from 'prop-types';
import { useAuth } from '../../contexts/AuthContext';
import { auth } from '../../../firebaseConfig';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const Profile = () => {
    const { apiKey } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [imagenPerfil, setImagenPerfil] = useState(null);

    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [moviesToWatch, setMoviesToWatch] = useState([]);
    const [favoriteActors, setFavoriteActors] = useState([]);

    const handleChangePassword = () => {
        // Función para manejar el cambio de contraseña
    };

    const subirImagen = async (file) => {
        const formData = new FormData();
        formData.append('archivo', file);

        try {
            const res = await axios.post(
                'http://127.0.0.1:8000/api/tmdb/upload/',
                formData,
                {
                    headers: {
                        'Authorization': `Token ${apiKey}`,
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            message.success('Imagen subida correctamente');
            setImagenPerfil(res.data.url);
        } catch (err) {
            console.error(err);
            message.error('Error al subir imagen');
        }
    };

    const propsUpload = {
        name: 'archivo',
        maxCount: 1,
        accept: 'image/*',
        beforeUpload: (file) => {
            subirImagen(file);
            return false;
        },
        showUploadList: false,
    };

    useEffect(() => {
        const user = auth.currentUser;
        if (user) {
            setUserData({
                uid: user.uid,
                email: user.email,
                emailVerified: user.emailVerified,
                displayName: user.displayName || '',
                phoneNumber: user.phoneNumber || '',
                photoURL: user.photoURL || './src/assets/foto.png',
                providerId: user.providerId,
                creationTime: user.metadata?.creationTime,
                lastSignInTime: user.metadata?.lastSignInTime,
                isAnonymous: user.isAnonymous,
                accessToken: user.stsTokenManager?.accessToken,
                refreshToken: user.stsTokenManager?.refreshToken,
            });
        }
        setIsLoading(false);
    }, []);

    return (
        <>
            <div className="profile-container">
                <div className="profile-sidebar">
                    <div style={{ textAlign: 'center' }}>
                        <img
                            src={imagenPerfil || userData.photoURL}
                            alt="Foto de perfil"
                            className="profile-image"
                            style={{ width: 120, height: 120, borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }}
                        />
                        <Upload {...propsUpload}>
                            <Button icon={<UploadOutlined />}>Subir nueva foto</Button>
                        </Upload>
                    </div>
                </div>
                <div className="profile-content">
                    <h1>Mi Perfil</h1>
                    <p><strong>Nombre:</strong> {userData.displayName || 'No establecido'}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Teléfono:</strong> {userData.phoneNumber || 'No disponible'}</p>
                    <p><strong>UID:</strong> {userData.uid}</p>
                    <p><strong>Proveedor:</strong> {userData.providerId}</p>
                    <p><strong>Cuenta anónima:</strong> {userData.isAnonymous ? 'Sí' : 'No'}</p>
                    <p><strong>Email verificado:</strong> {userData.emailVerified ? 'Sí' : 'No'}</p>
                    <p><strong>Fecha de creación:</strong> {userData.creationTime}</p>
                    <p><strong>Último acceso:</strong> {userData.lastSignInTime}</p>
                    <p><strong>API Key:</strong> {apiKey}</p>

                    <button onClick={handleChangePassword} style={{ marginTop: '1rem' }}>
                        Cambiar Contraseña
                    </button>
                </div>
            </div>
            <div className="profile-sections">
                <div className="profile-section">
                    <div>Películas Favoritas</div>
                </div>

                <div className="profile-section">
                    <div>Películas por Ver</div>
                </div>

                <div className="profile-section">
                    <div>Actores Favoritos</div>
                </div>
            </div>
        </>
    );
};

Profile.propTypes = {
    apiKey: PropTypes.func.isRequired,
};

export default Profile;
