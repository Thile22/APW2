# Trabajo Practico - Aplicaciones Web 2
# THITEC - Tienda Online de Productos Tecnologicos

## Contexto del negocio

Se desarrollo una aplicacion web para una tienda online dedicada a la comercializacion de productos tecnologicos.

El sistema permite gestionar usuarios, consultar productos, administrar un carrito de compras y generar ventas mediante una API REST.
---
# Primera entrega - Estructura de datos
## Estructuras iniciales
Se diseñaron tres estructuras de datos para representar la informacion del negocio:

## usuarios.json
Contiene informacion de los usuarios registrados:
- ID del usuario.
- Nombre y apellido.
- Email.
- Contraseña.
- Estado de actividad.

## productos.json
Contiene informacion de los productos:
- ID del producto.
- Nombre.
- Descripcion.
- Precio.
- Imagen.
- Stock.
- Disponibilidad.

## ventas.json
Contiene informacion de las ventas:
- ID de la venta.
- ID del usuario que realizo la compra.
- Fecha.
- Total.
- Direccion de entrega.
- Productos adquiridos.
- Metodo de pago.
- Estado del pago.

## Relaciones entre las estructuras
Las estructuras se relacionan mediante identificadores.

Cada venta contiene un `id_usuario` que identifica al usuario que realizo la compra. Ademas, contiene un array `productos` con los identificadores y cantidades de los productos adquiridos.
---
# Segunda entrega - API con Express.js
## Descripcion

Se desarrollo un servidor utilizando Node.js y Express.js para gestionar usuarios, productos y ventas mediante una API REST.

Inicialmente, la persistencia se realizo mediante archivos JSON.

## Tecnologias utilizadas
- Node.js.
- Express.js.
- JavaScript ES6.
- JSON.
- Thunder Client para probar solicitudes HTTP.

## Servidor
Direccion principal:

`http://localhost:3000`

Las rutas de la API utilizan el prefijo `/api`.

## Rutas de la API

| Metodo | Endpoint | Descripción |
| GET | `/api/productos` | Consulta todos los productos. |
| GET | `/api/productos/buscar/:id` | Consulta un producto por ID. |
| POST | `/api/productos` | Crea un producto. |
| PUT | `/api/productos/:id` | Actualiza un producto. |
| DELETE | `/api/productos/:id` | Elimina un producto si no esta asociado a ventas. |
| GET | `/api/usuarios` | Consulta los datos del usuario autenticado. |
| GET | `/api/usuarios/buscar/:id` | Consulta un usuario por ID propio. |
| POST | `/api/usuarios` | Registra un nuevo usuario. |
| POST | `/api/usuarios/login` | Inicia sesion. |
| DELETE | `/api/usuarios/:id` | Elimina la propia cuenta si no tiene ventas asociadas. |
| GET | `/api/ventas` | Consulta las ventas del usuario autenticado. |
| GET | `/api/ventas/buscar/:id` | Consulta una venta propia por ID. |
| POST | `/api/ventas` | Registra una nueva venta. |
| PUT | `/api/ventas/:id` | Actualiza una venta propia. |
| DELETE | `/api/ventas/:id` | Elimina una venta propia. |

## Integridad de los datos
Se implementaron controles para preservar las relaciones entre usuarios, productos y ventas.
Antes de eliminar un usuario, el servidor verifica si tiene ventas asociadas y antes de eliminar un producto, se comprueba que no este asociado a ninguna venta.
--
# Tercera entrega - Frontend de la tienda online

## Descripcion
Se desarrollo una interfaz web para la tienda online THITEC, integrada con el backend mediante solicitudes HTTP.

## Tecnologias utilizadas
- HTML5.
- CSS3.
- JavaScript ES6.
- Fetch API.
- LocalStorage.

## Estructura del frontend
Los archivos de la interfaz se encuentran dentro de la carpeta `public/`.

## Funcionalidades implementadas

### Inicio de sesion
Se incorporo una pantalla de acceso que permite ingresar el correo electronico y la contraseña.
Las credenciales se envían al endpoint `POST /api/usuarios/login`.
Tambien se incorporo un boton para completar automaticamente las credenciales de un usuario de prueba.

