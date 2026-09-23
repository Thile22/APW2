import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Lee un archivo JSON de la carpeta /data
export function leerArchivo(nombreArchivo) {
    const rutaArchivo = path.join(__dirname, '..', 'data', nombreArchivo);

    const contenido = fs.readFileSync(rutaArchivo, 'utf-8');

    return JSON.parse(contenido);
}

// Guarda un archivo JSON en la carpeta /data
export function guardarArchivo(nombreArchivo, datos) {
    const rutaArchivo = path.join(__dirname, '..', 'data', nombreArchivo);

    fs.writeFileSync(
        rutaArchivo,
        JSON.stringify(datos, null, 2),
        'utf-8'
    );
}