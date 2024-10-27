import { abrir } from './databaseHelper.js';

const db = abrir();

function crearTablas(db, callback) {
    db.run(`CREATE TABLE IF NOT EXISTS productos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        codigos TEXT NOT NULL,
        tipo VARCHAR(20) NOT NULL,
        nombre VARCHAR(20) NOT NULL,
        precio_costo TEXT NOT NULL,
        precio_venta TEXT NOT NULL,
        ganancia TEXT NOT NULL,
        proveedor VARCHAR(20),
        FOREIGN KEY (proveedor) REFERENCES proveedores(nombre)
    )`, (err) => {
        if (err) {
            return console.error('Error al crear la tabla productos:', err.message);
        }
        console.log('Tabla productos creada con éxito.');

        db.run(`CREATE TABLE IF NOT EXISTS proveedores (
            nombre VARCHAR(20) NOT NULL
        )`, (err) => {
            if (err) {
                return console.error('Error al crear la tabla proveedores:', err.message);
            }
            console.log('Tabla proveedores creada con éxito.');

            db.run(`CREATE TABLE IF NOT EXISTS ventas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                productos VARCHAR(255),
                pago INTEGER,
                fecha_creacion TEXT DEFAULT CURRENT_TIMESTAMP
            )`, (err) => {
                if (err) {
                    return console.error('Error al crear la tabla ventas:', err.message);
                }
                console.log('Tabla ventas creada con éxito.');

                // Llamamos al callback para continuar con las inserciones una vez que las tablas estén listas
                callback();
            });
        });
    });
}

function insertarProveedores(db, callback) {
    db.run(`INSERT INTO proveedores VALUES
        ('Coca Cola'),
        ('Big Cola'),
        ('Frijoleria?'),
        ('Maruchan?'),
        ('Tortilleria'),
        ('Sabritas')
    ;`, (err) => {
        if (err) {
            return console.error('Error al insertar proveedores:', err.message);
        }
        console.log('Inserción de proveedores hecha con éxito.');

        // Llamamos al callback para continuar con la inserción de productos de ejemplo
        callback();
    });
}

function insertarProductosEjemplo(db) {
    db.run(`INSERT INTO productos (codigos, tipo, nombre, precio_costo, precio_venta, ganancia, proveedor) VALUES
        ('["CODE", "CODE2"]', 'IDK', 'Coca Cola 500ml', '40.00', '20.00', '10', 'Coca Cola'),
        ('["CODE", "CODE2"]', 'IDK', 'Big Cola 500ml', '40.00', '10.00', '10', 'Big Cola'),
        ('["CODE", "CODE2"]', 'IDK', 'Frijoles', '40.00', '30.00', '10', 'Frijoleria?'),
        ('["CODE", "CODE2"]', 'IDK', 'Maruchan', '40.00', '15.50', '10', 'Maruchan?'),
        ('["CODE", "CODE2"]', 'IDK', 'Tortillas', '40.00', '90.50', '10', 'Tortilleria'),
        ('["CODE", "CODE2"]', 'IDK', 'Sabritas', '40.00', '20.00', '10', 'Sabritas')
    ;`, (err) => {
        if (err) {
            return console.error('Error al insertar productos ejemplo:', err.message);
        }
        console.log('Inserción de productos ejemplo hecha con éxito.');
    });
}

// Llamada a las funciones en cadena
crearTablas(db, () => {
    insertarProveedores(db, () => {
        insertarProductosEjemplo(db);
    });
});