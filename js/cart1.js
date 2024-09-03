// document.addEventListener('DOMContentLoaded', () => {
//     const cart = JSON.parse(localStorage.getItem('cart')) || [];
//     const productNameInput = document.getElementById('product-name');
//     const quantityInput = document.getElementById('quantity');
//     const amountInput = document.getElementById('amount');

//     if (cart.length > 0) {
//         // Initialize variables to store aggregated data
//         let productNames = '';
//         let totalQuantity = 0;
//         let totalPrice = 0;

//         // Iterate over the cart items
//         cart.forEach((product, index) => {
//             productNames += product.name + (index < cart.length - 1 ? ', ' : '');
//             totalQuantity += product.quantity;
//             totalPrice += product.totalPrice;
//         });

//         // Update form fields with aggregated cart data
//         productNameInput.value = productNames;
//         quantityInput.value = totalQuantity;
//         amountInput.value = `GHS ${totalPrice.toFixed(2)}`;
//     }
// });

// function payWithPaystack() {
//     const email = document.getElementById('email-address').value;
//     const amount = parseFloat(document.getElementById('amount').value.replace('GHS ', '').replace(',', '')) * 100;
//     const formData = {
//         email: email,
//         amount: amount,
//         product_name: document.getElementById('product-name').value,
//         quantity: document.getElementById('quantity').value,
//         first_name: document.getElementById('first-name').value,
//         last_name: document.getElementById('last-name').value,
//         business_name: document.getElementById('b_name').value,
//         phone: document.getElementById('mobile').value
//     };

//     const handler = PaystackPop.setup({
//         key: 'pk_test_37a0998b62f8420168b6e1fe28bb8d2827ddbde7', // Replace with your actual public key
//         email: email,
//         amount: amount,
//         currency: 'GHS',
//         metadata: {
//             custom_fields: [
//                 { display_name: "Product Name", variable_name: "product_name", value: formData.product_name },
//                 { display_name: "Quantity", variable_name: "quantity", value: formData.quantity },
//                 { display_name: "First Name", variable_name: "first_name", value: formData.first_name },
//                 { display_name: "Last Name", variable_name: "last_name", value: formData.last_name },
//                 { display_name: "Business Name", variable_name: "business_name", value: formData.business_name }
//             ]
//         },
//         callback: function(response) {
//             alert('Payment Successful!');
//             window.location.href = 'shop.html'; // Redirect to shop page

//             // Optionally, you can post the form data to your server here
//             fetch('submit_order.php', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(formData)
//             })
//             .then(response => response.json())
//             .then(data => {
//                 console.log('Success:', data);
//                 window.location.href = 'shop.html'; // Redirect to shop page
//             })
//             .catch((error) => {
//                 console.error('Error:', error);
//             });
//         },
//         onClose: function() {
//             alert('Transaction cancelled.');
//         }
//     });
//     handler.openIframe();
// }
