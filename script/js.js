const products = document.getElementsByClassName('product');
const ticket = document.getElementById('ticket'),
cart = document.getElementById('cart'), cartTbody = cart.querySelector('tbody');

function actualProducts() {
    return cartTbody.querySelectorAll('tr');
}

Array.from(products).forEach(product => {
    product.addEventListener('click', () => {
        var actualProductsNumber = actualProducts();

        const name = product.getElementsByTagName('h4')[0].innerText,
        price = product.getElementsByTagName('p')[0].innerText.replace('$', '');
        var existingProduct = false;
        
        if (actualProductsNumber.length > 0) {
            actualProductsNumber.forEach(product => {
                if (product.querySelector('td').innerText === name) {
                    existingProduct = product;
                    return;
                }
            });
        }

        if (!existingProduct) {
            const productCart = document.createElement('tr');
            productCart.classList.add('product-sell');
            productCart.innerHTML = `
                <td>${name}</td>
                <td>
                    <div class="product-sell-quantity-controls">
                        <button class="rounded-button" onclick="productSellQuantityChange(this, 'remove')"><i class="fa-solid fa-minus"></i></button>
                        <span class="product-sell-quantity">x1</span>
                        <button class="rounded-button" onclick="productSellQuantityChange(this, 'add')"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
                <td>$${price}</td>
                <td><button class="product-sell-remove" onclick="productSellRemove(this)"><i class="fa-solid fa-trash"></i></button></td>
            `;
            cartTbody.appendChild(productCart);
        } else {
            productSellQuantityChange(existingProduct.querySelector('.product-sell-quantity-controls'), 'add');
        }
        
        updateTotal();
    });
});

function productSellQuantityChange(button, type) {
    const productSellQuantityControls = button.parentElement;
    let quantity = productSellQuantityControls.getElementsByTagName('span')[0], quantityNumber = quantity.innerText.replace('x', '');
    
    if (type == 'add') {
        quantity.innerText = 'x' + ++quantityNumber;
    } else {
        quantity.innerText = quantityNumber > 1 ? 'x' + --quantityNumber : confirm("Quieres eliminar este producto?") ? productSellRemove(productSellQuantityControls) : 'x' + quantityNumber;
    }
}

function productSellRemove(productSellQuantityControls) {
    productSellQuantityControls.parentElement.parentElement.remove();
    updateTotal();
}

function updateTotal() {
    const actualSellProducts = actualProducts(), total = document.getElementById('total');
    var totalToPay = 0;

    actualSellProducts.forEach(product => {
        var price = parseFloat(product.querySelectorAll('td')[2].innerText.replace('$', '')), quantity = parseInt(product.querySelector('.product-sell-quantity').innerText.replace('x', ''));
        totalToPay += price * quantity;
        
    });

    total.innerHTML = `<i class="fa-solid fa-cash-register"></i> Vender - $${totalToPay.toFixed(2)}`;
}