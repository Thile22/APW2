import fs from 'fs';

export function leerArchivo(ruta) {
    return JSON.parse(fs.readFileSync(ruta, 'utf-8'));
}

export function guardarArchivo(ruta, datos) {
    fs.writeFileSync(
        ruta,
        JSON.stringify(datos, null, 2)
    );
}