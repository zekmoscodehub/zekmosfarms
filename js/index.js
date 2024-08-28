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
                <p>Price: GH₵${product.price}</p>
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
                <p>Price: GH₵${product.price}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
        }
    }
});

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = products.find(p => p.id === productId);
    cart.push(product);
    localStorage.setItem('cart', JSON.stringify(cart));
    alert(`${product.name} added to cart!`);
}
