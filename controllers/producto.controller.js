
import { Producto } from '../models/producto.js';
import { Venta } from '../models/ventas.js';

// GET - Obtener todos los productos
export async function obtenerProductos(req, res) {
    try {
        const productos = await Producto.find();
        res.json(productos);
    } catch (error) {
        console.error('Error al obtener productos:', error.message);
        res.status(500).json({ mensaje: 'Error al obtener productos' });
    }
}

// GET - Obtener un producto por ID
export async function obtenerProductoPorId(req, res) {
    try {
        const id = parseInt(req.params.id);
        const producto = await Producto.findOne({ id });

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(producto);
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al obtener producto' });
    }
}

// POST - Crear un producto
export async function crearProducto(req, res) {
    try {
        const nuevoProducto = req.body;

        const ultimoProducto = await Producto.findOne().sort({ id: -1 });
        const nuevoId = ultimoProducto ? ultimoProducto.id + 1 : 1;

        const productoCreado = await Producto.create({
            ...nuevoProducto,
            id: nuevoId
        });

        res.status(201).json(productoCreado);

    } catch (error) {
        console.error('Error al crear producto:', error.message);
        res.status(500).json({ mensaje: 'Error al crear producto' });
    }
}

// PUT - Actualizar un producto
export async function actualizarProducto(req, res) {
    try {
        const id = parseInt(req.params.id);

        // No permitimos modificar el ID del producto
        const { id: idEnviado, ...datosActualizados } = req.body;

        const productoActualizado = await Producto.findOneAndUpdate(
            { id },
            { $set: datosActualizados },
            {
                new: true,
                runValidators: true
            }
        );

        if (!productoActualizado) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        res.json(productoActualizado);

    } catch (error) {
        console.error('Error al actualizar producto:', error.message);
        res.status(500).json({ mensaje: 'Error al actualizar producto' });
    }
}

// DELETE - Eliminar un producto verificando que no tenga ventas asociadas
export async function eliminarProducto(req, res) {
    try {
        const id = parseInt(req.params.id);

        const producto = await Producto.findOne({ id });

        if (!producto) {
            return res.status(404).json({
                mensaje: 'Producto no encontrado'
            });
        }

        const productoEnVenta = await Venta.exists({
            'productos.id': id
        });

        if (productoEnVenta) {
            return res.status(400).json({
                mensaje: 'No se puede eliminar el producto porque está asociado a una venta'
            });
        }

        await Producto.deleteOne({ id });

        res.json({
            mensaje: 'Producto eliminado correctamente',
            producto
        });

    } catch (error) {
        console.error('Error al eliminar producto:', error.message);
        res.status(500).json({ mensaje: 'Error al eliminar producto' });
    }
}
