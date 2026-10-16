import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

// GET - Obtener todas las ventas
export function obtenerVentas(req, res) {
const ventas = leerArchivo('ventas.json');
res.json(ventas);
}

// GET - Obtener una venta por ID
export function obtenerVentaPorId(req, res) {
const ventas = leerArchivo('ventas.json');
const id = parseInt(req.params.id);
const venta = ventas.find(venta => venta.id === id);

if (!venta) {
    return res.status(404).json({
        mensaje: 'Venta no encontrada'
    });
}

res.json(venta);

}

// POST - Crear una venta
export function crearVenta(req, res) {
const {
id_usuario,
fecha,
direccion,
metodo_pago,
pagado,
productos
} = req.body;

if (
    !id_usuario ||
    !fecha ||
    !direccion?.trim() ||
    !['Efectivo', 'Transferencia', 'Tarjeta'].includes(metodo_pago) ||
    !Array.isArray(productos) ||
    productos.length === 0
) {
    return res.status(400).json({
        mensaje: 'Faltan datos obligatorios o productos en la venta'
    });
}

const usuarios = leerArchivo('usuarios.json');
const productosDB = leerArchivo('productos.json');
const ventas = leerArchivo('ventas.json');

const usuarioExiste = usuarios.some(
    usuario => usuario.id === Number(id_usuario)
);

if (!usuarioExiste) {
    return res.status(404).json({
        mensaje: 'El usuario no existe'
    });
}

// Validar productos y cantidades
for (const item of productos) {
    if (
        !Number.isInteger(Number(item.id)) ||
        !Number.isInteger(Number(item.cantidad)) ||
        Number(item.cantidad) <= 0
    ) {
        return res.status(400).json({
            mensaje: 'Cada producto debe tener un ID válido y una cantidad mayor a cero'
        });
    }

    const productoExiste = productosDB.some(
        producto => producto.id === Number(item.id)
    );

    if (!productoExiste) {
        return res.status(404).json({
            mensaje: `No existe el producto con ID ${item.id}`
        });
    }
}

// Calcular el total segun el precio y la cantidad
const total = productos.reduce((suma, item) => {
    const producto = productosDB.find(
        producto => producto.id === Number(item.id)
    );

    return suma + producto.precio * Number(item.cantidad);
}, 0);

// Guardar solamente el ID y la cantidad de cada producto
const productosVenta = productos.map(item => ({
    id: Number(item.id),
    cantidad: Number(item.cantidad)
}));

const nuevoId = ventas.length > 0
    ? Math.max(...ventas.map(venta => venta.id)) + 1
    : 1;

const nuevaVenta = {
    id: nuevoId,
    id_usuario: Number(id_usuario),
    fecha,
    direccion: direccion.trim(),
    metodo_pago,
    total,
    pagado: pagado ?? false,
    productos: productosVenta
};

ventas.push(nuevaVenta);
guardarArchivo('ventas.json', ventas);

res.status(201).json({
    mensaje: 'Venta registrada correctamente',
    venta: nuevaVenta
});

}

// PUT - Actualizar una venta
export function actualizarVenta(req, res) {
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

}

// DELETE - Eliminar una venta
export function eliminarVenta(req, res) {
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

}