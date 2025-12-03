# Frontend del trabajo practico

### Requerimientos de cliente
- El sistema debe preguntar su nombre al usuario al comenzar, sólo cuando se complete, se permitirá ver los productos para comprar. :heavy_check_mark:
- El sistema debe contar con un nombre de empresa / imagen de empresa. Se pide que las aplicaciones front-end cuenten con un favicon. :heavy_check_mark:
- El sistema debe tener cargados y mostrados productos variados para ambos tipos de productos al momento de ser probada por el cliente (los profesores evaluando). Los productos mostrados deben ser los productos que estén activos en ese momento (el producto debe tener la propiedad booleana activo). Nota: En caso de no tener el backend armado, los productos deben mostrarse tomados desde un JSON hardcodeado. Deben estar pensados para 1- mostrarse de forma responsive. :heavy_check_mark: 2- mostrarse de forma paginada. :heavy_check_mark:
- El sistema debe poder persistir en la base de datos el registro de las ventas realizadas exitosamente, junto con el nombre del usuario que las efectuó, la fecha y el precio total. :heavy_check_mark:
- El sistema debe poder mostrar el ticket de la compra una vez efectuada. :heavy_check_mark:
- El sistema debe poder permitir eliminar productos que no se deseen comprar. :heavy_check_mark:
- El sistema debe permitir comprar varios de un mismo producto (parámetro cantidad). :heavy_check_mark:
- El sistema debe lanzar un modal que pregunte si el cliente quiere confirmar la compra. :heavy_check_mark:
- El sistema debe mostrar un botón que permita volver a iniciar el proceso de compra al finalizar y mostrar el ticket. :heavy_check_mark:
- El sistema debe permitir descargar el ticket en PDF. :heavy_check_mark:
- El sistema debe poder paginar los productos para evitar que estén todos en pantalla al mismo tiempo. :heavy_check_mark:
- El sistema debe permitir cambiar el tema de la aplicación (al menos dos, claro y oscuro). Además de
mantener el tema elegido si se recarga la página. :heavy_check_mark:
- El sistema debe poder tener un botón que nos redirija al login del panel del administrador. :heavy_check_mark:
- Al momento de testear la aplicación, debe haber suficientes productos activos para poder ver todas las funcionalidades. :heavy_check_mark:

# Flujo principal del cliente
1. El cliente entra al sitio.
2. Se muestra la pantalla de bienvenida.
3. El cliente ingresa su nombre. (solo nombre).
4. El cliente toca el botón continuar.
![Pantalla de ingreso del cliente](./imagenes%20readme/pantallaInicio.png)
5. Se redirige a la pantalla de productos.
6. El cliente puede navegar entre las dos categorías.
7. El cliente agrega un producto al carrito.
8. El cliente agrega varios productos al carrito al mismo tiempo.
9. El cliente elimina un producto del carrito.
![Pantalla de productos del cliente](./imagenes%20readme/pantallaProductos.png)
10. El cliente accede a la pantalla del carrito.
11. El cliente agrega más cantidad de un producto ya agregado al carrito.
12. El cliente elimina una cantidad de un producto ya agregado.
![Pantalla del carrito del cliente](./imagenes%20readme/pantallaCarrito.png)
13. El cliente finaliza la compra. El sistema redirige a la pantalla del ticket.
![Pantalla de venta realizada](./imagenes%20readme/ventaRealizada.png)
14. El ticket muestra los datos de los productos comprados, el nombre ingresado en el paso 2, la fecha de hoy y el nombre de la empresa.
![Ticket de compra](./imagenes%20readme/ticket.png)
15. El cliente le da al botón de salir.
16. El sistema vuelve a comenzar.