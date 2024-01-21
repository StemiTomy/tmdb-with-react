import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

const Login = ({ onLogin }) => {
    const apiUrl = process.env.REACT_APP_API_URL;

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${apiUrl}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();
            if (data.token) {
                // Aquí recibimos el token JWT desde el servidor
                localStorage.setItem('token', data.token); // Guarda el token en localStorage
                localStorage.setItem('userApiKey', data.userApiKey);
                onLogin(data.token, data.userApiKey); // Llama a la función onLogin con el token, api                alert('¡Conectado correctamente!');
                navigate('/profile');
            } else {
                // Manejar respuesta cuando no hay token (credenciales incorrectas)
                setErrorMessage('Credenciales incorrectas');
            }
        } catch (error) {
            // Manejar errores de la petición
            console.error('Error en el login:', error);
            setErrorMessage('Error al intentar conectarse al servidor');
        }
    };

    return (
        <div className="login-container">
            <form className="form" onSubmit={handleLogin}>
                <label className="label-form">E-Mail</label>
                <input
                    className="input-form"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />

                <label className="label-form">Password</label>
                <input
                    className="input-form"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                />

                <button className="button-form" type="submit">Login</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default Login;