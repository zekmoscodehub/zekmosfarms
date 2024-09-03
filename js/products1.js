const products = [
    { id: 1, name: 'Day-Old Chick', price: 21, description: 'Healthy day-old chicks ready for your farm.', image: 'img/daychicks.jpeg', status: 'available', category: 'day-old-birds' },
    { id: 2, name: 'Guinea Keet', price: 20, description: 'Vibrant day-old guinea keets for your farm. Best to start your farm with.', image: 'img/gc7.jpeg', status: 'available', category: 'day-old-birds' },
    { id: 3, name: 'Full-grown Guinea Fowl', price: 120, description: 'Full-grown guinea fowls for meat or breeding.', image: 'guineas-fowl.jpg', status: 'available', category: 'birds' },
    { id: 4, name: 'Incubator (XT205)', price: 3000, description: 'Medium capacity incubator, perfect for small farms.', image: 'incubators/7.jpeg', status: 'available', category: 'farm-tools' },
    { id: 5, name: 'Brooding Lamp (100W)', price: 150, description: '100 Watts, Brooding lamp to keep your chicks warm.', image: 'bro.jpeg', status: 'available', category: 'farm-tools' },
    { id: 6, name: 'Local Birds (Day-old)', price: 20, description: 'Healthy day-old chicks ready for your farm.', image: 'img/icon_chicks.png', status: 'available', category: 'general-farm-products' },
    { id: 7, name: 'Incubator (MT20)', price: 2500, description: 'Small-scale incubator for backyard poultry farming.', image: 'incubators/6.jpeg', status: 'available', category: 'farm-tools' },
    { id: 8, name: 'Chicken Dewormer', price: 35, description: 'Effective dewormer for poultry health.', image: 'vac.jpeg', status: 'sold', category: 'drugs-vaccines' },
    { id: 9, name: 'Antibiotics (50ml)', price: 30, description: 'Antibiotics for poultry to ensure proper health.', image: 'vac2.jpeg', status: 'available', category: 'drugs-vaccines' },
    { id: 10, name: 'Feed Mix (25kg)', price: 120, description: 'High-quality feed mix for optimal growth.', image: 'feed.jpeg', status: 'available', category: 'general-farm-products' }
];

const loadProducts = () => {
    const categories = document.querySelectorAll('.category');
    categories.forEach(category => {
        const categoryProducts = products.filter(product => product.category === category.id);
        const productList = category.querySelector('.product-list');
        
        categoryProducts.forEach(product => {
            const productItem = document.createElement('div');
            productItem.classList.add('product-item');
            
            const productBadge = document.createElement('span');
            productBadge.classList.add('badge');
            if (product.status === 'sold') {
                productBadge.classList.add('sold');
                productBadge.textContent = 'Sold Out';
            } else {
                productBadge.classList.add('in-stock');
                productBadge.textContent = 'In Stock';
            }

            const productImage = document.createElement('img');
            productImage.src = product.image;
            productImage.alt = product.name;

            const productDetails = document.createElement('div');
            productDetails.classList.add('details');
            
            const productTitle = document.createElement('h3');
            productTitle.textContent = product.name;

            const productDescription = document.createElement('p');
            productDescription.textContent = product.description;

            const productPrice = document.createElement('div');
            productPrice.classList.add('price');
            productPrice.textContent = `GH₵${product.price}`;

            productDetails.append(productTitle, productDescription, productPrice);
            productItem.append(productBadge, productImage, productDetails);
            productList.appendChild(productItem);
        });
    });
};

document.addEventListener('DOMContentLoaded', loadProducts);