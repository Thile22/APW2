
const API_URL = '/api';

let productosCargados = [];
let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
let usuarioSesion = null;

// Elementos de la página
const loginSection = document.getElementById('login-section');
const tiendaSection = document.getElementById('tienda-section');
const loginForm = document.getElementById('login-form');
const loginMensaje = document.getElementById('login-mensaje');

// INICIO DE SESIÓN
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

        // Guardar la sesión en el navegador
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

// CERRAR SESIÓN
    document.getElementById('cerrar-sesion').addEventListener('click', () => {
    localStorage.removeItem('usuarioSesion');

    usuarioSesion = null;

    tiendaSection.hidden = true;
    loginSection.hidden = false;

    loginMensaje.textContent = '';
});

// RECUPERAR LA SESIÓN AL ACTUALIZAR LA PÁGINA
function recuperarSesion() {
usuarioSesion = null;

localStorage.removeItem('usuarioSesion');
loginSection.hidden = false;
tiendaSection.hidden = true;
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

// FILTRAR PRODUCTOS POR CATEGORÍA
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
    id_usuario: usuarioSesion.id,
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
            'Content-Type': 'application/json'
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
// INICIAR LA APLICACIÓN
recuperarSesion();
