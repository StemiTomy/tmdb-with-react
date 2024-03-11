import express from 'express';
import jwt from 'jsonwebtoken';
import bodyParser from 'body-parser';
import User from './Usuario.js';
import cors from 'cors';
import mongoose from 'mongoose'; // no vamos a usar mongo db.
import mysql from 'mysql';
import mySQLConnector from './MySQLConnector.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

const app = express();
app.use(cors());
app.use(bodyParser.json());
dotenv.config();

const connection = mySQLConnector;

const PORT = process.env.PORT || 3001;

// Esta es una función muy simplificada para generar un JWT
const generateJWT = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '24h' });
};

const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // 'Bearer TOKEN'
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
};

app.post('/register', async (req, res) => {
  try {
    const { email, password, tmdb } = req.body;

    // Verificar si el usuario ya existe
    const [existingUser] = await connection.getConnection().promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] = await connection.getConnection().promise().query('INSERT INTO usuarios (email, password, tmdb_api_key) VALUES (?, ?, ?)', [email, hashedPassword, tmdb]);

    const userId = newUser.insertId;
    const payload = { userId };
    const token = generateJWT(payload);
    res.status(201).json({ message: 'Usuario creado exitosamente', token, tmdbApiKey: tmdb });
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
    const [results] = await connection.getConnection().promise().query('SELECT * FROM usuarios WHERE email = ?', [email]);
    if (results.length === 0) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Comparar la contraseña proporcionada con la almacenada en la base de datos
    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar un JWT si las credenciales son correctas
    const payload = { userId: user.id };
    const token = generateJWT(payload);
    res.json({ message: 'Inicio de sesión exitoso', token, tmdb_api_key: user.tmdb_api_key });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);
    res.status(500).send('Error en el servidor');
  }
});


app.post('/favorites', authMiddleware, async (req, res) => {
  const { movieId, movieTitle } = req.body;
  const userId = req.user.userId;

  try {
    // Verificar si la película ya está en la base de datos local
    const [existingMovie] = await connection.getConnection().promise().query('SELECT id FROM peliculas WHERE tmdb_id = ?', [movieId]);

    let movieIdInDB;
    if (existingMovie.length === 0) {
      // La película no está en la base de datos local, agregarla
      const [result] = await connection.getConnection().promise().query('INSERT INTO peliculas (nombre, tmdb_id) VALUES (?, ?)', [movieTitle, movieId]);
      movieIdInDB = result.insertId;
    } else {
      // La película ya está en la base de datos local, obtener su ID
      movieIdInDB = existingMovie[0].id;
    }

    // Insertar la relación usuario-película
    await connection.getConnection().promise().query('INSERT INTO usuarios_peliculas (usuario_id, pelicula_id) VALUES (?, ?)', [userId, movieIdInDB]);

    res.status(200).send('Película añadida a favoritos');
  } catch (error) {
    console.error('Error al guardar la película como favorita:', error);
    res.status(500).send('Error en el servidor');
  }
});


app.post('/api/user/watchlater', authMiddleware, (req, res) => {
  const { movieId } = req.body;
  const userId = req.user.userId;

  connection.getConnection().promise().query('INSERT INTO user_watch_later (user_id, movie_id) VALUES (?, ?)', [userId, movieId], (err, results) => {
    if (err) {
      console.error('Error al añadir película a ver más tarde:', err);
      res.status(500).send('Error en el servidor');
      return;
    }
    res.status(200).send('Película añadida a ver más tarde');
  });
});


// Después de todas tus rutas de API
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('dist'));
  app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
