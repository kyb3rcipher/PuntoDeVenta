function eliminarProveedor(nombre) {
    if (confirm(`Quieres eliminar el proveedor: "${nombre}"`)) {
        fetch('/proveedores/eliminar', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nombre: nombre })
        })
        .then(response => response.text())
        .then(data => {
            window.location.reload();
        })
        .catch(error => {
            return console.error('Error al eliminar el proveedor:', error);
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const botonCrearProducto = document.getElementById('boton-nuevo-producto');
    
    botonCrearProducto.addEventListener('click', () => { window.location.href = '/proveedores/crear'; });
});