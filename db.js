import sqlite3 from 'sqlite3';
import fs from 'fs';

function abrir() {
    if (!fs.existsSync('./database.db')) {
        console.log('La base de datos no existe. Creando...');
        const db = new sqlite3.Database('./database.db', (err) => {
            if (err) {
                return console.error('Error al abrir la base de datos:', err.message);
            }
            console.log('Base de datos creada con éxito.');
        });
        crearTablas(db);
        insertarProductosEjemplo(db);

        return db;
    } else {
        return new sqlite3.Database('./database.db', (err) => {
            if (err) {
                return console.error('Error al abrir la base de datos:', err.message);
            }
            console.log('Abriendo base de datos SQLite.');
        });
    }
}

function crearTablas(db) {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        nombre VARCHAR(20) NOT NULL,
        precio TEXT NOT NULL
    )`, (err) => {
        if (err) {
            return console.error('Error al crear la tabla productos:', err.message);
        }
        console.log('Tabla productos creada con éxito.');
    });
}

function insertarProductosEjemplo(db) {
    db.run(`INSERT INTO productos (nombre, precio) VALUES
        ('Coca Cola 500ml', '20.00'),
        ('Big Cola 500ml', '10.00'),
        ('Frijoles', '30.00'),
        ('Maruchan', '15.50'),
        ('Tortillas', '90.50'),
        ('Sabritas', '20.00')
    ;`, (err) => {
        if (err) {
            return console.error('Error al insertar productos ejemplo:', err.message);
        }
        console.log('Inserción de productos ejemplo hecha con éxito.');
    });
}
//insertarProductosEjemplo(abrir());

export default { abrir };