
const formularioReservas = document.querySelector(".reservation-form");
const campoFecha = document.querySelector("#date");
const mensajeReserva = document.querySelector(".reservation-message");


const campoHorario = document.querySelector("#time");
const campoPersonas = document.querySelector("#guests");

// Limpiar el mensaje cuando cambien los datos
formularioReservas.addEventListener("input", function() {
    mensajeReserva.textContent = "";
    mensajeReserva.className = "reservation-message";
});

formularioReservas.addEventListener("change", function() {
    mensajeReserva.textContent = "";
    mensajeReserva.className = "reservation-message";
});


// Obtener la fecha actual 
const hoy = new Date();
const anio = hoy.getFullYear();
const mes = String(hoy.getMonth() + 1).padStart(2, "0");
const dia = String(hoy.getDate()).padStart(2, "0");

const fechaMinima = `${anio}-${mes}-${dia}`;

// Bloquear fechas anteriores a hoy
campoFecha.min = fechaMinima;

// Escuchar el envío del formulario
formularioReservas.addEventListener("submit", function(event) {
    event.preventDefault();

    const fecha = campoFecha.value;
    const horario = document.querySelector("#time").value;
    const personas = document.querySelector("#guests").value;

    // Limpiar el mensaje anterior
    mensajeReserva.textContent = "";
    mensajeReserva.className = "reservation-message";

    // Validar los campos
    if (fecha === "" || horario === "" || personas === "") {
        mensajeReserva.textContent =
            "Por favor, completá todos los campos de la reserva.";
        mensajeReserva.classList.add("reservation-message--error");
        return;
    }

    // Validar fecha 
    if (fecha < fechaMinima) {
        mensajeReserva.textContent =
            "Elegí una fecha válida. No se permiten fechas pasadas.";
        mensajeReserva.classList.add("reservation-message--error");
        return;
    }

   
    // Mostrar confirmación con los datos de la reserva
    const fechaElegida = new Date(`${fecha}T12:00:00`);

    const fechaFormateada = fechaElegida.toLocaleDateString("es-AR", {
        weekday: "long",
        day: "numeric",
        month: "long"
    });

    mensajeReserva.textContent =
        `¡Gracias! Tu solicitud de reserva fue registrada correctamente para el ${fechaFormateada} a las ${horario}, para ${personas} ${personas === "1" ? "persona" : "personas"}.`;

    mensajeReserva.classList.add("reservation-message--success");

});


const botonesProductos = document.querySelectorAll(".product-card__button");
const listaPedido = document.querySelector(".order__list");
const mensajePedidoVacio = document.querySelector(".order__empty");
const totalPedido = document.querySelector("#order-total");
const botonVaciarPedido = document.querySelector(".order__clear");

// Guardar los productos elegidos
const pedido = [];

// Actualizar lo que se muestra en pantalla

function actualizarPedido() {
    listaPedido.innerHTML = "";

    let total = 0;

    pedido.forEach(function(producto) {
        const elemento = document.createElement("li");
        const informacion = document.createElement("span");

        informacion.textContent =
            `${producto.nombre} x ${producto.cantidad} - $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}`;

        // Botón para disminuir la cantidad
        const botonMenos = document.createElement("button");
        botonMenos.type = "button";
        botonMenos.textContent = "−";
        botonMenos.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);

        botonMenos.addEventListener("click", function() {
            producto.cantidad--;

            if (producto.cantidad === 0) {
                const indice = pedido.indexOf(producto);
                pedido.splice(indice, 1);
            }

            actualizarPedido();
        });

        // Botón para aumentar la cantidad
        const botonMas = document.createElement("button");
        botonMas.type = "button";
        botonMas.textContent = "+";
        botonMas.setAttribute("aria-label", `Agregar una unidad de ${producto.nombre}`);

        botonMas.addEventListener("click", function() {
            producto.cantidad++;
            actualizarPedido();
        });

        // Botón para eliminar el producto
        const botonEliminar = document.createElement("button");
        botonEliminar.type = "button";
        botonEliminar.textContent = "Eliminar";
        botonEliminar.setAttribute("aria-label", `Eliminar ${producto.nombre} del pedido`);

        botonEliminar.addEventListener("click", function() {
            const indice = pedido.indexOf(producto);
            pedido.splice(indice, 1);
            actualizarPedido();
        });

        elemento.append(
            informacion,
            document.createTextNode(" "),
            botonMenos,
            document.createTextNode(" "),
            botonMas,
            document.createTextNode(" "),
            botonEliminar
        );

        listaPedido.appendChild(elemento);

        total += producto.precio * producto.cantidad;
    });

    totalPedido.textContent = total.toLocaleString("es-AR");

    mensajePedidoVacio.hidden = pedido.length > 0;
}


