document.addEventListener('DOMContentLoaded', () => {
    const botonCrearProducto = document.getElementById('boton-nuevo-producto');
    
    botonCrearProducto.addEventListener('click', () => { window.location.href = '/productos/crear'; });
});

function deleteProduct(e) {
    producto = e.parentNode.parentNode;
    productoNombre = producto.querySelector('td').textContent;

    if (confirm('Deseas eliminar el producto: ' + productoNombre)) {
        id = producto.getAttribute('data-product-id');

        fetch('/productos/eliminar', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        })
        .then(response => response.json())
        .then(data => {
            if (data.message == 'Producto eliminado correctamente') {
                producto.remove();
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error al eliminar el producto:', error);
        });
    }
}