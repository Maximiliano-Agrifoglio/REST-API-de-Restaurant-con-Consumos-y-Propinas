let cliente = {
    mesa: '',
    hora: '',
    pedido: []
};

const categorias = {
    1:'Comida',
    2:'Bebida',
    3:'Postre'
};


const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click',guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;
   
    //Revisar si hay un campos vacios.
    
    const camposVacios = [hora, mesa].some(campo => campo === '');
    
    if (camposVacios) {
        //verificar si hay una alerta.
        const existeAlerta = document.querySelector('.invalid-feedback');

        if (!existeAlerta) {
            
            const alerta = document.createElement('div');
            alerta.classList.add('invalid-feedback', 'd-block','text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);
            
            //eliminar alerta!. 
            setTimeout(() => {
                alerta.remove();
            }, 3000);

            return;
        }
    }

    //asignar datos del formulario a cliente.
    cliente = { ...cliente ,hora, mesa, }; 
    
    //Ocultar Modal
    const ModalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(ModalFormulario);
    modalBootstrap.hide();

    //mostrar las secciones.
    mostrarSecciones();

    //obtener platillos de la API de JSON-server.
    obtenerPlatillos();

    
} 
     

function mostrarSecciones() {
    const seccionesOcultas = document.querySelectorAll('.d-none');
    seccionesOcultas.forEach( seccion => {seccion.classList.remove('d-none')});
}     
       
function obtenerPlatillos() {
   const url = 'http://localhost:4000/platillos'; 

   fetch(url)
   .then(respuesta => respuesta.json())
   .then(resultado => mostrarPlatillos(resultado))
}
   
function mostrarPlatillos(platillos) {
    const contenido = document.querySelector('#platillos .contenido');

    platillos.forEach(platillo => {
        const row  = document.createElement('div');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('div');
        nombre.classList.add('col-md-4');
        nombre.textContent = platillo.nombre;

        const precio = document.createElement('div');
        precio.classList.add('col-md-3', 'fw-bold');
        precio.textContent = `$${platillo.precio}`;

        const categoria = document.createElement('div');
        categoria.classList.add('col-md-3');
        categoria.textContent = categorias[platillo.categoria];

        const inputCantidad = document.createElement('input');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id = `producto-${platillo.id}`;
        inputCantidad.classList.add('form-control');


        //función que detecta el platillo y la cantidad que se esta agregando. 
        inputCantidad.onchange = function() {
            const cantidad = inputCantidad.value;
            agregarPlatillo({...platillo, cantidad});
        }    
        

        const agregar = document.createElement('div');
        agregar.classList.add('col-md-2');
        agregar.appendChild(inputCantidad);
        
        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);

        contenido.appendChild(row);
    });    
}    

