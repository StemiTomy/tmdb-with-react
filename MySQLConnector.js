import mysql from 'mysql2';
import dotenv from 'dotenv';

dotenv.config();

class MySQLConnector {
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      ssl: {
        rejectUnauthorized: true // Rechazar conexiones no autorizadas
        // Otros parámetros SSL/TLS si es necesario
      }
    });
  }

  connect() {
    this.connection.connect((err) => {
      if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
      }
      console.log('Connected to MySQL');
    });
  }

  getConnection() {
    return this.connection;
  }
}

const mySQLConnector = new MySQLConnector();

export default mySQLConnector;
