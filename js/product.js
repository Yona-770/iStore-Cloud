document.addEventListener('DOMContentLoaded', function() {
    // קבלת המוצר שנבחר מהקטלוג - LocalStorage
    const selectedProductData = JSON.parse(localStorage.getItem('selectedProduct'));

    // בדיקת מה נשמר ב-LocalStorage
    console.log("Data from LocalStorage:", selectedProductData);

    // סיום הפונקציה אם לא נמצא המוצר
    if (!selectedProductData) {
        console.error('המוצר לא נמצא ב-Local Storage');
        return;
    }

    // בדיקה אם ה-ID קיים
    if (!selectedProductData.id) {
        console.error('מזהה מוצר לא נמצא במוצר שנבחר ב-Local Storage');
        console.log("Entire object from LocalStorage:", selectedProductData); // הוספת לוג על כל האובייקט
        return;
    }

    // יצירת אובייקט מוצר עם הנתונים
    const selectedProduct = {
        title: selectedProductData.title,
        category: selectedProductData.category,
        description: selectedProductData.description,
        availability: selectedProductData.availability,
        image: selectedProductData.image,
        price: selectedProductData.price,
        discountPercent: selectedProductData.discountPercent || 0, // אחוז ההנחה
        discountedPrice: selectedProductData.discountedPrice || selectedProductData.price, // המחיר לאחר הנחה, אם קיים
        id: selectedProductData.id // שימוש ב-id מה-LocalStorage
    };

    console.log('Selected Product ID:', selectedProduct.id); // בדיקת ID המוצר

    // הכנסת הערכים של המוצר שנבחר מהקטלוג
    document.getElementById('product-title').textContent = selectedProduct.title;
    document.getElementById('product-image').src = selectedProduct.image;
    document.getElementById('product-description').textContent = selectedProduct.description;
    document.getElementById('product-availability').textContent = `זמינות: ${selectedProduct.availability}`;

    // הצגת מחיר: אם יש הנחה, להציג את המחיר המוזל ואת המחיר המקורי
    if (selectedProduct.discountPercent > 0) {
        document.getElementById('product-price').innerHTML = `
            מחיר מקורי: <span style="text-decoration: line-through;">₪${selectedProduct.price}</span><br>
            מחיר לאחר הנחה: ₪${selectedProduct.discountedPrice}
        `;
    } else {
        document.getElementById('product-price').textContent = `מחיר: ₪${selectedProduct.price}`;
    }

    // הוספת אירוע לחיצה לכפתור הוסף לעגלה
    document.getElementById('add-to-cart-btn').addEventListener('click', async function() {
        // קריאה לפונקציה להוספת המוצר לעגלה ב-DB
        const result = await addToCart(selectedProduct);

        if (result) {
            // הצגת הודעה כאשר המוצר נוסף לעגלה
            showCustomAlert(`נוסף לעגלה ${selectedProduct.title} :המוצר`);
        }
    });
});

// פונקציה להוספת מוצר לעגלה ב-DB
// פונקציה להוספת מוצר לעגלה ב-DB
async function addToCart(product) {
    const idNumber = localStorage.getItem('id_number'); // קבלת ה-id_number מה-LocalStorage
    if (!idNumber) {
        alert('אנא התחבר כדי להוסיף מוצרים לעגלה.');
        return false;
    }

    console.log("Product ID being added to cart:", product.id); // בדיקת ID המוצר לפני הוספה

    if (!product.id) {
        alert('מזהה מוצר לא נמצא.');
        console.error('מזהה מוצר לא נמצא במוצר שנבחר.');
        return false;
    }

    try {
        // שינוי ה-URL ל-API ב-PHP
        const response = await fetch('https://r4h8ttzh90.execute-api.us-east-1.amazonaws.com/prod/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id_number: idNumber,  
                product_id: product.id 
            })
        });

        // בדיקת מצב התגובה מהשרת
        const data = await response.json();
        console.log('Response from server:', data);

        if (response.ok) {
            return true;
        } else {
            alert(data.error || 'מוצר כבר קיים בעגלה');
            return false;
        }
    } catch (error) {
        console.error('Error adding product to cart:', error);
        alert('שגיאה בחיבור לשרת.');
        return false;
    }
}


function showCustomAlert(message) {
    // ניתוב לאלמנטים ב-HTML
    const customAlert = document.getElementById('custom-alert');
    const customAlertMessage = document.getElementById('custom-alert-message');
    const customAlertCloseBtn = document.getElementById('custom-alert-close-btn');
    const goToCartBtn = document.getElementById('go-to-cart-btn');
    const goToCatalogBtn = document.getElementById('go-to-catalog-btn');

    // הצגת ההודעה והוספת התוכן
    customAlert.style.display = 'block';
    customAlertMessage.textContent = message;

    // הוספת אירוע לחיצה על כפתור הסגירה
    customAlertCloseBtn.addEventListener('click', function() {
        customAlert.style.display = 'none';
    });

    // פעולה לחיצה על כפתור "עבור לעגלה"
    goToCartBtn.addEventListener('click', function() {
        window.location.href = 'cart.html';
    });

    // פעולה לחיצה על כפתור "חזור לקטלוג מוצרים"
    goToCatalogBtn.addEventListener('click', function() {
        window.location.href = 'catalog.html';
    });
}
