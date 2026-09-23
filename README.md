# Trabajo Practico - Aplicaciones Web 2

## Contexto del negocio

Se realizo la estructura de datos de una tienda online dedicada a la comercializacion de productos tecnologicos.


## Estructuras

### usuarios.json

Contiene la informacion de los usuarios registrados en la tienda.

Los principales datos son:

- ID del usuario
- Nombre
- Apellido
- Email
- Contraseña
- Estado de actividad

### productos.json

Contiene la informacion de los productos disponibles en la tienda.

Los principales datos son:

- ID del producto
- Nombre
- Descripcion
- Precio
- Imagen
- Stock
- Disponibilidad

### ventas.json

Contiene la informacion de las ventas realizadas.

Los principales datos son:

- ID de la venta
- ID del usuario que realizó la compra
- Fecha
- Total
- Dirección de entrega
- Productos adquiridos
- Método de pago
- Estado del pago

## Relacion entre las estructuras

Las tres estructuras se encuentran relacionadas mediante identificadores.

Cada venta posee un `id_usuario`, que permite identificar al usuario que
realizo la compra.

Ademas, cada venta contiene un array `productos` con los IDs de los
productos adquiridos.

La relación se puede representar de la siguiente manera:

usuarios.json
      |
      | id_usuario
      ↓
ventas.json
      |
      | productos[]
      ↓
productos.json

## Tipos de datos

Las estructuras utilizan diferentes tipos de datos:

- **Numericos:** IDs, precios, stock y totales.
- **Cadenas de texto:** nombres, apellidos, emails, descripciones,
  direcciones y metodos de pago.
- **Booleanos:** estado de los usuarios, disponibilidad de productos
  y estado de pago de las ventas.

_________________________________________________________________________
## Segunda entrega - API con Express.js

## Servidor
La direccion principal es: http://localhost:3000
Las rutas de la API utilizan el prefijo /api.

En esta segunda etapa se desarrolló un servidor utilizando Node.js y Express.js para gestionar las estructuras de datos creadas anteriormente.

Se implementaron rutas utilizando los métodos HTTP GET, POST, PUT y DELETE, manteniendo los datos almacenados en archivos JSON.

## Tecnologias utilizadas
Node.js
Express.js
JavaScript ES6
JSON
Thunder Client para probar las solicitudes

## Rutas de la API

# Metodo	# Endpoint	            # Descripcion
GET	      /api/productos	      Consulta todos los productos.
GET	      /api/usuarios	      Consulta todos los usuarios.
GET	      /api/ventas	            Consulta todas las ventas.
POST	      /api/usuarios	      Crea un nuevo usuario.
POST	      /api/productos	      Crea un nuevo producto.
PUT	      /api/productos/:id	Actualiza los datos de un producto existente.
DELETE	/api/usuarios/:id	      Elimina un usuario verificando previamente si posee ventas asociadas.
GET         /api/usuarios           Consulta todos los usuarios sin mostrar contraseñas.
GET         /api/usuarios/buscar/:id  Consulta un usuario por ID.
POST        /api/usuarios           Crea un nuevo usuario validando los datos y el email.
DELETE      /api/usuarios/:id       Elimina un usuario verificando que no tenga ventas asociadas.
GET         /api/ventas             Consulta todas las ventas.
GET          /api/ventas/buscar/:id  Consulta una venta por ID. 
POST         /api/ventas  Crea una venta validando usuario y productos y calculando el total. 
PUT         /api/ventas/:id         Actualiza una venta existente. 
DELETE      /api/ventas/:id         Elimina una venta existente. 

## Persistencia de los datos

Los datos se almacenan en archivos JSON dentro de la carpeta data.
Las operaciones de creacion, modificacion y eliminacion actualizan directamente los archivos JSON correspondientes.
Para facilitar la lectura y escritura de los archivos se creó el modulo utils/fileDB.js.

## Integridad de los datos
Para la solicitud DELETE se tuvo en cuenta la relación entre usuarios y ventas.
Antes de eliminar un usuario, el servidor verifica si existe alguna venta asociada a su id_usuario.
Si el usuario posee ventas, la eliminación es rechazada para evitar que queden ventas relacionadas con un usuario inexistente.

##  Pruebas
Las solicitudes de la API fueron probadas utilizando Thunder Client.
Se verifico el funcionamiento de los métodos GET, POST, PUT y DELETE, ademas de comprobar que los cambios realizados mediante POST y PUT persisten correctamente en los archivos JSON.

