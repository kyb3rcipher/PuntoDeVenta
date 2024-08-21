import {Router} from 'express';
import sqlite3 from 'sqlite3';
import database from '../db.js';

const router = Router();
const db = database.abrir();

router.get('/', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            return console.error('Error al obtener los productos:', err.message);
        }
        
        // Render the view and pass the products row as objects array
        res.render('index', { productos: rows });
    });
});

export default router;