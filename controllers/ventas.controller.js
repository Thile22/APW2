
import { Venta } from '../models/ventas.js';
import { Usuario } from '../models/usuario.js';
import { Producto } from '../models/producto.js';

// GET - Obtener las ventas del usuario autenticado
export async function obtenerVentas(req, res) {
    try {
        const ventas = await Venta.find({
            id_usuario: req.usuario.id
        });

        res.json(ventas);
    } catch (error) {
        console.error('Error al obtener ventas:', error.message);
        res.status(500).json({
            mensaje: 'Error al obtener ventas'
        });
    }
}

// GET - Obtener una venta propia por ID
export async function obtenerVentaPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        const venta = await Venta.findOne({
            id,
            id_usuario: req.usuario.id
        });
        if (!venta) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }
        res.json(venta);
    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener venta'
        });
    }
}

// POST - Crear una venta
export async function crearVenta(req, res) {
    try {
        const {
            fecha,
            direccion,
            metodo_pago,
            pagado,
            productos
        } = req.body;

        // El ID del usuario proviene del token JWT
        const id_usuario = req.usuario.id;

        if (
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

        const usuarioExiste = await Usuario.exists({
            id: id_usuario,
            activo: true
        });

        if (!usuarioExiste) {
            return res.status(404).json({
                mensaje: 'El usuario no existe o está inactivo'
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
        }

        const idsProductos = [
            ...new Set(productos.map(item => Number(item.id)))
        ];

        const productosDB = await Producto.find({
            id: { $in: idsProductos }
        });

        if (productosDB.length !== idsProductos.length) {
            return res.status(404).json({
                mensaje: 'Uno o más productos no existen'
            });
        }

        // Calcular el total según el precio y la cantidad
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

        const ultimaVenta = await Venta.findOne().sort({ id: -1 });
        const nuevoId = ultimaVenta ? ultimaVenta.id + 1 : 1;

        const nuevaVenta = await Venta.create({
            id: nuevoId,
            id_usuario,
            fecha,
            direccion: direccion.trim(),
            metodo_pago,
            total,
            pagado: pagado ?? false,
            productos: productosVenta
        });

        res.status(201).json({
            mensaje: 'Venta registrada correctamente',
            venta: nuevaVenta
        });

    } catch (error) {
        console.error('Error al crear venta:', error.message);
        res.status(500).json({ mensaje: 'Error al registrar la venta' });
    }
}


// PUT - Actualizar una venta propia
export async function actualizarVenta(req, res) {
    try {
        const id = parseInt(req.params.id);

        // Busca la venta perteneciente al usuario autenticado
        const venta = await Venta.findOne({
            id,
            id_usuario: req.usuario.id
        });

        if (!venta) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        // Evitar modificar datos que no deben cambiarse
        const { direccion, metodo_pago, pagado } = req.body;

        if (direccion !== undefined) {
            if (!direccion.trim()) {
                return res.status(400).json({
                    mensaje: 'La dirección no puede estar vacía'
                });
            }
            venta.direccion = direccion.trim();
        }

        if (metodo_pago !== undefined) {
            if (!['Efectivo', 'Transferencia', 'Tarjeta'].includes(metodo_pago)) {
                return res.status(400).json({
                    mensaje: 'Método de pago inválido'
                });
            }
            venta.metodo_pago = metodo_pago;
        }

        if (pagado !== undefined) {
            if (typeof pagado !== 'boolean') {
                return res.status(400).json({
                    mensaje: 'El estado de pago debe ser verdadero o falso'
                });
            }
            venta.pagado = pagado;
        }

        await venta.save();

        res.json({
            mensaje: 'Venta actualizada correctamente',
            venta
        });

    } catch (error) {
        console.error('Error al actualizar venta:', error.message);
        res.status(500).json({
            mensaje: 'Error al actualizar venta'
        });
    }
}

// DELETE - Eliminar una venta propia
export async function eliminarVenta(req, res) {
    try {
        const id = parseInt(req.params.id);

        const ventaEliminada = await Venta.findOneAndDelete({
            id,
            id_usuario: req.usuario.id
        });

        if (!ventaEliminada) {
            return res.status(404).json({
                mensaje: 'Venta no encontrada'
            });
        }

        res.json({
            mensaje: 'Venta eliminada correctamente',
            venta: ventaEliminada
        });

    } catch (error) {
        console.error('Error al eliminar venta:', error.message);
        res.status(500).json({
            mensaje: 'Error al eliminar venta'
        });
    }
}
