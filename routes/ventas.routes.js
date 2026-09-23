import express from 'express';
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

const router = express.Router();

const rutaVentas = './data/ventas.json';

// GET - Obtener todas las ventas
router.get('/', (req, res) => {
    const ventas = leerArchivo(rutaVentas);
    res.json(ventas);
});

// GET - Obtener una venta por ID
router.get('/buscar/:id', (req, res) => {
    const ventas = leerArchivo(rutaVentas);

    const id = Number(req.params.id);

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
    const { id_usuario, fecha, direccion, metodo_pago, pagado, productos } = req.body;

    // Verificar datos obligatorios
    if (!id_usuario || !fecha || !direccion || !metodo_pago || !productos) {
        return res.status(400).json({
            mensaje: 'Faltan datos obligatorios'
        });
    }

    const usuarios = leerArchivo('./data/usuarios.json');
    const productosDB = leerArchivo('./data/productos.json');
    const ventas = leerArchivo(rutaVentas);

    // Verificar que el usuario exista
    const usuarioExiste = usuarios.some(usuario => usuario.id === id_usuario);

    if (!usuarioExiste) {
        return res.status(404).json({
            mensaje: 'El usuario no existe'
        });
    }

    // Verificar que se haya enviado al menos un producto
    if (!Array.isArray(productos) || productos.length === 0) {
        return res.status(400).json({
            mensaje: 'La venta debe tener al menos un producto'
        });
    }

    // Verificar que todos los productos existan
    const productosValidos = productos.every(idProducto =>
        productosDB.some(producto => producto.id === idProducto)
    );

    if (!productosValidos) {
        return res.status(404).json({
            mensaje: 'Uno o más productos no existen'
        });
    }

    // Calcular el total
    const total = productos.reduce((suma, idProducto) => {
        const producto = productosDB.find(producto => producto.id === idProducto);
        return suma + producto.precio;
    }, 0);

    // Generar nuevo ID
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

    guardarArchivo(rutaVentas, ventas);

    res.status(201).json(nuevaVenta);
});

// PUT - Actualizar una venta
router.put('/:id', (req, res) => {
    const ventas = leerArchivo(rutaVentas);

    const id = Number(req.params.id);

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

    guardarArchivo(rutaVentas, ventas);

    res.json(ventas[indice]);
});

// DELETE - Eliminar una venta
router.delete('/:id', (req, res) => {
    const ventas = leerArchivo(rutaVentas);

    const id = Number(req.params.id);

    const indice = ventas.findIndex(venta => venta.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Venta no encontrada'
        });
    }

    const ventaEliminada = ventas.splice(indice, 1)[0];

    guardarArchivo(rutaVentas, ventas);

    res.json({
        mensaje: 'Venta eliminada correctamente',
        venta: ventaEliminada
    });
});

export default router;