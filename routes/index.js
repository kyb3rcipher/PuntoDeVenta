import {Router} from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import database from '../db.js';

// Configure router and database
const router = Router();
const db = database.abrir();

// Configure multer for files upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'resources/images/products/';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const nombre = req.body.nombre || 'producto';
        const ext = path.extname(file.originalname);

        // Convertir el nombre a minúsculas y reemplazar espacios con guiones
        const sanitizedFileName = nombre.toLowerCase().replace(/\s+/g, '-') + ext;

        cb(null, sanitizedFileName);
    }
});
const upload = multer({ storage });

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

router.get('/productos/editar/:id', (req, res) => {
    const id = req.params.id;
    
    db.get('SELECT * FROM productos WHERE id = ?', [id], (err, product) => {
        if (err) {
            console.error('Error al consultar la base de datos:', err,message);
            return res.status(500).send('Error al consultar la base de datos');
        }

        if (!product) {
            return res.status(404).send('Producto no encontrado');
        }
        
        res.render('products/producto', {
            renderType: 'edit',
            id: product.id,
            nombre: product.nombre,
            precioCosto: product.precio_costo,
            precioVenta: product.precio_venta,
            ganancia: product.ganancia,
            tipo: product.tipo,
            proveedor: product.proveedor,
            codigos: product.codigo,
            grupo: product.grupo,
            imagen: product.imagen
        });
    });
});
router.post('/productos/editar/:id', upload.single('imagen'), (req, res) => {
    const id = req.params.id;
    const { nombre, precio, proveedor, tipo, codigo } = req.body;
    const codigosArray = JSON.stringify(codigo);

    db.run('UPDATE productos SET nombre = ?, precio = ?, tipo = ?, codigo = ?, proveedor = ? WHERE id = ?', [nombre, precio, tipo, codigosArray, proveedor, id], (err) => {
        if (err) {
            console.error('Error al actualizar el producto', err.message);
            res.status(500).send('Error al aztualizar el producto');
            return;
        }
        res.redirect('/productos');
    });
});

router.get('/productos/crear', (req, res) => {
    res.render('products/producto', { renderType: 'create' });
});
router.post('/productos/crear', upload.single('imagen'), (req, res) => {
    const { nombre, precio, proveedor, tipo, codigo } = req.body;
    const codigosArray = JSON.stringify(codigo);

    db.run('INSERT INTO productos (nombre, precio, tipo, codigo, proveedor) VALUES (?, ?, ?, ?, ?)', [nombre, precio, tipo, codigosArray, proveedor], (err) => {
        if (err) {
            console.error('Error al guardar el producto', err.message);
            res.status(500).send('Error al guardar el producto');
            return;
        }
        res.redirect('/productos');
    });
});

export default router;