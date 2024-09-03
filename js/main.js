document.addEventListener('DOMContentLoaded', () => {
    const productList = document.getElementById('product-list');
    const productDetail = document.getElementById('product-detail');

    // Load products to the shop page
    if (productList) {
        products.forEach(product => {
            const productItem = document.createElement('div');
            productItem.className = 'product-item';
            productItem.id = `product-${product.id}`;
            productItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: GH₵${product.price} per item</p>
                <label for="quantity-${product.id}">Qty:</label>
                <select id="quantity-${product.id}">
                    ${[...Array(100).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
                <button onclick="addToCart(${product.id}, this)" class="btn">Add to Cart</button>
                <div class="go-to-cart" style="display:none;">
                    <a href="cart.html" style="text-decoration:none;" class="go-to-cart">Go to Cart</a>
                </div>
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
                    ${[...Array(100).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                </select>
                <button id="order-now-btn" onclick="prepareOrder(${product.id})">Order Now</button>
            `;
        }
    }
});

function addToCart(productId, button) {
    const quantitySelect = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantitySelect.value, 10);
    const product = products.find(p => p.id === productId);
    const price = product.price * quantity;
    const goToCartButton = button.nextElementSibling;

    button.innerHTML = '<div class="loading"></div> Adding item...';
    button.disabled = true;

    setTimeout(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const existingProduct = cart.find(item => item.id === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
            existingProduct.totalPrice += price;
        } else {
            cart.push({ ...product, quantity, totalPrice: price });
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        sessionStorage.setItem('cart', JSON.stringify(cart));

        button.innerHTML = 'Added!';
        goToCartButton.style.display = 'inline';

        const alertMessage = document.getElementById('alertMessage');
        const alertText = document.getElementById('alertText');

        if (alertMessage && alertText) {
            alertText.innerText = 'Item added to cart!';
            alertMessage.style.display = 'block';
            setTimeout(() => alertMessage.style.display = 'none', 3000);
        } else {
            console.error('Alert message or text element not found.');
        }

        button.disabled = false; // Re-enable the button after adding
    }, 1000);
}

function prepareOrder(productId) {
    const quantitySelect = document.getElementById(`quantity-${productId}`);
    const quantity = parseInt(quantitySelect.value, 10);
    const product = products.find(p => p.id === productId);
    const totalAmount = product.price * quantity;

    sessionStorage.setItem('productName', product.name);
    sessionStorage.setItem('productQuantity', quantity);
    sessionStorage.setItem('totalAmount', totalAmount);

    window.location.href = 'order.html';
}
function isStorageAvailable(type) {
    try {
        const storage = window[type];
        const testKey = '__storage_test__';
        storage.setItem(testKey, testKey);
        storage.removeItem(testKey);
        return true;
    } catch (e) {
        return e instanceof DOMException && (
            // everything except Firefox
            e.code === 22 ||
            // Firefox
            e.code === 1014 ||
            // test name field too, because code might not be present
            // everything except Firefox
            e.name === 'QuotaExceededError' ||
            // Firefox
            e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
            // acknowledge QuotaExceededError only if there's something already stored
            storage.length !== 0;
    }
}

if (!isStorageAvailable('localStorage')) {
    console.warn('LocalStorage is not available. Fallback or alternative storage required.');
    // Implement alternative logic here
}
