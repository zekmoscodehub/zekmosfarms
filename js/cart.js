document.addEventListener('DOMContentLoaded', () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cart');

    if (cart.length > 0) {
        renderCart(cart, cartContainer);
    } else {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
});

function renderCart(cart, cartContainer) {
    cartContainer.innerHTML = '';  // Clear previous content

    cart.forEach((product, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <h3>${product.name}</h3>
            <p>Price per item: GH₵${product.price}</p>
            <label for="quantity-${product.id}">Qty:</label>
            <select id="quantity-${product.id}" onchange="updateCartItem(${index})">
                <option value="30" ${product.quantity === 30 ? 'selected' : ''}>30</option>
                <option value="50" ${product.quantity === 50 ? 'selected' : ''}>50</option>
                <option value="100" ${product.quantity === 100 ? 'selected' : ''}>100</option>
            </select>
            <p>Total Price: GH₵<span id="total-price-${product.id}">${product.totalPrice}</span></p>
            <button onclick="removeCartItem(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    const grandTotal = cart.reduce((total, product) => total + product.totalPrice, 0);
    const totalElement = document.createElement('div');
    totalElement.innerHTML = `<h3>Grand Total: GH₵<span id="grand-total">${grandTotal}</span></h3>`;
    cartContainer.appendChild(totalElement);
}

function updateCartItem(index) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart[index];
    const newQuantity = parseInt(document.getElementById(`quantity-${product.id}`).value, 10);
    product.quantity = newQuantity;
    product.totalPrice = product.price * newQuantity;

    localStorage.setItem('cart', JSON.stringify(cart));
    document.getElementById(`total-price-${product.id}`).textContent = product.totalPrice;
    updateGrandTotal(cart);
}

function removeCartItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);

    localStorage.setItem('cart', JSON.stringify(cart));
    const cartContainer = document.getElementById('cart');
    if (cart.length > 0) {
        renderCart(cart, cartContainer);
    } else {
        cartContainer.innerHTML = '<p>Your cart is empty.</p>';
    }
}

function updateGrandTotal(cart) {
    const grandTotal = cart.reduce((total, product) => total + product.totalPrice, 0);
    document.getElementById('grand-total').textContent = grandTotal;
}

function continueShopping() {
    window.location.href = 'shop.html';  // Redirect to the shop page
}

function orderNow() {
    window.location.href = 'order.html';  // Redirect to the order page
}
