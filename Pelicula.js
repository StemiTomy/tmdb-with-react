import mySQLConnector from './MySQLConnector.js';

const connection = mySQLConnector;

class Pelicula {
    constructor({ id, nombre }) {
        this.id = id;
        this.nombre = nombre;
    }

    async save() {
        try {
            const sql = 'INSERT INTO peliculas (nombre) VALUES (?)';
            connection.query(sql, [this.nombre], (err, results) => {
                if (err) {
                    console.error('Error al guardar película en MySQL:', err);
                    return;
                }
                console.log('Película guardada en MySQL:', this.nombre);
            });
        } catch (error) {
            console.error('Error al guardar película en MySQL:', error);
        }
    }

    async addToFavorites(usuarioId) {
        try {
            const sql = 'INSERT INTO usuarios_peliculas (usuario_id, pelicula_id) VALUES (?, (SELECT id FROM peliculas WHERE nombre = ?))';
            connection.query(sql, [usuarioId, this.nombre], (err, results) => {
                if (err) {
                    console.error('Error al agregar película a favoritos:', err);
                    return;
                }
                console.log('Película agregada a favoritos:', this.nombre);
            });
        } catch (error) {
            console.error('Error al agregar película a favoritos:', error);
        }
    }

    static async getFavorites(usuarioId) {
        try {
            const sql = 'SELECT peliculas.nombre FROM peliculas INNER JOIN usuarios_peliculas ON peliculas.id = usuarios_peliculas.pelicula_id WHERE usuarios_peliculas.usuario_id = ?';
            connection.query(sql, [usuarioId], (err, results) => {
                if (err) {
                    console.error('Error al obtener películas favoritas:', err);
                    return;
                }
                console.log('Películas favoritas del usuario:', results);
            });
        } catch (error) {
            console.error('Error al obtener películas favoritas:', error);
        }
    }
}

export default Pelicula;