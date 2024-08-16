class Product {
    constructor(product) {
        this.product = product;

        this.name = product.querySelector('h4').innerText;
        this.price = parseFloat(product.querySelector('p').innerText.replace('$', ''));

        this.product.addEventListener('click', this.addToCart.bind(this));
    }

    addToCart() {
        Cart.addProduct(this);
    }
}

class Cart {
    static cartTbody = document.getElementById('cart').querySelector('tbody');
    static total = document.getElementById('total');
    static emptyMessage = document.getElementById('empty-message');
    static emptyMessageCopy = this.emptyMessage.cloneNode(true);

    static addProduct(product) {
        const existingProduct = Array.from(Cart.cartTbody.querySelectorAll('tr')).find(row => row.querySelector('td').innerText === product.name);
        
        if (Cart.cartTbody.querySelectorAll('tr').length == 0) {
            this.emptyMessage.remove();
        }

        if (!existingProduct) {
            const productCart = document.createElement('tr');
            productCart.classList.add('product-sell');
            productCart.innerHTML = `
                <td>${product.name}</td>
                <td>
                    <div class="product-sell-quantity-controls">
                        <button class="rounded-button" onclick="Cart.productSellQuantityChange(this, 'remove')"><i class="fa-solid fa-minus"></i></button>
                        <span class="product-sell-quantity">x1</span>
                        <button class="rounded-button" onclick="Cart.productSellQuantityChange(this, 'add')"><i class="fa-solid fa-plus"></i></button>
                    </div>
                </td>
                <td>$${product.price}</td>
                <td><button class="product-sell-remove" onclick="Cart.productSellRemove(this)"><i class="fa-solid fa-trash"></i></button></td>
            `;
            
            this.cartTbody.appendChild(productCart);
        } else {
            this.productSellQuantityChange(existingProduct.querySelector('.product-sell-quantity-controls'), 'add');
        }

        this.updateTotal();
    }

    static productSellQuantityChange(button, type) {
        const productSellQuantityControls = button.parentElement;
        let quantity = productSellQuantityControls.getElementsByTagName('span')[0], quantityNumber = quantity.innerText.replace('x', '');
        
        if (type == 'add') {
            quantity.innerText = 'x' + ++quantityNumber;
        } else {
            if (quantityNumber > 1) {
                quantity.innerText = 'x' + --quantityNumber;
            } else if (confirm("¿Quieres eliminar este producto?")) {
                this.productSellRemove(button);
            }
        }

        this.updateTotal();
    }

    static productSellRemove(button) {
        button.closest('tr').remove();
        this.updateTotal();

        if (Cart.cartTbody.querySelectorAll('tr').length <= 0) {
            document.getElementById('cart').querySelector('thead').appendChild(this.emptyMessageCopy);
        }
    }

    static updateTotal() {
        const actualSellProducts = this.cartTbody.querySelectorAll('tr');
        let totalToPay = 0;

        actualSellProducts.forEach(product => {
            var price = parseFloat(product.querySelectorAll('td')[2].innerText.replace('$', '')), quantity = parseInt(product.querySelector('.product-sell-quantity').innerText.replace('x', ''));
            totalToPay += price * quantity;
            
        });
    
        this.total.innerHTML = `<i class="fa-solid fa-cash-register"></i> Vender - $${totalToPay.toFixed(2)}`;
    }
}

// Create objets for each product and add they code
document.addEventListener('DOMContentLoaded', () => {
    const productElements = document.getElementsByClassName('product');
    
    Array.from(productElements).forEach(product => new Product(product));
});