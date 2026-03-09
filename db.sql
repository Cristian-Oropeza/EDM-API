-- Crear la base de datos
CREATE DATABASE IF NOT EXISTS nestjs_tasks_db;
USE nestjs_tasks_db;

-- Tabla de usuarios
CREATE TABLE User (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    lastName VARCHAR(300) NOT NULL,
    username VARCHAR(100) NOT NULL DEFAULT '',
    password LONGTEXT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Tabla de tareas
CREATE TABLE Task (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description LONGTEXT NOT NULL,
    priority BOOLEAN NOT NULL,
    user_id INT NOT NULL,
    createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    CONSTRAINT Task_user_id_fkey FOREIGN KEY (user_id) REFERENCES User(id)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Insertar datos de prueba
INSERT INTO User (name, lastName, username, password) 
VALUES ('Cristian', 'Oropeza', '', '');

INSERT INTO Task (name, description, priority, user_id)
VALUES 
    ('MongoDB', 'Instalar Shell de MongoDB', TRUE, 1),
    ('App FLASK', 'App en flask que integre 3 APIs', FALSE, 1);