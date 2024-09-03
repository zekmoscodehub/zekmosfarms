// Get references to form and necessary input fields
const paymentForm = document.getElementById('paymentForm');
const emailAddress = document.getElementById('email-address');
const mobileNumber = document.getElementById('mobile');
const quantitySelect = document.getElementById('quantity');
const amountInput = document.getElementById('amount');
const firstName = document.getElementById('first-name');
const lastName = document.getElementById('last-name');
const businessName = document.getElementById('b-name');


// Event listener for form submission
paymentForm.addEventListener("submit", payWithPaystack);

function payWithPaystack(e) {
    e.preventDefault();

    // Ensure quantity is selected and amount is calculated
    if (!quantitySelect.value) {
        alert('Please select the quantity of birds you want to order.');
        return;
    }

    // Extract numerical value from amount input
    const amountValue = parseFloat(amountInput.value.replace('GHS ', '').replace(/,/g, ''));
    
    // Validate amount
    if (isNaN(amountValue) || amountValue <= 0) {
        alert('Invalid amount. Please select a valid quantity.');
        return;
    }

    // Initialize Paystack payment
    let handler = PaystackPop.setup({
        key: 'YOUR_PUBLIC_KEY', // Replace with your public key
        email: emailAddress.value,
        amount: amountValue * 100, // Convert to kobo
        currency: 'GHS',
        ref: 'ZHF_' + Math.floor((Math.random() * 1000000000) + 1), // Unique reference
        metadata: {
            custom_fields: [
                {
                    display_name: "Mobile Number",
                    variable_name: "mobile_number",
                    value: mobileNumber.value
                },
                {
                    display_name: "First Name",
                    variable_name: "first_name",
                    value: firstName.value
                },
                {
                    display_name: "Last Name",
                    variable_name: "last_name",
                    value: lastName.value
                },
                {
                    display_name: "Business Name",
                    variable_name: "business_name",
                    value: businessName.value || 'N/A'
                },
                {
                    display_name: "Quantity",
                    variable_name: "quantity",
                    value: quantitySelect.value
                }
            ]
        },
        onClose: function() {
            alert('Payment window closed.');
        },
        callback: function(response) {
            let message = 'Payment successful! With your order reference No: ' + response.reference;
            alert(message);
            // You can redirect or perform other actions here
        }
    });

    handler.openIframe();
}

// Calculate amount on quantity change
quantitySelect.addEventListener('change', function() {
    const quantity = parseInt(quantitySelect.value);
    const pricePerBird = 15; // GHS 15 per bird
    const totalAmount = quantity * pricePerBird;
    amountInput.value = `GHS ${totalAmount.toFixed(2)}`;
});

// Initialize amount on page load if quantity is pre-selected
window.addEventListener('load', function() {
    if (quantitySelect.value) {
        const event = new Event('change');
        quantitySelect.dispatchEvent(event);
    }
});
