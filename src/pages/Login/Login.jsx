import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import PropTypes from 'prop-types';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, database } from '../../../firebaseConfig';
import { get, ref, update } from 'firebase/database';

export const Login = ({ onLogin }) => {

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

        const userData = {
            email: formData.email,
            password: formData.password
        };

        try {
            const userCredential = await signInWithEmailAndPassword(auth, userData.email, userData.password)
            const user = userCredential.user;

            const userRef = ref(database, 'users/' + user.uid);
            const userDataToSave = {
                last_login: Date.now()
            };

            await update(userRef, userDataToSave);

            const snapshot = await get(userRef);
            const userDataFromDB = snapshot.val();
            const token = await user.getIdToken();
            localStorage.setItem('token', token);

            onLogin(token, userDataFromDB.tmdb);

            console.log('Logeado correctamente!');
            alert('Logeado correctamente!');
            navigate('/profile');
        } catch (error) {
            console.error('Error en el registro: ' + error.message);
            alert('Error en el registro: ' + error.message);
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

Login.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default Login;