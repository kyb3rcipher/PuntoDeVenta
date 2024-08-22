document.addEventListener('DOMContentLoaded', () => {
    const botonCrearProducto = document.getElementById('boton-nuevo-producto');
    
    botonCrearProducto.addEventListener('click', () => { window.location.href = '/productos/crear'; });
});