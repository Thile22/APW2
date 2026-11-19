
import express from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';

import {
    obtenerVentas,
    obtenerVentaPorId,
    crearVenta,
    actualizarVenta,
    eliminarVenta
} from '../controllers/ventas.controller.js';

const router = express.Router();

// GET - Obtener todas las ventas
router.get('/', verificarToken, obtenerVentas);

// GET - Obtener una venta por ID
router.get('/buscar/:id', verificarToken, obtenerVentaPorId);

// POST - Crear una venta
router.post('/', verificarToken, crearVenta);

// PUT - Actualizar una venta
router.put('/:id', verificarToken, actualizarVenta);

// DELETE - Eliminar una venta
router.delete('/:id', verificarToken, eliminarVenta);

export default router;
