const express = require('express');
const fs = require('fs');

const app = express();

const PORT = 3000;
app.use(express.json());

app.get('/productos', (req, res) => {
    const productos = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));
    res.json(productos);
}); 

app.get('/usuarios', (req, res) => {
    const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));
    res.json(usuarios);
});


app.get('/', (req, res) => {
    res.send('Servidor APW2 funcionando correctamente');
});

app.post('/usuarios', (req, res) => {
    const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));

    const nuevoUsuario = req.body;

    usuarios.push(nuevoUsuario);

    fs.writeFileSync(
        'usuarios.json',
        JSON.stringify(usuarios, null, 2)
    );

    res.status(201).json(nuevoUsuario);
});

app.post('/productos', (req, res) => {
    const productos = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));

    const nuevoProducto = req.body;

    productos.push(nuevoProducto);

    fs.writeFileSync(
        'productos.json',
        JSON.stringify(productos, null, 2)
    );

    res.status(201).json(nuevoProducto);
});

app.put('/productos/:id', (req, res) => {
    const productos = JSON.parse(fs.readFileSync('productos.json', 'utf-8'));

    const id = parseInt(req.params.id);

    const indice = productos.findIndex(producto => producto.id === id);

    if (indice === -1) {
        return res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }

    productos[indice] = {
        ...productos[indice],
        ...req.body
    };

    fs.writeFileSync(
        'productos.json',
        JSON.stringify(productos, null, 2)
    );

    res.json(productos[indice]);
});

app.delete('/usuarios/:id', (req, res) => {
    const usuarios = JSON.parse(fs.readFileSync('usuarios.json', 'utf-8'));
    const ventas = JSON.parse(fs.readFileSync('ventas.json', 'utf-8'));

    const id = parseInt(req.params.id);

    const tieneVentas = ventas.some(venta => venta.id_usuario === id);

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

    fs.writeFileSync(
        'usuarios.json',
        JSON.stringify(usuarios, null, 2)
    );

    res.json({
        mensaje: 'Usuario eliminado correctamente',
        usuario: usuarioEliminado
    });
});



app.listen(PORT, () => {
    console.log(`Servidor funcionando en http://localhost:${PORT}`);
});

