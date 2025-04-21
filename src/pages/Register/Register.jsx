// Register.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';
import PropTypes from 'prop-types';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, database } from '../../../firebaseConfig'; // Ajusta la ruta según sea necesario
import { get, ref, set } from 'firebase/database';
import { useAuth } from '../../contexts/AuthContext';
import Spinner from '../../components/Spinner';


const Register = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    tmdb: ''
  });
  const [errorMessages, setErrorMessages] = useState({});
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const areFieldsFilled = formData.email && formData.password && formData.confirmPassword && formData.tmdb;
    const areErrorsPresent = Object.values(errorMessages).some(errorMessage => errorMessage);
    setIsFormValid(areFieldsFilled && !areErrorsPresent);
  }, [formData, errorMessages]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const userData = {
      email: formData.email,
      password: formData.password,
      tmdb: formData.tmdb
    };

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)
      const user = userCredential.user;

      const userRef = ref(database, 'users/' + user.uid);
      const userDataToSave = {
        email: userData.email,
        //password: userData.password,
        tmdb: userData.tmdb,
        last_login: Date.now()
      };

      await set(userRef, userDataToSave);
      const snapshot = await get(userRef);
      const userDataFromDB = snapshot.val();
      const token = await user.getIdToken();
      const apiKey = userDataFromDB?.tmdb;

      if (token && apiKey) {
        login(token, apiKey);
        alert('Registrado correctamente!');
        navigate('/profile');
      } else {
        console.warn("No se encontró la API key o el token.");
      }
    } catch (error) {
      console.error('Error en el registro: ' + error.message);
      alert('Error en el registro: ' + error.message);
    } finally {
      setIsLoading(false);
    }

  };

  const validateField = (fieldName, value) => {
    let errorMessage = '';
    switch (fieldName) {
      case 'email':
        if (!/^[a-zA-Z0-9._]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)) {
          errorMessage = 'Formato de e-mail incorrecto';
        }
        break;
      case 'password':
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(value)) {
          errorMessage = 'La contraseña debe tener mínimo 8 caracteres, incluyendo 1 mayúscula, 1 minúscula y 1 número';
        }
        break;
      case 'confirmPassword':
        if (value !== formData.password) {
          errorMessage = 'Las contraseñas no coinciden';
        }
        break;
      case 'tmdb':
        if (!/^[0-9a-zA-Z]{32}$/.test(value)) {
          errorMessage = 'La API Key debe ser un valor hexadecimal de 32 caracteres';
        }
        break;
      default:
        break;
    }
    setErrorMessages(prevErrors => ({ ...prevErrors, [fieldName]: errorMessage }));
  };

  const [fieldTouched, setFieldTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
    tmdb: false
  });

  // debouncing
  const debounceTimeouts = {};
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    if (debounceTimeouts[name]) {
      clearTimeout(debounceTimeouts[name]);
    }

    debounceTimeouts[name] = setTimeout(() => {
      validateField(name, value);
    }, 1000);
  };

  useEffect(() => {
    Object.keys(fieldTouched).forEach(field => {
      if (fieldTouched[field]) {
        validateField(field, formData[field]);
      }
    });
  }, [fieldTouched, formData]);

  const handleBlur = (e) => {
    const { name } = e.target;
    setFieldTouched(prevState => ({ ...prevState, [name]: true }));
    validateField(name, formData[name]); // Agrega la validación aquí DEBOUNCING
  };



  return (
    <div className="register-container">
      <form className="form" onSubmit={handleRegister}>
        <label className="label-form">E-Mail</label>
        <input
          className="input-form"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errorMessages.email && <p className="error-message">{errorMessages.email}</p>}

        <label className="label-form">Password</label>
        <input
          className="input-form"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errorMessages.password && <p className="error-message">{errorMessages.password}</p>}

        <label className="label-form">Confirm Password</label>
        <input
          className="input-form"
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errorMessages.confirmPassword && <p className="error-message">{errorMessages.confirmPassword}</p>}


        <label className="label-form">TMDB Api Key</label>
        <input
          className="input-form"
          type="text"
          name="tmdb"
          value={formData.tmdb}
          onChange={handleChange}
          onBlur={handleBlur}
          required
        />
        {errorMessages.tmdb && <p className="error-message">{errorMessages.tmdb}</p>}

        <button className="button-form" type="submit" disabled={!isFormValid || isLoading}>
          {isLoading ? <Spinner /> : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default Register;
