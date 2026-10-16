import express from 'express';

import {
obtenerProductos,
obtenerProductoPorId,
crearProducto,
actualizarProducto,
eliminarProducto
} from '../controllers/producto.controller.js';

const router = express.Router();

// GET - Obtener todos los productos
router.get('/', obtenerProductos);

// GET - Obtener un producto por ID
router.get('/', obtenerProductoPorId);

// POST - Crear un producto
router.post('/', crearProducto);

// PUT - Actualizar un producto
router.put('/', actualizarProducto);

// DELETE - Eliminar un producto
router.delete('/', eliminarProducto);

export default router;