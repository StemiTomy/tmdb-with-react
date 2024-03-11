// Register.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

const Register = ({ onLogin }) => {
  const apiUrl = 'http://localhost:3001';


  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    tmdb: ''
  });
  const navigate = useNavigate();
  const [errorMessages, setErrorMessages] = useState({});
  

  const [isFormValid, setIsFormValid] = useState(false);
  useEffect(() => {
    const areFieldsFilled = formData.email && formData.password && formData.confirmPassword && formData.tmdb;
    const areErrorsPresent = Object.values(errorMessages).some(errorMessage => errorMessage);
    setIsFormValid(areFieldsFilled && !areErrorsPresent);
  }, [formData, errorMessages]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // En lugar de codificar la contraseña, envíala tal cual al servidor
    // Deja que el servidor se encargue de la encriptación de manera segura
    const userData = {
      email: formData.email,
      password: formData.password,
      tmdb: formData.tmdb
    };

    try {
      const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // Aquí asumimos que el registro fue exitoso
        // Ahora intentamos iniciar sesión automáticamente
        const loginResponse = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        const data = await loginResponse.json();
        if (loginResponse.ok) {
          // Si el inicio de sesión es exitoso, utilizamos la función onLogin
          onLogin(data.token, data.userApiKey); // Llama a la función onLogin con el token, api 
          alert('¡Registrado correctamente!');
          navigate('/profile');// Puedes redirigir al usuario a la página de inicio o mostrar un mensaje de éxito
        } else { // else login
          // Manejar el caso en que el inicio de sesión falla después del registro
          // Mostrar un mensaje de error o redirigir al formulario de inicio de sesión
          alert("¡Error al iniciar sesión!")
        }

      } else { // else register
        // Manejar errores, por ejemplo, mostrar un mensaje si el email ya está en uso
        alert("¡Email en uso!")
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      // Manejar errores de red, mostrar mensaje al usuario
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
      <form className="form" onSubmit={handleSubmit}>
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

        <button className="button-form" type="submit" disabled={!isFormValid}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;