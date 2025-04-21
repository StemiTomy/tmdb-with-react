import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import PropTypes from 'prop-types';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from '../../../firebaseConfig';
import { get, ref, update } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/Spinner';

import { Button, message } from 'antd';
import axios from 'axios';

export const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const userData = {
            email: formData.email,
            password: formData.password
        };

        try {
            const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password)
            const user = userCredential.user;

            const userRef = ref(database, 'users/' + user.uid);
            const snapshot = await get(userRef);
            const userDataFromDB = snapshot.val();
            
            await update(userRef, { last_login: Date.now() });

            const token = await user.getIdToken();
            const apiKey = userDataFromDB?.tmdb;

            if (token && apiKey) {
                login(token, apiKey);
                navigate('/profile');
            } else {
                console.warn("Faltan token o apiKey. No se puede iniciar sesión correctamente.");
                setErrorMessage("Error al iniciar sesión. Datos incompletos.");
            }

            login(token, userDataFromDB.tmdb); 
            navigate('/profile');
        } catch (error) {
            alert('Error en el registro: ' + error.message);
        } finally {
            setIsLoading(false);
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

                <button className="button-form" type="submit" disabled={isLoading}>
                    {isLoading ? <Spinner/> : 'Login'}
                </button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <Button
                type="primary"
                onClick={async () => {
                    try {
                        const res = await axios.get('https://api.steluttomoiaga.com/api/tmdb/status/');
                        console.log(res)
                        console.table(res)
                        message.success(`✅ API OK: ${res.data.status} desde ${res.data.source}`);
                    } catch (err) {
                        console.error(err);
                        message.error(`❌ Error al contactar con la API: ${err.message}`);
                    }
                }}
                style={{ marginTop: '1rem' }}
            >
                Probar API Gateway
            </Button>
        </div>
    );
};

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;