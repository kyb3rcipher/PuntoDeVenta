function agregarCodigo() {
    const codigosContainer = document.getElementById('codigos-container');
    let nuevoCodigo = document.createElement('input');
    nuevoCodigo.name = 'codigo[]';
    codigosContainer.appendChild(nuevoCodigo);
}

document.addEventListener('DOMContentLoaded', () => {
    const precioCosto = document.getElementById('precio-costo'), precioVenta = document.getElementById('precio-venta'), ganancia = document.getElementById('ganancia'),
        botonAgregarCodigo = document.getElementById('boton-agregar-codigo');

    // Calcular el precio de venta con el porcentaje de ganancia
    ganancia.addEventListener('input', () => {
        const costo = parseFloat(precioCosto.value);
        const porcentajeGanancia = parseFloat(ganancia.value) / 100;
        const venta = costo * (1 + porcentajeGanancia);

        precioVenta.value = venta.toFixed(2);
    });


    // Calcular el porcentaje de ganancia con el precio de costo y venta
    precioVenta.addEventListener('input', () => {
        const costo = parseFloat(precioCosto.value);
        const venta = parseFloat(precioVenta.value);

        if (venta >= costo) {
            const porcentajeGanancia = ((venta - costo) / costo) * 100;
            
            ganancia.value = porcentajeGanancia;
        }
    });

    botonAgregarCodigo.addEventListener('click', agregarCodigo);
});