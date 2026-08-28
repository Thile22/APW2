# Trabajo Práctico - Aplicaciones Web 2

## Contexto del negocio

Se realizo la estructura de datos de una tienda online dedicada a la comercialización de productos tecnológicos.


## Estructuras

### usuarios.json

Contiene la información de los usuarios registrados en la tienda.

Los principales datos son:

- ID del usuario
- Nombre
- Apellido
- Email
- Contraseña
- Estado de actividad

### productos.json

Contiene la información de los productos disponibles en la tienda.

Los principales datos son:

- ID del producto
- Nombre
- Descripción
- Precio
- Imagen
- Stock
- Disponibilidad

### ventas.json

Contiene la información de las ventas realizadas.

Los principales datos son:

- ID de la venta
- ID del usuario que realizó la compra
- Fecha
- Total
- Dirección de entrega
- Productos adquiridos
- Método de pago
- Estado del pago

## Relación entre las estructuras

Las tres estructuras se encuentran relacionadas mediante identificadores.

Cada venta posee un `id_usuario`, que permite identificar al usuario que
realizó la compra.

Además, cada venta contiene un array `productos` con los IDs de los
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

- **Numéricos:** IDs, precios, stock y totales.
- **Cadenas de texto:** nombres, apellidos, emails, descripciones,
  direcciones y métodos de pago.
- **Booleanos:** estado de los usuarios, disponibilidad de productos
  y estado de pago de las ventas.