### Catalogo de productos
Los productos se obtienen desde la API mediante solicitudes GET.
Cada producto se presenta mediante una tarjeta que muestra su nombre, categoria, descripciin, precio e imagen.
Tambien se implemento un filtro por categoría.

### Carrito de compras
El usuario puede agregar productos al carrito y modificar sus cantidades.
El carrito muestra los productos seleccionados y calcula el importe correspondiente.
Se utiliza LocalStorage para conservar el contenido del carrito entre recargas del navegador.

### Generacion de ventas
Se implemento un formulario que solicita la direccion de entrega y el metodo de pago.
Al confirmar la compra, el frontend envia una solicitud POST a `/api/ventas`, incluyendo los productos seleccionados y sus cantidades.
El backend identifica al usuario mediante el token JWT y calcula el total utilizando los precios almacenados en la base de datos.
Si la operación finaliza correctamente, la interfaz muestra un mensaje de confirmación y limpia el carrito.

### Cierre de sesión
Se incorporó una opción para cerrar la sesión y regresar a la pantalla de inicio de sesión.
---
# Cuarta entrega - Seguridad y persistencia con MongoDB

## Descripción
En esta etapa se modifico la persistencia del sistema para utilizar MongoDB y se incorporaron mecanismos de seguridad mediante bcrypt y JSON Web Tokens (JWT).
El objetivo fue mejorar la proteccion de las contraseñas, controlar el acceso a las operaciones de la API y centralizar la persistencia de la informacion.

## Tecnologías utilizadas
- Node.js.
- Express.js.
- MongoDB.
- Mongoose.
- bcrypt.
- JSON Web Token (JWT).
- dotenv.
- JavaScript ES6.

## Migracion a MongoDB
Se reemplazo la persistencia principal mediante archivos JSON por una base de datos MongoDB.
Se utiliza Mongoose para definir los modelos y realizar las operaciones.
La base de datos utilizada es `thitec` y contiene informacion de:
- Usuarios.
- Productos.
- Ventas.

La conexion se configura mediante el archivo `config/database.js` y las variables de entorno definidas en `.env`.
Los archivos JSON originales y sus respaldos se conservaron como referencia de los datos iniciales.

## Proteccion de contraseñas con bcrypt

Se implementó bcrypt para proteger las contraseñas de los usuarios.
Al registrarse, la contraseña se transforma en un hash antes de almacenarse en MongoDB.
Durante el inicio de sesion, se utiliza bcrypt para comparar la contraseña ingresada con el hash almacenado.
Las respuestas de la API no exponen las contraseñas.

## Autenticacion mediante JWT
Se incorporo JSON Web Token para autenticar a los usuarios.
Cuando el inicio de sesion es correcto, el servidor genera un token JWT con una duracion de 2 horas.
El token permite identificar al usuario autenticado y acceder a las rutas que requieren autenticacion.
Se implemento el middleware `verificarToken.js`, encargado de comprobar la validez del token recibido en las solicitudes.

El token se envia mediante el encabezado HTTP:
`Authorization: Bearer TOKEN`

## Proteccion de rutas

Se establecieron las siguientes condiciones de acceso:
- Las operaciones de creacion, modificacion y eliminacion de productos requieren autenticacion.
- El registro y el inicio de sesion permanecen publicos.
- Las consultas y la eliminacion de usuarios requieren autenticacion.
- Las operaciones de ventas requieren autenticacion.
- Cada usuario solamente puede consultar y administrar sus propias ventas.
- Cada usuario solamente puede consultar o eliminar su propia cuenta.

## Validaciones e integridad

El backend verifica los productos y las cantidades antes de registrar una venta.
El total de la compra se calcula utilizando los precios almacenados en MongoDB, evitando depender de los importes enviados por el frontend.
Tambien se verifica que los usuarios y productos no puedan eliminarse cuando existen ventas asociadas.

## Pruebas realizadas

Se utilizo Thunder Client para probar las solicitudes HTTP de la API.
Se verificó:
- El inicio de sesión y la generación del token JWT.
- El acceso a rutas protegidas con un token valido.
- El rechazo de solicitudes sin token.
- El rechazo de tokens invalidos o vencidos.
- La restriccion de acceso a los datos de otros usuarios.
- La creacion de ventas y su almacenamiento en MongoDB.
---

# Repositorio GitHub

Repositorio del proyecto:
https://github.com/Thile22/APW2.git