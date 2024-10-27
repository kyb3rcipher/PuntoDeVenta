import sqlite3 from 'sqlite3';
import fs from 'fs';

export function abrir() {
    if (!fs.existsSync('database/database.db')) {
        console.log('La base de datos no existe. Creando...');
        const db = new sqlite3.Database('database/database.db', (err) => {
            if (err) {
                return console.error('Error al abrir la base de datos:', err.message);
            }
            console.log('Base de datos creada con éxito.');
        });

        return db;
    } else {
        return new sqlite3.Database('database/database.db', (err) => {
            if (err) {
                return console.error('Error al abrir la base de datos:', err.message);
            }
            console.log('Abriendo base de datos SQLite.');
        });
    }
}

export default { abrir };