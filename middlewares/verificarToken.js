
import jwt from 'jsonwebtoken';

export function verificarToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                mensaje: 'No se proporcionó un token de autenticación'
            });
        }

        const token = authHeader.split(' ')[1];

        const verificado = jwt.verify(
            token,
            process.env.JWT_SECRET
        );

        req.usuario = verificado;

        next();

    } catch (error) {
        return res.status(401).json({
            mensaje: 'Token inválido o expirado'
        });
    }
}