function agregarPlatillo(producto) {
    
    let { pedido } = cliente;
    //Revisar que la cantidad sea mayor a 0.
    if (producto.cantidad > 0) {

        //Comprueba si el elemento ya existe en el array.
        if (pedido.some( articulo => articulo.id === producto.id)) {

            //si el articulo ya existe, Actualizar la cantidad.
            const pedidoActualizado = pedido.map( articulo => {
                if (articulo.id === producto.id) {
                    articulo.cantidad = producto.cantidad;
                }     
                                                           
                return articulo; 
            });
            //se asigna el nuevo array a cliente.pedido
            cliente.pedido = [...pedidoActualizado];    
        } else {
            cliente.pedido = [...pedido, producto];
        }   
       
                
    }else{
        //eliminar elementos cuando la cantidad es 0
        const resultado = pedido.filter( articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado];
    }   

    //limpiar HTML previo. 
    LimpiarHTML();

    if (cliente.pedido.length) {
        //mostrar el resumen. 
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }
    
}
    
    
function actualizarResumen() {
    
    const contenido = document.querySelector('#resumen .contenido');

    const resumen = document.createElement('div');
    resumen.classList.add('col-md-6','card','py-2','px-3','shadow');
    
    //información de la mesa.
    const mesa = document.createElement('p');
    mesa.classList.add('fw-bold');
    mesa.textContent = 'Mesa: ';

    const mesaSpan = document.createElement('span');
    mesaSpan.classList.add('fw-normal');
    mesaSpan.textContent = cliente.mesa;

    //información de la hora.
    const hora = document.createElement('p');
    hora.classList.add('fw-bold');
    hora.textContent = 'Hora: ';

    const horaSpan = document.createElement('span');
    horaSpan.classList.add('fw-normal');
    horaSpan.textContent = cliente.hora;

    //agregar a los elementos padre.
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //Titulo de la seccíon.
    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Platillos Consumidos';

    //iterar sobre el array de pedidos. 
    const grupo = document.createElement('ul');
    grupo.classList.add('list-group');

    let { pedido } = cliente;
    pedido.forEach(articulo => {
       const { nombre, cantidad, precio, id } = articulo;

       const lista = document.createElement('li');
       lista.classList.add('list-group-item');
       
       const nombreEL = document.createElement('h4');
       nombreEL.classList.add('my-4');
       nombreEL.textContent = nombre;
       
       //cantidad del articulo.
       const cantidadEl = document.createElement('p');
       cantidadEl.classList.add('fw-bold');
       cantidadEl.textContent = 'Cantidad: ';

       const cantidadValor = document.createElement('span');
       cantidadValor.classList.add('fw-normal');
       cantidadValor.textContent = `${cantidad}`;

       //precio del articulo.
       const precioEL = document.createElement('p');
       precioEL.classList.add('fw-bold');
       precioEL.textContent = 'Precio: ';

       const precioValor = document.createElement('span');
       precioValor.classList.add('fw-normal');
       precioValor.textContent = `$${precio}`;

       //Subtotal del Articulo. 
       const subtotalEL = document.createElement('p');
       subtotalEL.classList.add('fw-bold');
       subtotalEL.textContent = 'Subtotal: ';

       const subtotalValor = document.createElement('span');
       subtotalValor.classList.add('fw-normal');
       subtotalValor.textContent = calcularSubtotal(precio, cantidad);
       
       //Boton para Eliminar.
       const btnEliminar = document.createElement('button');
       btnEliminar.classList.add('btn','btn-danger');
       btnEliminar.textContent = 'Eliminar del Pedido';
       
       
       btnEliminar.onclick = function() {
            eliminarProducto(id);   
       }

       //Agregar valores a sus contenedores.
       cantidadEl.appendChild(cantidadValor);
       precioEL.appendChild(precioValor);
       subtotalEL.appendChild(subtotalValor);

       //Agregar elementos al li.
       lista.appendChild(nombreEL);
       lista.appendChild(cantidadEl);
       lista.appendChild(precioEL);
       lista.appendChild(subtotalEL);
       lista.appendChild(btnEliminar);

       //Agregar lista al grupo principal (UL).
       grupo.appendChild(lista);
    });
    
     //insertar al contenido.
     resumen.appendChild(heading);
     resumen.appendChild(mesa);
     resumen.appendChild(hora);
     resumen.appendChild(grupo);
     
     contenido.appendChild(resumen);
    
    //mostrar formulario de propinas.
     formularioPropinas(); 
}     
  


function LimpiarHTML() {
    
    const contenido = document.querySelector('#resumen .contenido');
    
    while (contenido.firstChild) {
          contenido.removeChild(contenido.firstChild);     
    }
}


function calcularSubtotal(precio,cantidad) {
    return `$${precio * cantidad}`;
}    

//Eliminar platillos desde el boton.
function eliminarProducto(id) {
    
    const { pedido } = cliente;
    const resultado = pedido.filter( articulo => articulo.id !== id );
    cliente.pedido = [...resultado];
    
    //limpiar HTML.
    LimpiarHTML();
    
    if (cliente.pedido.length) {
        //mostrar el resumen. 
        actualizarResumen();
    } else {
        mensajePedidoVacio();
    }

    //El producto se eliminó por lo tanto regresamos la cantidad a 0 en el formulario.
      const productoEliminado = `#producto-${id}`;
      const inputEliminado = document.querySelector(productoEliminado);
      inputEliminado.value = 0;
      
      
}    
    
 function mensajePedidoVacio() {
    const contenido = document.querySelector('#resumen .contenido' );
    
    const texto = document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Anade los elementos del pedido';

    contenido.appendChild(texto);
}

