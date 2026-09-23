import express from 'express';
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

const router = express.Router();

// GET - Obtener todas las ventas
router.get('/', (req, res) => {
    const ventas = leerArchivo('ventas.json');

    res.json(ventas);
});

// GET - Obtener una venta por ID
router.get('/buscar/:id', (req, res) => {
    const ventas = leerArchivo('ventas.json');

    const id = parseInt(req.params.id);

    const venta = ventas.find(venta => venta.id === id);

    if (!venta) {
        return res.status(404).json({
            mensaje: 'Venta no encontrada'
        });
    }

    res.json(venta);
});

// POST - Crear una venta
router.post('/', (req, res) => {
    const {
        id_usuario,
        fecha,
        direccion,
        metodo_pago,
        pagado,
        productos
    } = req.body;

    if (!id_usuario || !fecha || !direccion || !metodo_pago || !productos) {
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    const usuarios = leerArchivo('usuarios.json');
    const productosDB = leerArchivo('productos.json');
    const ventas = leerArchivo('ventas.json');

    const usuarioExiste = usuarios.some(
        usuario => usuario.id === id_usuario
    );

    if (!usuarioExiste) {
        return res.status(404).json({
            mensaje: 'El usuario no existe'
        });
    }

    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            mensaje: 'La venta debe tener al menos un producto'
        });
    }

    const productosValidos = productos.every(idProducto =>
        productosDB.some(producto => producto.id === idProducto)
    );

    if (!productosValidos) {
        return res.status(404).json({
            mensaje: 'Uno o más productos no existen'
        });
    }

    const total = productos.reduce((suma, idProducto) => {
        const producto = productosDB.find(
            producto => producto.id === idProducto
        );

        return suma + producto.precio;
    }, 0);

    const nuevoId = ventas.length > 0
        ? Math.max(...ventas.map(venta => venta.id)) + 1
        : 1;

    const nuevaVenta = {
        id: nuevoId,
        id_usuario,
        fecha,
        direccion,
        metodo_pago,
        total,
        pagado: pagado ?? false,
        productos
    };

    ventas.push(nuevaVenta);

    guardarArchivo('ventas.json', ventas);

    res.status(201).json(nuevaVenta);
});

// PUT - Actualizar una venta
router.put('/:id', (req, res) => {
    const ventas = leerArchivo('ventas.json');

    const id = parseInt(req.params.id);

    const indice = ventas.findIndex(venta => venta.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Venta no encontrada'
        });
    }

    ventas[indice] = {
        ...ventas[indice],
        ...req.body,
        id: ventas[indice].id
    };

    guardarArchivo('ventas.json', ventas);

    res.json(ventas[indice]);
});

// DELETE - Eliminar una venta
router.delete('/:id', (req, res) => {
    const ventas = leerArchivo('ventas.json');

    const id = parseInt(req.params.id);

    const indice = ventas.findIndex(venta => venta.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Venta no encontrada'
        });
    }

    const ventaEliminada = ventas.splice(indice, 1)[0];

    guardarArchivo('ventas.json', ventas);

    res.json({
        mensaje: 'Venta eliminada correctamente',
        venta: ventaEliminada
    });
});

export default router;