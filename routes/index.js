import {Router} from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import database from '../database/databaseHelper.js';

// Configure router and database
const router = Router();
const db = database.abrir();

async function getProveedores() {
    return new Promise((resolve, reject) => {
        db.all('SELECT * FROM proveedores', [], (err, rows) => {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        });
    });
}

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

router.post('/registrar-venta', (req, res) => {
    const { productos, pago } = req.body;
    
    db.run(`INSERT INTO ventas (productos, pago) VALUES (?, ?)`, [JSON.stringify(productos), pago], (err) => {
        if (err) {
            return res.status(500).json({ message: 'Error al registrar la venta', error: err.message });
        }
        res.status(200).json({ message: 'Venta registrada con éxito' });
    })
});

router.get('/productos', (req, res) => {
    db.all('SELECT * FROM productos', [], (err, rows) => {
        if (err) {
            return console.error('Error al obtener los productos:', err.message);
        }
        
        res.render('products/index', { productos: rows });
    });
});

router.get('/productos/editar/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const proveedores = await getProveedores();
        
        
        db.get('SELECT * FROM productos WHERE id = ?', [id], (err, product) => {
            if (err) {
                console.error('Error al consultar la base de datos:', err.message);
                return res.status(500).send('Error al consultar la base de datos');
            }

            if (!product) {
                return res.status(404).send('Producto no encontrado');
            }
            
            res.render('products/producto', {
                renderType: 'edit',
                producto: product,
                proveedores: proveedores
            });
        });
    } catch (err) {
        console.error('Error al obtener proveedores:', err.message);
        res.status(500).send('Error al obtener proveedores');
    }
});
router.post('/productos/editar/:id', upload.single('imagen'), (req, res) => {
    const id = req.params.id;
    const { nombre, precio_costo, precio_venta, ganancia, proveedor, tipo, codigo } = req.body;
    const codigosArray = JSON.stringify(codigo);

    db.run('UPDATE productos SET nombre = ?, precio_costo = ?, precio_venta = ?, ganancia = ?, tipo = ?, codigos = ?, proveedor = ? WHERE id = ?', [nombre, precio_costo, precio_venta, ganancia, tipo, codigosArray, proveedor, id], (err) => {
        if (err) {
            console.error('Error al actualizar el producto', err.message);
            res.status(500).send('Error al aztualizar el producto');
            return;
        }
        res.redirect('/productos');
    });
});

router.get('/productos/crear', async (req, res) => {
    try {
        const proveedores = await getProveedores();
        res.render('products/producto', { renderType: 'create', proveedores: proveedores });
    } catch (err) {
        console.error('Error al obtener proveedores:', err.message);
        res.status(500).send('Error al obtener proveedores');
    }
});

router.post('/productos/crear', upload.single('imagen'), (req, res) => {
    const { nombre, precio_costo, precio_venta, ganancia, proveedor, tipo, codigo } = req.body;
    const codigosArray = JSON.stringify(codigo);

    db.run('INSERT INTO productos (nombre, precio_costo, precio_venta, ganancia, tipo, codigos, proveedor) VALUES (?, ?, ?, ?, ?, ?, ?)', [nombre, precio_costo, precio_venta, ganancia, tipo, codigosArray, proveedor], (err) => {
        if (err) {
            console.error('Error al guardar el producto', err.message);
            res.status(500).send('Error al guardar el producto');
            return;
        }
        res.redirect('/productos');
    });
});

/*************** PROVEEDORES ***************/
router.get('/proveedores', (req, res) => {
    db.all('SELECT * FROM proveedores', [], (err, rows) => {
        if (err) {
            return console.error('Error al obtener los productos:', err.message);
        }
        
        res.render('proveedores/index', { proveedores: rows });
    });
});

router.get('/proveedores/crear', (req, res) => {
    res.render('proveedores/proveedor', { renderType: 'create' });
});
router.post('/proveedores/crear', (req, res) => {
    const nombre = req.body.nombre;

    db.run('INSERT INTO proveedores VALUES (?)', nombre, (err) => {
        if (err) {
            console.error('Error al crear el proveedor', err.message);
            res.status(500).send('Error al crear el producto' + req.body);
            return;
        }
        res.redirect('/proveedores');
    });
});

router.get('/proveedores/editar/:nombre', (req, res) => {
    const nombre = req.params.nombre;

    db.get('SELECT * FROM proveedores WHERE nombre = ?', nombre, (err, proveedor) => {
        res.render('proveedores/proveedor', { proveedor: proveedor, renderType: 'edit' });
    });
});
router.post('/proveedores/editar/:nombre', (req, res) => {
    const oldNombre = req.params.nombre,
        newNombre = req.body.nombre;

    db.run('UPDATE proveedores SET nombre = ? WHERE nombre = ?', [ newNombre, oldNombre ], (err) => {
        if (err) {
            console.error('Error al actualizar el proveedor:', err.message);
        }
        res.redirect(`/proveedores/editar/${newNombre}`);
    });
});

router.delete('/proveedores/eliminar', (req, res) => {
    const nombre = req.body.nombre;

    db.run('DELETE FROM proveedores WHERE nombre = ?', nombre, (err) => {
        if (err) {
            console.error('Error al eliminar el proveedor', err.message);
            res.status(500).send('Error al eliminar el proveedor');
            return;
        }
        res.status(200).send('Proveedor eliminado exitosamente');
    });
});



export default router;