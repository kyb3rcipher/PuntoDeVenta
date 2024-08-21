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
        
        res.render('products/index', { productos: rows });
    });
});

router.get('/productos/crear', (req, res) => {
    res.render('products/crear');
});
router.post('/productos/crear', (req, res) => {
    const { nombre, precio, proveedor, tipo, codigo } = req.body;
    const codigosArray = JSON.stringify(codigo);
    
    db.run('INSERT INTO productos (nomabre, precio, tipo, codigo, proveedor) VALUES (?, ?, ?, ?, ?)', [nombre, precio, tipo, codigosArray, proveedor], (err) => {
        if (err) {
            console.error('Error al guardar el producto', err.message);
            res.status(500).send('Error al guardar el producto');
            return;
        }
        res.redirect('/productos');
    });
});

export default router;