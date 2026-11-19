import bcrypt from 'bcrypt';
import { Usuario } from '../models/usuario.js';
import { Venta } from '../models/ventas.js';
import jwt from 'jsonwebtoken';

function quitarContraseña(usuario) {
    const { contraseña, pass, ...usuarioSinContraseña } =
        usuario.toObject ? usuario.toObject() : usuario;

    return usuarioSinContraseña;
}

// GET - Obtener todos los usuarios
export async function obtenerUsuarios(req, res) {
    try {
        const usuario = await Usuario.findOne({
            id: req.usuario.id
        });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json([quitarContraseña(usuario)]);

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener usuarios'
        });
    }
}

// GET - Obtener un usuario por ID
export async function obtenerUsuarioPorId(req, res) {
    try {
        const id = parseInt(req.params.id);

        // Verificar que solicite su propio usuario
        if (id !== Number(req.usuario.id)) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuario = await Usuario.findOne({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        res.json(quitarContraseña(usuario));

    } catch (error) {
        res.status(500).json({
            mensaje: 'Error al obtener usuario'
        });
    }
}

// POST - Crear un usuario
export async function crearUsuario(req, res) {
    try {
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

        const emailNormalizado = email.trim().toLowerCase();

        const emailExiste = await Usuario.findOne({
            email: emailNormalizado
        });

        if (emailExiste) {
            return res.status(409).json({
                mensaje: 'El email ya está registrado'
            });
        }

        const ultimoUsuario = await Usuario.findOne().sort({ id: -1 });
        const nuevoId = ultimoUsuario ? ultimoUsuario.id + 1 : 1;

        const contraseñaHash = await bcrypt.hash(pass, 10);

        const nuevoUsuario = await Usuario.create({
            id: nuevoId,
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            edad: Number(edad),
            ocupacion: ocupacion.trim(),
            ciudad_natal: ciudad_natal.trim(),
            direccion: direccion.trim(),
            email: emailNormalizado,
            contraseña: contraseñaHash,
            activo: true
        });

        res.status(201).json({
            mensaje: 'Usuario registrado correctamente',
            usuario: quitarContraseña(nuevoUsuario)
        });

    } catch (error) {
        console.error('Error al crear usuario:', error.message);
        res.status(500).json({ mensaje: 'Error al registrar usuario' });
    }
}



// POST - Iniciar sesión
export async function iniciarSesion(req, res) {
    try {
        const { email } = req.body;
        const pass = req.body.pass ?? req.body.contraseña;

        if (!email?.trim() || !pass) {
            return res.status(400).json({
                mensaje: 'Email y clave son obligatorios'
            });
        }

        const emailNormalizado = email.trim().toLowerCase();

        const usuario = await Usuario.findOne({
            email: emailNormalizado,
            activo: true
        });

        if (!usuario) {
            return res.status(401).json({
                mensaje: 'Email o clave incorrectos'
            });
        }

        const claveCorrecta = await bcrypt.compare(
            pass,
            usuario.contraseña
        );

        if (!claveCorrecta) {
            return res.status(401).json({
                mensaje: 'Email o clave incorrectos'
            });
        }

        const token = jwt.sign(
            {
                id: usuario.id,
                email: usuario.email
            },
            process.env.JWT_SECRET,
            {
                expiresIn: '2h'
            }
        );

        res.json({
            mensaje: 'Inicio de sesión correcto',
            token,
            usuario: quitarContraseña(usuario)
        });

    } catch (error) {
        console.error('Error al iniciar sesión:', error.message);

        res.status(500).json({
            mensaje: 'Error al iniciar sesión'
        });
    }
}

// DELETE - Eliminar un usuario
export async function eliminarUsuario(req, res) {
    try {
        const id = parseInt(req.params.id);

        // Verificar que intente eliminar su propia cuenta
        if (id !== Number(req.usuario.id)) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        const usuario = await Usuario.findOne({ id });

        if (!usuario) {
            return res.status(404).json({
                mensaje: 'Usuario no encontrado'
            });
        }

        // Verificar si tiene ventas asociadas
        const tieneVentas = await Venta.exists({
            id_usuario: id
        });

        if (tieneVentas) {
            return res.status(400).json({
                mensaje: 'No se puede eliminar el usuario porque tiene ventas asociadas'
            });
        }

        await Usuario.deleteOne({ id });

        res.json({
            mensaje: 'Usuario eliminado correctamente',
            usuario: quitarContraseña(usuario)
        });

    } catch (error) {
        console.error('Error al eliminar usuario:', error.message);
        res.status(500).json({
            mensaje: 'Error al eliminar usuario'
        });
    }
}
