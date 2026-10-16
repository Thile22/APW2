import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger.middleware.js';

dotenv.config();

import productosRoutes from './routes/producto.routes.js';
import usuariosRoutes from './routes/usuario.routes.js';
import ventasRoutes from './routes/ventas.routes.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(logger);
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({
        mensaje: 'API Tienda Tecnologica funcionando correctamente'
    });
});

app.use('/api/productos', productosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/ventas', ventasRoutes);

// 404 para cualquier ruta no definida
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});