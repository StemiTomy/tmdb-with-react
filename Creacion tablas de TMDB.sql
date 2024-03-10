CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    tmdb_api_key VARCHAR(255) UNIQUE NOT NULL,
    imagen BLOB -- puede contener datos binarios, como imágenes, documentos PDF, etc.
);
CREATE TABLE IF NOT EXISTS peliculas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    tmdb_id INT UNIQUE
);
CREATE TABLE IF NOT EXISTS usuarios_peliculas (
    usuario_id INT,
    pelicula_id INT,
    PRIMARY KEY (usuario_id, pelicula_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (pelidicula_id) REFERENCES peliculas(id)
);