// Agregar productos al pedido
botonesProductos.forEach(function(boton) {
    boton.addEventListener("click", function() {
        const nombre = boton.dataset.product;
        const precio = Number(boton.dataset.price);

        const productoExistente = pedido.find(function(producto) {
            return producto.nombre === nombre;
        });

        if (productoExistente) {
            productoExistente.cantidad++;
        } else {
            pedido.push({
                nombre: nombre,
                precio: precio,
                cantidad: 1
            });
        }

        actualizarPedido();
    });
});

// Vaciar el pedido
botonVaciarPedido.addEventListener("click", function() {
    pedido.length = 0;
    actualizarPedido();
});


const botonFinalizar = document.querySelector(".order__checkout");
const resumenPedido = document.querySelector(".order__summary");
const botonVolverMenu = document.querySelector(".order__back");


const botonWhatsApp = document.querySelector(".order__whatsapp");

// Número de ejemplo de Cora Café
const telefonoCora = "5493511234567";


botonFinalizar.addEventListener("click", function() {
   
if (pedido.length === 0) {
    resumenPedido.textContent =
        "Tu pedido está vacío. Agregá algún producto antes de continuar.";

    resumenPedido.hidden = false;
    botonVolverMenu.hidden = false;
    return;
}


    resumenPedido.innerHTML = "";

    const titulo = document.createElement("h3");
    titulo.textContent = "Resumen de tu pedido";

    const lista = document.createElement("ul");

    pedido.forEach(function(producto) {
        const elemento = document.createElement("li");

        elemento.textContent =
            `${producto.nombre} x ${producto.cantidad} — $${(producto.precio * producto.cantidad).toLocaleString("es-AR")}`;

        lista.appendChild(elemento);
    });

    const total = document.createElement("p");
    total.textContent =
        `Total a pagar: $${pedido.reduce(function(suma, producto) {
            return suma + producto.precio * producto.cantidad;
        }, 0).toLocaleString("es-AR")}`;

    const confirmacion = document.createElement("p");
    confirmacion.textContent =
        "¡Gracias por elegir Cora Café! Tu pedido está listo para revisar.";

    
resumenPedido.append(titulo, lista, total, confirmacion);
resumenPedido.hidden = false;
botonVolverMenu.hidden = false;

// Preparar los productos del mensaje
const detalleProductos = pedido.map(function(producto) {
    return `• ${producto.nombre} x ${producto.cantidad} — $${(
        producto.precio * producto.cantidad
    ).toLocaleString("es-AR")}`;
});

// Calcular el total
const totalFinal = pedido.reduce(function(suma, producto) {
    return suma + producto.precio * producto.cantidad;
}, 0);

// Crear el mensaje
const mensaje = [
    "¡Hola, Cora Café! Quiero realizar este pedido:",
    "",
    ...detalleProductos,
    "",
    `Total: $${totalFinal.toLocaleString("es-AR")}`,
    "",
    "¡Gracias!"
].join("\n");

// Preparar el enlace de WhatsApp
botonWhatsApp.href =
    `https://wa.me/${telefonoCora}?text=${encodeURIComponent(mensaje)}`;

botonWhatsApp.hidden = false;
});


botonVolverMenu.addEventListener("click", function() {
    document.querySelector("#menu").scrollIntoView({
        behavior: "smooth"
    });

    resumenPedido.hidden = true;
    botonVolverMenu.hidden = true;
});
