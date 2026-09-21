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
