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
        
        res.render('index', { productos: rows });
    });
});

router.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            return console.error('Error al obtener los productos:', err.message);
        }
        
        res.render('products', { productos: rows });
    });
});

export default router;