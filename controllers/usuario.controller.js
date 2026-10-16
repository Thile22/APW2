
import { leerArchivo, guardarArchivo } from '../utils/fileDB.js';

function quitarContraseña(usuario) {
    const { contraseña, pass, ...usuarioSinContraseña } = usuario;
    return usuarioSinContraseña;
}

// GET - Obtener todos los usuarios
export function obtenerUsuarios(req, res) {
    const usuarios = leerArchivo('usuarios.json');
    res.json(usuarios.map(quitarContraseña));
}

// GET - Obtener un usuario por ID
export function obtenerUsuarioPorId(req, res) {
    const usuarios = leerArchivo('usuarios.json');
    const id = parseInt(req.params.id);

    const usuario = usuarios.find(usuario => usuario.id === id);

    if (!usuario) {
        return res.status(404).json({
            mensaje: 'Usuario no encontrado'
        });
    }

    res.json(quitarContraseña(usuario));
}

// POST - Crear un usuario
export function crearUsuario(req, res) {
    const {
        nombre,
        apellido,
        edad,
        ocupacion,
        ciudad_natal,
        direccion,
        email,
        pass
    } = req.body;

    if (
        !nombre?.trim() ||
        !apellido?.trim() ||
        edad === undefined ||
        edad === null ||
        edad === '' ||
        !ocupacion?.trim() ||
        !ciudad_natal?.trim() ||
        !direccion?.trim() ||
        !email?.trim() ||
        !pass
    ) {
        return res.status(400).json({
            mensaje: 'Todos los campos son obligatorios'
        });
    }

    if (!Number.isInteger(Number(edad)) || Number(edad) <= 0) {
        return res.status(400).json({
            mensaje: 'La edad debe ser un número entero mayor que cero'
        });
    }

    const usuarios = leerArchivo('usuarios.json');
    const emailNormalizado = email.trim().toLowerCase();

    const emailExiste = usuarios.some(
        usuario => usuario.email.toLowerCase() === emailNormalizado
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
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        edad: Number(edad),
        ocupacion: ocupacion.trim(),
        ciudad_natal: ciudad_natal.trim(),
        direccion: direccion.trim(),
        email: emailNormalizado,
        pass,
        activo: true
    };

    usuarios.push(nuevoUsuario);
    guardarArchivo('usuarios.json', usuarios);

    res.status(201).json({
        mensaje: 'Usuario registrado correctamente',
        usuario: quitarContraseña(nuevoUsuario)
    });
}

// POST - Iniciar sesion
export function iniciarSesion(req, res) {
    const { email } = req.body;
    const pass = req.body.pass ?? req.body.contraseña;

    if (!email?.trim() || !pass) {
        return res.status(400).json({
            mensaje: 'Email y clave son obligatorios'
        });
    }

    const usuarios = leerArchivo('usuarios.json');
    const emailNormalizado = email.trim().toLowerCase();

    const usuario = usuarios.find(usuario =>
        usuario.email.toLowerCase() === emailNormalizado &&
        (usuario.pass === pass || usuario.contraseña === pass) &&
        usuario.activo === true
    );

    if (!usuario) {
        return res.status(401).json({
            mensaje: 'Email o clave incorrectos'
        });
    }

    res.json({
        mensaje: 'Inicio de sesión correcto',
        usuario: quitarContraseña(usuario)
    });
}

// DELETE - Eliminar un usuario
export function eliminarUsuario(req, res) {
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
        usuario: quitarContraseña(usuarioEliminado)
    });
}
