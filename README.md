# Frontend del trabajo practico

### Flujo del usuario

- El usuario ingresa su nombre y toca en "continuar" :heavy_check_mark:
- El usuario elije una categoria ("Whiskeys" o "Vinos") :x:
- El usuario agrega al carrito los productos que desea comprar :x:
- El usuario modifica la cantidad que quiere de cada producto :x:
- El usuario continua al carrito donde se le muestra lo que eligio y el precio con un boton para volver en caso de arrepentirse :x:
- El usuario modifica las cantidades y elimina los productos dentro del carrito :x:
- El usuario continua al pago :x:
- El usuario elige el metodo de pago :x:
- En caso de "transferencia" se muestra un QR (con la opcion de saltarselo por motivos de testing y seguridad de los testers) :x:
- En caso de "tarjeta" el usuario ingresa los datos de su tarjeta (sin validaciones reales por seguridad de los testers) :x:
- El usuario confirma el pago y se "imprime" (se muestra) el ticket (en formato PDF) :x:
- Se vuelve al index :x:

### Flujo del administrador

- El administrador presiona el boton "admin" :x:
- El administrador selecciona la opcion de ver los productos :x:
- El administrador selecciona el boton para editar un producto :x:
- El administrador modifica la imagen, el nombre, el precio, el stock y/o el estado "activo" (true/false) :x:
- El administrador guarda los cambios :x:
- El administrador agrega un producto :x:
- El administrador ingresa la imagen, el nombre, el precio, el stock, Y el estado "activo" (true/false). No hay campos opcionales :x:
- El administrador confirma lo ingresado :x:
- El administrador vuelve al dashboard :x:
- El administrador selecciona la opcion de ver las ventas :x:
- Se le muestran al administrador todas las ventas con detalles minimos como el precio y la fecha :x:
- El administrador elige ver el detalle de una venta :x:
- Se le muestra el ticket de la venta :x:
- El administrador toca el boton "exit" :x:
- Se vuelve al index :x: