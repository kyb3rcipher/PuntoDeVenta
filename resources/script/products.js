function agregarCodigo() {
    const codigosContainer = document.getElementById('codigos-container');
    let nuevoCodigo = document.createElement('input');
    nuevoCodigo.name = 'codigo[]';
    codigosContainer.appendChild(nuevoCodigo);
}

document.addEventListener('DOMContentLoaded', () => {
    const botonCrearProducto = document.getElementById('boton-nuevo-producto'),
        botonAgregarCodigo = document.getElementById('boton-agregar-codigo');

    if (botonCrearProducto) {
        botonCrearProducto.addEventListener('click', () => { window.location.href = '/productos/crear'; });
    }

    if (botonAgregarCodigo) {
        botonAgregarCodigo.addEventListener('click', agregarCodigo);
    }
});