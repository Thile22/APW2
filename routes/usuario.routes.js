
import express from 'express';

import {
    obtenerUsuarios,
    obtenerUsuarioPorId,
    crearUsuario,
    iniciarSesion,
    eliminarUsuario
} from '../controllers/usuario.controller.js';

const router = express.Router();

// GET - Obtener todos los usuarios
router.get('/', obtenerUsuarios);

// GET - Obtener un usuario por ID
router.get('/buscar/:id', obtenerUsuarioPorId);

// POST - Crear un usuario
router.post('/', crearUsuario);

// POST - Iniciar sesion
router.post('/login', iniciarSesion);

// DELETE - Eliminar un usuario
router.delete('/:id', eliminarUsuario);

export default router;
