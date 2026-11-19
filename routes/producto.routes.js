
import express from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';

import {
    obtenerProductos,
    obtenerProductoPorId,
    crearProducto,
    actualizarProducto,
    eliminarProducto
} from '../controllers/producto.controller.js';

const router = express.Router();

// GET - Obtener todos los productos (público)
router.get('/', obtenerProductos);

// GET - Obtener un producto por ID (público)
router.get('/buscar/:id', obtenerProductoPorId);

// POST - Crear un producto (requiere autenticación)
router.post('/', verificarToken, crearProducto);

// PUT - Actualizar un producto (requiere autenticación)
router.put('/:id', verificarToken, actualizarProducto);

// DELETE - Eliminar un producto (requiere autenticación)
router.delete('/:id', verificarToken, eliminarProducto);

export default router;
