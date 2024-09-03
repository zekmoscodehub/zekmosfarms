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
                 <option value="1" ${product.quantity === 1 ? 'selected' : ''}>1</option>
    <option value="2" ${product.quantity === 2 ? 'selected' : ''}>2</option>
    <option value="3" ${product.quantity === 3 ? 'selected' : ''}>3</option>
    <option value="4" ${product.quantity === 4 ? 'selected' : ''}>4</option>
    <option value="5" ${product.quantity === 5 ? 'selected' : ''}>5</option>
    <option value="6" ${product.quantity === 6 ? 'selected' : ''}>6</option>
    <option value="7" ${product.quantity === 7 ? 'selected' : ''}>7</option>
    <option value="8" ${product.quantity === 8 ? 'selected' : ''}>8</option>
    <option value="9" ${product.quantity === 9 ? 'selected' : ''}>9</option>
    <option value="10" ${product.quantity === 10 ? 'selected' : ''}>10</option>
    <option value="11" ${product.quantity === 11 ? 'selected' : ''}>11</option>
    <option value="12" ${product.quantity === 12 ? 'selected' : ''}>12</option>
    <option value="13" ${product.quantity === 13 ? 'selected' : ''}>13</option>
    <option value="14" ${product.quantity === 14 ? 'selected' : ''}>14</option>
    <option value="15" ${product.quantity === 15 ? 'selected' : ''}>15</option>
    <option value="16" ${product.quantity === 16 ? 'selected' : ''}>16</option>
    <option value="17" ${product.quantity === 17 ? 'selected' : ''}>17</option>
    <option value="18" ${product.quantity === 18 ? 'selected' : ''}>18</option>
    <option value="19" ${product.quantity === 19 ? 'selected' : ''}>19</option>
    <option value="20" ${product.quantity === 20 ? 'selected' : ''}>20</option>
    <option value="21" ${product.quantity === 21 ? 'selected' : ''}>21</option>
    <option value="22" ${product.quantity === 22 ? 'selected' : ''}>22</option>
    <option value="23" ${product.quantity === 23 ? 'selected' : ''}>23</option>
    <option value="24" ${product.quantity === 24 ? 'selected' : ''}>24</option>
    <option value="25" ${product.quantity === 25 ? 'selected' : ''}>25</option>
    <option value="26" ${product.quantity === 26 ? 'selected' : ''}>26</option>
    <option value="27" ${product.quantity === 27 ? 'selected' : ''}>27</option>
    <option value="28" ${product.quantity === 28 ? 'selected' : ''}>28</option>
    <option value="29" ${product.quantity === 29 ? 'selected' : ''}>29</option>
    <option value="30" ${product.quantity === 30 ? 'selected' : ''}>30</option>
    <option value="31" ${product.quantity === 31 ? 'selected' : ''}>31</option>
    <option value="32" ${product.quantity === 32 ? 'selected' : ''}>32</option>
    <option value="33" ${product.quantity === 33 ? 'selected' : ''}>33</option>
    <option value="34" ${product.quantity === 34 ? 'selected' : ''}>34</option>
    <option value="35" ${product.quantity === 35 ? 'selected' : ''}>35</option>
    <option value="36" ${product.quantity === 36 ? 'selected' : ''}>36</option>
    <option value="37" ${product.quantity === 37 ? 'selected' : ''}>37</option>
    <option value="38" ${product.quantity === 38 ? 'selected' : ''}>38</option>
    <option value="39" ${product.quantity === 39 ? 'selected' : ''}>39</option>
    <option value="40" ${product.quantity === 40 ? 'selected' : ''}>40</option>
    <option value="41" ${product.quantity === 41 ? 'selected' : ''}>41</option>
    <option value="42" ${product.quantity === 42 ? 'selected' : ''}>42</option>
    <option value="43" ${product.quantity === 43 ? 'selected' : ''}>43</option>
    <option value="44" ${product.quantity === 44 ? 'selected' : ''}>44</option>
    <option value="45" ${product.quantity === 45 ? 'selected' : ''}>45</option>
    <option value="46" ${product.quantity === 46 ? 'selected' : ''}>46</option>
    <option value="47" ${product.quantity === 47 ? 'selected' : ''}>47</option>
    <option value="48" ${product.quantity === 48 ? 'selected' : ''}>48</option>
    <option value="49" ${product.quantity === 49 ? 'selected' : ''}>49</option>
    <option value="50" ${product.quantity === 50 ? 'selected' : ''}>50</option>
    <option value="51" ${product.quantity === 51 ? 'selected' : ''}>51</option>
    <option value="52" ${product.quantity === 52 ? 'selected' : ''}>52</option>
    <option value="53" ${product.quantity === 53 ? 'selected' : ''}>53</option>
    <option value="54" ${product.quantity === 54 ? 'selected' : ''}>54</option>
    <option value="55" ${product.quantity === 55 ? 'selected' : ''}>55</option>
    <option value="56" ${product.quantity === 56 ? 'selected' : ''}>56</option>
    <option value="57" ${product.quantity === 57 ? 'selected' : ''}>57</option>
    <option value="58" ${product.quantity === 58 ? 'selected' : ''}>58</option>
    <option value="59" ${product.quantity === 59 ? 'selected' : ''}>59</option>
    <option value="60" ${product.quantity === 60 ? 'selected' : ''}>60</option>
    <option value="61" ${product.quantity === 61 ? 'selected' : ''}>61</option>
    <option value="62" ${product.quantity === 62 ? 'selected' : ''}>62</option>
    <option value="63" ${product.quantity === 63 ? 'selected' : ''}>63</option>
    <option value="64" ${product.quantity === 64 ? 'selected' : ''}>64</option>
    <option value="65" ${product.quantity === 65 ? 'selected' : ''}>65</option>
    <option value="66" ${product.quantity === 66 ? 'selected' : ''}>66</option>
    <option value="67" ${product.quantity === 67 ? 'selected' : ''}>67</option>
    <option value="68" ${product.quantity === 68 ? 'selected' : ''}>68</option>
    <option value="69" ${product.quantity === 69 ? 'selected' : ''}>69</option>
    <option value="70" ${product.quantity === 70 ? 'selected' : ''}>70</option>
    <option value="71" ${product.quantity === 71 ? 'selected' : ''}>71</option>
    <option value="72" ${product.quantity === 72 ? 'selected' : ''}>72</option>
    <option value="73" ${product.quantity === 73 ? 'selected' : ''}>73</option>
    <option value="74" ${product.quantity === 74 ? 'selected' : ''}>74</option>
    <option value="75" ${product.quantity === 75 ? 'selected' : ''}>75</option>
    <option value="76" ${product.quantity === 76 ? 'selected' : ''}>76</option>
    <option value="77" ${product.quantity === 77 ? 'selected' : ''}>77</option>
    <option value="78" ${product.quantity === 78 ? 'selected' : ''}>78</option>
    <option value="79" ${product.quantity === 79 ? 'selected' : ''}>79</option>
    <option value="80" ${product.quantity === 80 ? 'selected' : ''}>80</option>
    <option value="81" ${product.quantity === 81 ? 'selected' : ''}>81</option>
    <option value="82" ${product.quantity === 82 ? 'selected' : ''}>82</option>
    <option value="83" ${product.quantity === 83 ? 'selected' : ''}>83</option>
    <option value="84" ${product.quantity === 84 ? 'selected' : ''}>84</option>
    <option value="85" ${product.quantity === 85 ? 'selected' : ''}>85</option>
    <option value="86" ${product.quantity === 86 ? 'selected' : ''}>86</option>
    <option value="87" ${product.quantity === 87 ? 'selected' : ''}>87</option>
    <option value="88" ${product.quantity === 88 ? 'selected' : ''}>88</option>
    <option value="89" ${product.quantity === 89 ? 'selected' : ''}>89</option>
    <option value="90" ${product.quantity === 90 ? 'selected' : ''}>90</option>
    <option value="91" ${product.quantity === 91 ? 'selected' : ''}>91</option>
    <option value="92" ${product.quantity === 92 ? 'selected' : ''}>92</option>
    <option value="93" ${product.quantity === 93 ? 'selected' : ''}>93</option>
    <option value="94" ${product.quantity === 94 ? 'selected' : ''}>94</option>
    <option value="95" ${product.quantity === 95 ? 'selected' : ''}>95</option>
    <option value="96" ${product.quantity === 96 ? 'selected' : ''}>96</option>
    <option value="97" ${product.quantity === 97 ? 'selected' : ''}>97</option>
    <option value="98" ${product.quantity === 98 ? 'selected' : ''}>98</option>
    <option value="99" ${product.quantity === 99 ? 'selected' : ''}>99</option>
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
