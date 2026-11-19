import express from 'express';
import { verificarToken } from '../middlewares/verificarToken.js';

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    iniciarSesion,
    eliminarUsuario
} from '../controllers/usuario.controller.js';

const router = express.Router();

// GET - Obtener los datos del usuario autenticado
router.get('/', verificarToken, obtenerUsuarios);

// GET - Obtener un usuario por ID
router.get('/buscar/:id', verificarToken, obtenerUsuarioPorId);

// POST - Crear un usuario (registro público)
router.post('/', crearUsuario);

// POST - Iniciar sesión (público)
router.post('/login', iniciarSesion);

// DELETE - Eliminar la propia cuenta
router.delete('/:id', verificarToken, eliminarUsuario);

export default router;
