import bcrypt from 'bcrypt';
import mySQLConnector from './MySQLConnector.js';

const connection = mySQLConnector;

class Usuario {
  constructor({ id, nombre, apellido, email, password, userApiKey, imagen }) {
    this.id = id;
    this.nombre = nombre;
    this.apellido = apellido;
    this.email = email;
    this.password = password;
    this.userApiKey = userApiKey;
    this.imagen = imagen;
  }

  async save() {
    try {
      const hashedPassword = await bcrypt.hash(this.password, 10);
      const sql = 'INSERT INTO usuarios (id, nombre, apellido, email, password, userApiKey, imagen) VALUES (?, ?, ?, ?, ?, ?, ?)';
      connection.query(sql, [this.id, this.nombre, this.apellido, this.email, hashedPassword, this.userApiKey, this.imagen], (err, results) => {
        if (err) {
          console.error('Error al guardar usuario en MySQL:', err);
          return;
        }
        console.log('Usuario guardado en MySQL:', this.email);
      });
    } catch (error) {
      console.error('Error al guardar usuario en MySQL:', error);
    }
  }
}

export default Usuario;
