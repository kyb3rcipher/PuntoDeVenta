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
    static cobrarDialog = document.getElementById('cobrar-ventana');

    static addProduct(product) {
        const existingProduct = Array.from(Cart.cartTbody.querySelectorAll('tr')).find(row => row.querySelector('td').innerText === product.name);
        
        if (Cart.cartTbody.querySelectorAll('tr').length == 0) {
            this.emptyMessage.style.display = 'none';
            this.total.style.visibility = 'visible';
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
                <td id="product-price">$${product.price.toFixed(2)}</td>
                <td id="product-total">$${product.price.toFixed(2)}</td>
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
        let quantity = productSellQuantityControls.getElementsByTagName('span')[0], quantityNumber = quantity.innerText.replace('x', ''),
        productPrice = document.getElementById('product-price'), productTotal = productSellQuantityControls.parentElement.querySelector('#product-total');
        console.log(productTotal);
        
        if (type == 'add') {
            quantity.innerText = 'x' + ++quantityNumber;
            productTotal.innerText = '$' + parseFloat(parseFloat(productPrice.innerText.replace('$', '')) * quantityNumber).toFixed(2);
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
            this.emptyMessage.style.display = 'table-row';
            this.total.style.visibility = 'hidden';
        }
    }

    static updateTotal() {
        const actualSellProducts = this.cartTbody.querySelectorAll('tr');
        let totalToPay = 0;

        actualSellProducts.forEach(product => {
            var price = parseFloat(product.querySelectorAll('td')[2].innerText.replace('$', '')), quantity = parseInt(product.querySelector('.product-sell-quantity').innerText.replace('x', ''));
            totalToPay += price * quantity;
        });
        totalToPay = totalToPay.toFixed(2);
        
        this.total.innerHTML = `<i class="fa-solid fa-cash-register"></i> Vender - $${totalToPay}`;
        this.cobrarDialog.querySelector('strong').innerText = 'Total: $' + totalToPay;
    }

    static cobrarVenta() {
        const cobrarWindow = document.getElementById('cobrar-ventana'), cobrarDialog = cobrarWindow.querySelector('dialog'), buttonCobrar = document.getElementById('cobrar'), buttonClose = document.getElementById('close'), pagoInput = cobrarWindow.querySelector('input');
        const total = cobrarWindow.querySelector('h1').innerText.replace('Total: $', '');
        
        pagoInput.value = total;
        pago();
        pagoInput.addEventListener('input', pago);
        function pago() {
            let pago = cobrarWindow.querySelector('input').value,
            cambioText = cobrarWindow.querySelector('h3'), cambio;
            
            cambio = parseFloat(pago - total).toFixed(2);
            cambioText.innerText = 'Cambio: $' + cambio;
            
            if (parseFloat(pago) >= parseFloat(total)) {
                buttonCobrar.classList.add('green-button');
                buttonCobrar.style.cursor = 'default';
                
            } else {
                buttonCobrar.classList.remove('green-button');
                buttonCobrar.style.cursor = 'not-allowed';
                cambioText.innerHTML = 'Cambio: ---';
            }
        }
        
        // Boton de cierre de dialog[popup-window] de cobro
        buttonClose.addEventListener('click', () => {
            cobrarDialog.close();
            cobrarWindow.classList.toggle('active');
        });
        
        // Cobrar function
        buttonCobrar.addEventListener('click', function () {
            if (buttonCobrar.classList.contains('green-button')) {
                
            } else {
                alert('No se puede cobrar un pago menor al total de la venta');
            }
        });
        
        
        cobrarDialog.showModal();
        cobrarWindow.classList.toggle('active');
        pagoInput.select();
    }
}

// Create objets for each product and add they code
document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.querySelector('nav'),
        toggleSideBar = document.querySelector(".toggle");
    const productElements = document.getElementsByClassName('product'), 
        buttonCobrar = document.getElementById('total');
    
    Array.from(productElements).forEach(product => new Product(product));
    
    buttonCobrar.addEventListener('click', Cart.cobrarVenta);
    
    toggleSideBar.addEventListener('click' , () =>{
        sidebar.classList.toggle('close');
    });
});