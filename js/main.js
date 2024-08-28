document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const productDetail = document.getElementById('product-detail');

    // Load products to the shop page
    if (productList) {
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: GH₵${product.price} per item</p>
                <label for="quantity-${product.id}">Qty:</label>
                <select id="quantity-${product.id}">
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productItem);
        });
    }

    // Load product detail page
    if (productDetail) {
        const params = new URLSearchParams(window.location.search);
        const productId = parseInt(params.get('id'), 10);
        const product = products.find(p => p.id === productId);

        if (product) {
            productDetail.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h2>${product.name}</h2>
                <p>${product.description}</p>
                <p>Price: GH₵${product.price} per item</p>
                <label for="quantity-${product.id}">Qty:</label>
                <select id="quantity-${product.id}">
                    <option value="30">30</option>
                    <option value="50">50</option>
                    <option value="100">100</option>
                </select>
                <button id="order-now-btn" onclick="prepareOrder(${product.id})">Order Now</button>
            `;
        }
    }
});
function addToCart(productId) {
    const quantitySelect = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantitySelect.value, 10);
    const product = products.find(p => p.id === productId);
    const price = product.price * quantity;

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProduct = cart.find(item => item.id === productId);

    if (existingProduct) {
        existingProduct.quantity += quantity;
        existingProduct.totalPrice += price;
    } else {
        cart.push({ ...product, quantity, totalPrice: price });
    }

    localStorage.setItem('cart', JSON.stringify(cart));

    // Store cart details in sessionStorage
    sessionStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.name} (${quantity}) added to cart!`);
}


function prepareOrder(productId) {
    const quantitySelect = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantitySelect.value, 10);
    const product = products.find(p => p.id === productId);
    const totalAmount = product.price * quantity;

    // Store the values in sessionStorage
    sessionStorage.setItem('productName', product.name);
    sessionStorage.setItem('productQuantity', quantity);
    sessionStorage.setItem('totalAmount', totalAmount);

    // Redirect to order page
    window.location.href = 'order.html';
}