function formularioPropinas() {
    const contenido = document.querySelector('#resumen .contenido');
    
    const formulario = document.createElement('div');
    formulario.classList.add('col-md-6', 'formulario');
    
    const divFormulario = document.createElement('div');
    divFormulario.classList.add('card','py-2','px-3', 'shadow');

    const heading = document.createElement('h3');
    heading.classList.add('my-4','text-center');
    heading.textContent = 'Propina';

    //radio button 10%
    const radio10 = document.createElement('input');
    radio10.type = 'radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radio10Label = document.createElement('label');
    radio10Label.textContent = '10%';
    radio10Label.classList.add('form-check-label');

    const radio10Div = document.createElement('div');
    radio10Div.classList.add('form-check');

    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radio10Label);

    //radio button 25%
    const radio25 = document.createElement('input');
    radio25.type = 'radio';
    radio25.name = 'propina';
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;

    const radio25Label = document.createElement('label');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('div');
    radio25Div.classList.add('form-check');

    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);
    

    //radio button 25%
    const radio50 = document.createElement('input');
    radio50.type = 'radio';
    radio50.name = 'propina';
    radio50.value = '50';
    radio50.classList.add('form-check-input');
    radio50.onclick = calcularPropina;

    const radio50Label = document.createElement('label');
    radio50Label.textContent = '50%';
    radio50Label.classList.add('form-check-label');

    const radio50Div = document.createElement('div');
    radio50Div.classList.add('form-check');

    radio50Div.appendChild(radio50);
    radio50Div.appendChild(radio50Label);
    
    //Agregar al div principal.
    divFormulario.appendChild(heading);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
   
    //agregar al formulario
    formulario.appendChild(divFormulario);

    //insertando en el DOM.
    contenido.appendChild(formulario);
}

function calcularPropina() {
    const { pedido } = cliente;
    let subtotal = 0;

    //calcular el subtotal a pagar.
    pedido.forEach( articulo => {
       subtotal += articulo.cantidad * articulo.precio; 
    });
    
    //seleccionar el radio button con la propina del cliente. 
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    //calcular la propina.
    const propina = ((subtotal * parseInt(propinaSeleccionada)) / 100 );
    
    const total = subtotal + propina;
    console.log(total)

    mostrarTotalHTML(subtotal, total, propina);
}

function mostrarTotalHTML(subtotal, total, propina) {
    
    const divTotales = document.createElement('div');
    divTotales.classList.add('total-pagar','py-5');

    //subtotal
    const subtotalParrafo = document.createElement('p');
    subtotalParrafo.classList.add('fs-4','fw-bold','mt-2');
    subtotalParrafo.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('span');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `$${subtotal}`;

    subtotalParrafo.appendChild(subtotalSpan);

    //propina.
    const propinaParrafo = document.createElement('p');
    propinaParrafo.classList.add('fs-4','fw-bold','mt-2');
    propinaParrafo.textContent = 'propina: ';

    const propinaSpan = document.createElement('span');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `$${propina}`;

    propinaParrafo.appendChild(propinaSpan);

    //Total.
    const totalParrafo = document.createElement('p');
    totalParrafo.classList.add('fs-4','fw-bold','mt-2');
    totalParrafo.textContent = 'Total a Pagar: ';

    const totalSpan = document.createElement('span');
    totalSpan.classList.add('fw-normal');
    totalSpan.textContent = `$${total}`;

    totalParrafo.appendChild(totalSpan);
    
    //Eliminar el último resultado. 
    const totalpagarDiv = document.querySelector('.total-pagar');
    if (totalpagarDiv) {
        totalpagarDiv.remove();
    }

    divTotales.appendChild(subtotalParrafo);
    divTotales.appendChild(propinaParrafo);
    divTotales.appendChild(totalParrafo);

    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(divTotales);
}

