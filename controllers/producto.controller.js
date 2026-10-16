
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

// GET - Obtener todos los productos
export function obtenerProductos(req, res) {
    const productos = leerArchivo('productos.json');

    res.json(productos);
}

// GET - Obtener un producto por ID
export function obtenerProductoPorId(req, res) {
    const productos = leerArchivo('productos.json');
    const id = parseInt(req.params.id);

    const producto = productos.find(producto => producto.id === id);

    if (!producto) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    res.json(producto);
}

// POST - Crear un producto
export function crearProducto(req, res) {
    const productos = leerArchivo('productos.json');
    const nuevoProducto = req.body;

    productos.push(nuevoProducto);

    guardarArchivo('productos.json', productos);

    res.status(201).json(nuevoProducto);
}

// PUT - Actualizar un producto
export function actualizarProducto(req, res) {
    const productos = leerArchivo('productos.json');
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

    guardarArchivo('productos.json', productos);

    res.json(productos[indice]);
}

// DELETE - Eliminar un producto verificando que no tenga ventas asociadas
export function eliminarProducto(req, res) {
    const productos = leerArchivo('productos.json');
    const ventas = leerArchivo('ventas.json');

    const id = parseInt(req.params.id);

    const indice = productos.findIndex(producto => producto.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    const productoEnVenta = ventas.some(venta =>
        Array.isArray(venta.productos) &&
        venta.productos.some(item =>
            typeof item === 'number'
                ? item === id
                : Number(item.id) === id
        )
    );

    if (productoEnVenta) {
        return res.status(400).json({
            mensaje: 'No se puede eliminar el producto porque está asociado a una venta'
        });
    }

    const productoEliminado = productos.splice(indice, 1)[0];

    guardarArchivo('productos.json', productos);

    res.json({
        mensaje: 'Producto eliminado correctamente',
        producto: productoEliminado
    });
}
