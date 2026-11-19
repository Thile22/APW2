
import mongoose from 'mongoose';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

import { Usuario } from '../models/usuario.js';
import { Producto } from '../models/producto.js';
import { Venta } from '../models/ventas.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
    path: path.join(__dirname, '..', '.env')
});

const migrarDatos = async () => {
    try {
        // 1. Conectamos a MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Conectado a MongoDB para el Seed...');

        // 2. Leemos los archivos JSON
        const archivoUsuarios = path.join(__dirname, '..', 'data', 'usuarios.json');
        const archivoProductos = path.join(__dirname, '..', 'data', 'productos.json');
        const archivoVentas = path.join(__dirname, '..', 'data', 'ventas.json');

        const usuarios = JSON.parse(await fs.readFile(archivoUsuarios, 'utf-8'));
        const productos = JSON.parse(await fs.readFile(archivoProductos, 'utf-8'));
        const ventas = JSON.parse(await fs.readFile(archivoVentas, 'utf-8'));

        // 3. Migramos los usuarios
        for (const usuario of usuarios) {
            const existe = await Usuario.findOne({ id: usuario.id });

            if (!existe) {
                await Usuario.create(usuario);
            }
        }

        console.log(`Usuarios procesados: ${usuarios.length}`);

        // 4. Migramos los productos
        for (const producto of productos) {
            const existe = await Producto.findOne({ id: producto.id });

            if (!existe) {
                await Producto.create(producto);
            }
        }

        console.log(`Productos procesados: ${productos.length}`);

        // 5. Adaptamos y migramos las ventas
        for (const venta of ventas) {
            const existe = await Venta.findOne({ id: venta.id });

            if (!existe) {
                const ventaAdaptada = {
                    ...venta,
                    productos: venta.productos.map(producto =>
                        typeof producto === 'number'
                            ? { id: producto, cantidad: 1 }
                            : producto
                    )
                };

                await Venta.create(ventaAdaptada);
            }
        }

        console.log(`Ventas procesadas: ${ventas.length}`);
        console.log('¡Migración exitosa! Los datos ya están en MongoDB.');

    } catch (error) {
        console.error('Error en la migración:', error.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
};

migrarDatos();
