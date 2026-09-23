import express from 'express';
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

const router = express.Router();

const rutaProductos = './data/productos.json';

// GET - Obtener todos los productos
router.get('/', (req, res) => {
    const productos = leerArchivo(rutaProductos);
    res.json(productos);
});

// GET - Obtener un producto por ID
router.get('/:id', (req, res) => {
    const productos = leerArchivo(rutaProductos);

    const id = parseInt(req.params.id);

    const producto = productos.find(producto => producto.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.json(producto);
});

// POST - Crear un producto
router.post('/', (req, res) => {
    const productos = leerArchivo(rutaProductos);

    const nuevoProducto = req.body;

    productos.push(nuevoProducto);

    guardarArchivo(rutaProductos, productos);

    res.status(201).json(nuevoProducto);
});

// PUT - Actualizar un producto
router.put('/:id', (req, res) => {
    const productos = leerArchivo(rutaProductos);

    const id = parseInt(req.params.id);

    const indice = productos.findIndex(producto => producto.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    productos[indice] = {
        ...productos[indice],
        ...req.body
    };

    guardarArchivo(rutaProductos, productos);

    res.json(productos[indice]);
});

// DELETE - Eliminar un producto verificando que no tenga ventas asociadas
router.delete('/:id', (req, res) => {
    const productos = leerArchivo(rutaProductos);
    const ventas = leerArchivo('./data/ventas.json');

    const id = parseInt(req.params.id);

    const indice = productos.findIndex(producto => producto.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    const productoEnVenta = ventas.some(venta =>
        venta.productos.includes(id)
    );

    if (productoEnVenta) {
        return res.status(400).json({
            mensaje: 'No se puede eliminar el producto porque está asociado a una venta'
        });
    }

    const productoEliminado = productos.splice(indice, 1)[0];

    guardarArchivo(rutaProductos, productos);

    res.json({
        mensaje: 'Producto eliminado correctamente',
        producto: productoEliminado
    });
});


export default router;