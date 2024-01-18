import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import User from './User.js';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const uri = process.env.DB_URI;
mongoose.connect(uri)
  .then(() => console.log('Conexión a MongoDB Atlas exitosa'))
  .catch(err => console.error('No se pudo conectar a MongoDB Atlas', err));
const PORT = process.env.PORT || 3001;

// Esta es una función muy simplificada para generar un JWT
const generateJWT = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
};

app.post('/register', async (req, res) => {
  try {
    const { email, password, tmdb } = req.body;

    // Verificar si el usuario ya existe
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    user = new User({ email, password, tmdb });

    // Guardar el usuario en la base de datos
    await user.save();

    // Generar un JWT
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({ message: 'Usuario creado exitosamente', token, tmdbApiKey: user.tmdb });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para autenticación
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar al usuario por su correo electrónico
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar un JWT si las credenciales son correctas
    const payload = { userId: user._id };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    res.json({ message: 'Inicio de sesión exitoso', token, userApiKey: user.tmdb });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
