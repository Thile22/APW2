
const API_URL = '/api';

let productosCargados = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let usuarioSesion = null;
let tokenSesion = localStorage.getItem('token');


// Elementos de la pagina
const loginSection = document.getElementById('login-section');
const tiendaSection = document.getElementById('tienda-section');
const registroSection = document.getElementById('registro-section');

const loginForm = document.getElementById('login-form');
const loginMensaje = document.getElementById('login-mensaje');

const registroForm = document.getElementById('registro-form');
const registroMensaje = document.getElementById('registro-mensaje');

const irARegistro = document.getElementById('ir-a-registro');
const volverLogin = document.getElementById('volver-login');


// INICIO DE SESION
loginForm.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const email = document.getElementById('login-email').value.trim();
    const pass = document.getElementById('login-pass').value;

    loginMensaje.textContent = 'Verificando datos...';

    try {
        const respuesta = await fetch(`${API_URL}/usuarios/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, pass })
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudo iniciar sesión');
        }

        usuarioSesion = datos.usuario;

        tokenSesion = datos.token;
        localStorage.setItem('token', tokenSesion);

        // Guardar la sesion en el navegador
        localStorage.setItem(
            'usuarioSesion',
            JSON.stringify(usuarioSesion)
        );

        loginForm.reset();
        loginMensaje.textContent = '';

        mostrarTienda();

    } catch (error) {
        loginMensaje.textContent = error.message;
    }
});

 // INGRESAR CON USUARIO DE PRUEBA
    document.getElementById('btn-usuario-prueba').addEventListener('click', () => {
    document.getElementById('login-email').value = 'juan.perez@email.com';
    document.getElementById('login-pass').value = 'Juan1234';

    loginForm.requestSubmit();
});

// MOSTRAR FORMULARIO DE REGISTRO
irARegistro.addEventListener('click', (e) => {
    e.preventDefault();

    loginSection.hidden = true;
    registroSection.hidden = false;

    loginMensaje.textContent = '';
});

// VOLVER AL INICIO DE SESION
volverLogin.addEventListener('click', (e) => {
    e.preventDefault();

    registroSection.hidden = true;
    loginSection.hidden = false;

    registroMensaje.textContent = '';
});

 // REGISTRAR NUEVO USUARIO
registroForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nuevoUsuario = {
        nombre: document.getElementById('registro-nombre').value.trim(),
        apellido: document.getElementById('registro-apellido').value.trim(),
        edad: Number(document.getElementById('registro-edad').value),
        ocupacion: document.getElementById('registro-ocupacion').value.trim(),
        ciudad_natal: document.getElementById('registro-ciudad').value.trim(),
        direccion: document.getElementById('registro-direccion').value.trim(),
        email: document.getElementById('registro-email').value.trim(),
        pass: document.getElementById('registro-pass').value
    };

    try {
        const respuesta = await fetch(`${API_URL}/usuarios`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(nuevoUsuario)
        });

        const datos = await respuesta.json();

        if (!respuesta.ok) {
            throw new Error(datos.mensaje || 'No se pudo registrar el usuario.');
        }

        registroForm.reset();

        registroSection.hidden = true;
        loginSection.hidden = false;

        loginMensaje.textContent = '¡Registro exitoso! Ya podés iniciar sesión.';
        registroMensaje.textContent = '';

    } catch (error) {
        console.error('Error al registrar usuario:', error);
        registroMensaje.textContent = error.message;
    }
});

// MOSTRAR LA TIENDA
function mostrarTienda() {
    loginSection.hidden = true;
    tiendaSection.hidden = false;

    document.getElementById('usuario-identificado').textContent =
        `Bienvenido/a, ${usuarioSesion.nombre} ${usuarioSesion.apellido}`;

    cargarProductos();
}
// ABRIR LA PANTALLA DEL CARRITO
    const btnAbrirCarrito = document.getElementById('btn-abrir-carrito');
    const seccionProductos = document.getElementById('productos');
    const seccionCarrito = document.getElementById('carrito');

btnAbrirCarrito.addEventListener('click', () => {
    seccionProductos.hidden = true;
    seccionCarrito.hidden = false;
    mostrarCarrito();
});
// VOLVER A LA TIENDA DESDE EL CARRITO
    document.getElementById('btn-volver-tienda').addEventListener('click', () => {
    seccionCarrito.hidden = true;
    seccionProductos.hidden = false;
});

// CERRAR SESION
    document.getElementById('cerrar-sesion').addEventListener('click', () => {
    localStorage.removeItem('usuarioSesion');
    localStorage.removeItem('token');
    tokenSesion = null;

    usuarioSesion = null;

    tiendaSection.hidden = true;
    loginSection.hidden = false;

    loginMensaje.textContent = '';
});

// RECUPERAR LA SESION AL ACTUALIZAR LA PAGINA
    async function recuperarSesion() {
    const tokenGuardado = localStorage.getItem('token');

    if (!tokenGuardado) {
        usuarioSesion = null;
        tokenSesion = null;

        localStorage.removeItem('usuarioSesion');

        loginSection.hidden = false;
        tiendaSection.hidden = true;
        return;
    }

    try {
        const respuesta = await fetch(`${API_URL}/usuarios`, {
            headers: {
                'Authorization': `Bearer ${tokenGuardado}`
            }
        });

        if (!respuesta.ok) {
            throw new Error('La sesión venció o no es válida.');
        }

        const usuarios = await respuesta.json();

        if (!Array.isArray(usuarios) || usuarios.length === 0) {
            throw new Error('No se pudo recuperar el usuario.');
        }

        usuarioSesion = usuarios[0];
        tokenSesion = tokenGuardado;

        localStorage.setItem(
            'usuarioSesion',
            JSON.stringify(usuarioSesion)
        );

        mostrarTienda();

    } catch (error) {
        console.error('Error al recuperar la sesión:', error);

        usuarioSesion = null;
        tokenSesion = null;

        // Si el servidor rechazó el token, eliminarlo.
        if (error.message === 'La sesión venció o no es válida.') {
            localStorage.removeItem('token');
            localStorage.removeItem('usuarioSesion');
        }

        loginSection.hidden = false;
        tiendaSection.hidden = true;

        loginMensaje.textContent =
            'No se pudo recuperar la sesión. Iniciá sesión nuevamente.';
    }
}

// CARGAR PRODUCTOS DESDE LA API
async function cargarProductos() {
    console.log('Se ejecutó cargarProductos');
    try {
        const respuesta = await fetch(`${API_URL}/productos`);

        if (!respuesta.ok) {
            throw new Error('No se pudieron cargar los productos');
        }

        productosCargados = await respuesta.json();

        mostrarProductos(productosFiltrados());
    } catch (error) {
        console.error('Error al cargar productos:', error);
    }
}

// FILTRAR PRODUCTOS POR CATEGORIA
const filtroCategoria = document.getElementById('filtro-categoria');

filtroCategoria.addEventListener('change', () => {
    mostrarProductos(productosFiltrados());
});

function productosFiltrados() {
    const categoriaSeleccionada = filtroCategoria.value;

    return categoriaSeleccionada
        ? productosCargados.filter(
            producto => producto.categoria === categoriaSeleccionada
        )
        : productosCargados;
}

// MOSTRAR LAS TARJETAS DE PRODUCTOS
function mostrarProductos(productos) {
    const listaProductos = document.getElementById('lista-productos');

    listaProductos.innerHTML = '';

    productos.forEach(producto => {
        const tarjeta = document.createElement('div');

        tarjeta.innerHTML = `
            <img src="${producto.imagen}" alt="${producto.nombre}">
            <h3>${producto.nombre}</h3>
            <p>Categoría: ${producto.categoria}</p>
            <p>${producto.desc}</p>
            <p>Precio: $${producto.precio.toLocaleString('es-AR')}</p>
            <button class="btn-agregar" data-id="${producto.id}">
                Agregar al carrito
            </button>
        `;

        listaProductos.appendChild(tarjeta);
    });
}

// AGREGAR PRODUCTOS AL CARRITO
document.getElementById('lista-productos').addEventListener('click', (evento) => {
    if (!evento.target.classList.contains('btn-agregar')) return;

    const idProducto = Number(evento.target.dataset.id);

    const producto = productosCargados.find(
        producto => producto.id === idProducto
    );

    if (!producto) return;

    const itemCarrito = carrito.find(
        item => item.id === idProducto
    );

    if (itemCarrito) {
        itemCarrito.cantidad++;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad: 1
        });
    }

    actualizarCarrito();

    alert(`${producto.nombre} agregado al carrito.`);
});


 // MOSTRAR EL CARRITO
function mostrarCarrito() {
    const listaCarrito = document.getElementById('lista-carrito');
    const totalCarrito = document.getElementById('total-carrito');

    listaCarrito.innerHTML = '';

    let total = 0;

    carrito.forEach(item => {
        const subtotal = item.precio * item.cantidad;
        total += subtotal;

        const fila = document.createElement('tr');

        fila.innerHTML = `
            <td class="carrito-producto">
                <strong>${item.nombre}</strong>
            </td>
            <td>${item.cantidad}</td>
            <td>$${subtotal.toLocaleString('es-AR')}</td>
            <td>
                <button
                    type="button"
                    class="btn-eliminar-carrito"
                    aria-label="Eliminar una unidad de ${item.nombre}"
                    title="Eliminar una unidad"
                >
                    🗑
                </button>
            </td>
        `;

        fila.querySelector('.btn-eliminar-carrito').addEventListener('click', () => {
            const producto = carrito.find(producto => producto.id === item.id);

            if (producto.cantidad > 1) {
                producto.cantidad--;
            } else {
                carrito = carrito.filter(producto => producto.id !== item.id);
            }

            actualizarCarrito();
        });

        listaCarrito.appendChild(fila);
    });

    totalCarrito.textContent = `$${total.toLocaleString('es-AR')}`;
}


// GUARDAR Y ACTUALIZAR EL CARRITO
function actualizarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));

    const cantidadCarrito = document.getElementById('cantidad-carrito');
    const cantidadTotal = carrito.reduce(
        (total, item) => total + item.cantidad,
        0
    );

    cantidadCarrito.textContent = ` (${cantidadTotal})`;

    mostrarCarrito();
}
// FINALIZAR COMPRA
const checkoutForm = document.getElementById('checkout-form');
const checkoutMensaje = document.getElementById('checkout-mensaje');

checkoutForm.addEventListener('submit', async (evento) => {
evento.preventDefault();

if (!usuarioSesion || !usuarioSesion.id) {
    checkoutMensaje.textContent = 'Debés iniciar sesión para comprar.';
    return;
}

if (carrito.length === 0) {
    checkoutMensaje.textContent = 'El carrito está vacío.';
    return;
}

const direccion = document.getElementById('direccion-compra').value.trim();
const metodo_pago = document.getElementById('metodo-pago').value;

if (!direccion) {
    checkoutMensaje.textContent = 'Ingresá la dirección de entrega.';
    return;
}

if (!metodo_pago) {
    checkoutMensaje.textContent = 'Seleccioná un método de pago.';
    return;
}

const productos = carrito.map(item => ({
    id: item.id,
    cantidad: item.cantidad
}));

const venta = {
    fecha: new Date().toISOString(),
    direccion,
    metodo_pago,
    pagado: false,
    productos
};

checkoutMensaje.textContent = 'Registrando compra...';

try {
    const respuesta = await fetch(`${API_URL}/ventas`, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${tokenSesion}`
    },
    body: JSON.stringify(venta)
});

    const datos = await respuesta.json();
    
    if (!respuesta.ok) {
        throw new Error(datos.mensaje || 'No se pudo registrar la compra.');
    }
    carrito = [];
    actualizarCarrito();
    checkoutForm.reset();

    checkoutMensaje.textContent =
        `¡Compra registrada! Número de venta: ${datos.venta.id}. Total: $${datos.venta.total.toLocaleString('es-AR')}`;

} catch (error) {
    checkoutMensaje.textContent = error.message;
}
});
// INICIAR LA APLICACION
recuperarSesion();
