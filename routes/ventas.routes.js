import express from 'express';

import {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    actualizarVenta,
    eliminarVenta
} from '../controllers/ventas.controller.js';

const router = express.Router();

// GET - Obtener todas las ventas
router.get('/', obtenerVentas);

// GET - Obtener una venta por ID
router.get('/buscar/:id', obtenerVentaPorId);

// POST - Crear una venta
router.post('/', crearVenta);

// PUT - Actualizar una venta
router.put('/:id', actualizarVenta);

// DELETE - Eliminar una venta
router.delete('/:id', eliminarVenta);

export default router;