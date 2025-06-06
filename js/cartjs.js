document.addEventListener('DOMContentLoaded', function() {
    loadCartFromServer();

    document.getElementById('openPaymentModal').addEventListener('click', function() {
        const paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
        paymentModal.show();
    });

    document.getElementById('paymentForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        await submitOrder();
    });
});

// שליפת העגלה מה-API החדש
async function loadCartFromServer() {
    const cartContainer = document.getElementById('cart-container');
    const idNumber = localStorage.getItem('id_number');
    const contentWrapper = document.getElementById('content-wrapper');
    const loadingSpinner = document.getElementById('loading-spinner');

    cartContainer.innerHTML = '';

    if (!idNumber) {
        alert('אנא התחבר כדי לצפות בעגלת הקניות.');
        return;
    }

    contentWrapper.style.display = 'none';
    loadingSpinner.style.display = 'flex';

    try {
        // שליפת המוצרים בעגלה כולל פרטי מוצר מה-API
        const response = await fetch(`https://r4h8ttzh90.execute-api.us-east-1.amazonaws.com/prod/cart?id_number=${idNumber}`);
        const cartItems = await response.json();

        console.log('Loaded cart items:', cartItems);

        if (!cartItems || cartItems.length === 0) {
            cartContainer.innerHTML = '<p>העגלה ריקה.</p>';
            return;
        }

        let total = 0;

        cartItems.forEach(product => {
            const productElement = document.createElement('div');
            productElement.className = 'product-cart';
            productElement.innerHTML = `
                <h2>${product.title}</h2>
                <p>${product.category}</p>
                <p>תיאור: ${product.description}</p>
                <img class="product-cart-img" src="${product.image}">
                <p>מחיר: ₪${parseFloat(product.discountedPrice || product.price).toFixed(2)}</p>
                <button class="remove-from-cart" data-id="${product.cart_id}"><i class="fas fa-trash"></i> הסר</button>
            `;
            cartContainer.appendChild(productElement);

            total += parseFloat(product.discountedPrice || product.price);
        });

        animateTotalAmount(total);

        document.querySelectorAll('.remove-from-cart').forEach(button => {
            button.addEventListener('click', async function() {
                const cartId = this.getAttribute('data-id');
                await removeFromCart(cartId);
            });
        });

    } catch (error) {
        console.error('Error loading cart:', error);
    } finally {
        loadingSpinner.style.display = 'none';
        contentWrapper.style.display = 'block';
    }
}



// מחיקת מוצר מהעגלה
async function removeFromCart(productId) {
    try {
        await fetch(`https://r4h8ttzh90.execute-api.us-east-1.amazonaws.com/prod/cart?id=${productId}`, {
            method: 'DELETE'
        });
        await loadCartFromServer();
    } catch (error) {
        console.error('Error removing item:', error);
        alert('שגיאה בהסרת מוצר מהעגלה.');
    }
}

// שליחת הזמנה
async function submitOrder() {
    const idNumber = localStorage.getItem('id_number');
    const emailInput = document.getElementById('customerEmail');
    const paymentMethodSelect = document.getElementById('paymentMethod');
    const customerEmail = emailInput.value.trim();
    const paymentMethod = paymentMethodSelect.value;

    if (!idNumber || !customerEmail || !paymentMethod) {
        alert('אנא מלא את כל שדות החובה.');
        return;
    }

    try {
        const cartResponse = await fetch(`https://r4h8ttzh90.execute-api.us-east-1.amazonaws.com/prod/cart?id_number=${idNumber}`);
        const cartItems = await cartResponse.json();

        if (!cartItems || cartItems.length === 0) {
            alert('העגלה ריקה.');
            return;
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + parseFloat(item.price), 0);

        const orderResponse = await fetch('https://meody9hrdf.execute-api.us-east-1.amazonaws.com/prod/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: idNumber,
                customer_email: customerEmail,
                products: cartItems,
                total_amount: totalAmount,
                payment_method: paymentMethod
            })
        });

        const orderData = await orderResponse.json();
        console.log('Order saved:', orderData);

        if (orderResponse.ok) {
            alert('התשלום הושלם בהצלחה! אישור ישלח במייל.');
            await clearCart(); // ניקוי העגלה
            window.location.href = 'index.html'; // חזרה לדף הבית
        } else {
            alert('שגיאה בביצוע התשלום: ' + (orderData.error || ''));
        }

    } catch (error) {
        console.error('Error submitting order:', error);
        alert('שגיאה בתהליך השליחה.');
    }
}

// ניקוי העגלה לאחר ביצוע ההזמנה

async function clearCart() {
    const idNumber = localStorage.getItem('id_number');

    try {
        const response = await fetch(`https://r4h8ttzh90.execute-api.us-east-1.amazonaws.com/prod/cart?id_number=${idNumber}`, {
            method: 'DELETE'
        });

        const data = await response.json();
        console.log('Cart cleared response:', data);

    } catch (error) {
        console.error('Error clearing cart:', error);
    }
}


// אפקט אנימציה לסכום כולל
function animateTotalAmount(total) {
    const totalAmountElement = document.getElementById('total-amount');
    if (!totalAmountElement) {
        console.error('Element #total-amount not found!');
        return;
    }
    let current = 0;
    const increment = total / 30;
    const interval = setInterval(() => {
        current += increment;
        if (current >= total) {
            current = total;
            clearInterval(interval);
        }
        totalAmountElement.textContent = current.toFixed(2);
    }, 20);
}

