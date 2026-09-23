import express from 'express';
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

const router = express.Router();

function quitarContraseña(usuario) {
    const { contraseña, ...usuarioSinContraseña } = usuario;

    return usuarioSinContraseña;
}

// GET - Obtener todos los usuarios
router.get('/', (req, res) => {
    const usuarios = leerArchivo('usuarios.json');

    const usuariosSinContraseña = usuarios.map(quitarContraseña);

    res.json(usuariosSinContraseña);
});

// GET - Obtener un usuario por ID
router.get('/buscar/:id', (req, res) => {
    const usuarios = leerArchivo('usuarios.json');

    const id = parseInt(req.params.id);

    const usuario = usuarios.find(usuario => usuario.id === id);

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        });
    }

    res.json(quitarContraseña(usuario));
});

// POST - Crear un usuario
router.post('/', (req, res) => {
    const {
        nombre,
        apellido,
        email,
        contraseña
    } = req.body;

    if (!nombre || !apellido || !email || !contraseña) {
        return res.status(400).json({
            mensaje: 'Nombre, apellido, email y contraseña son obligatorios'
        });
    }

    const usuarios = leerArchivo('usuarios.json');

    const emailExiste = usuarios.some(
        usuario => usuario.email === email
    );

    if (emailExiste) {
        return res.status(409).json({
            mensaje: 'El email ya está registrado'
        });
    }

    const nuevoId = usuarios.length > 0
        ? Math.max(...usuarios.map(usuario => usuario.id)) + 1
        : 1;

    const nuevoUsuario = {
        id: nuevoId,
        nombre,
        apellido,
        email,
        contraseña,
        activo: true
    };

    usuarios.push(nuevoUsuario);

    guardarArchivo('usuarios.json', usuarios);

    res.status(201).json(quitarContraseña(nuevoUsuario));
});

// DELETE - Eliminar un usuario
router.delete('/:id', (req, res) => {
    const usuarios = leerArchivo('usuarios.json');
    const ventas = leerArchivo('ventas.json');

    const id = parseInt(req.params.id);

    const tieneVentas = ventas.some(
        venta => venta.id_usuario === id
    );

    if (tieneVentas) {
        return res.status(400).json({
            mensaje: 'No se puede eliminar el usuario porque tiene ventas asociadas'
        });
    }

    const indice = usuarios.findIndex(usuario => usuario.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        });
    }

    const usuarioEliminado = usuarios.splice(indice, 1)[0];

    guardarArchivo('usuarios.json', usuarios);

    res.json({
        mensaje: 'Usuario eliminado correctamente',
        usuario: usuarioEliminado
    });
});

export default router;