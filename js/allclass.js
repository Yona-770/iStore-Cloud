//   (cart,compare,catalog,product) מחלקת מוצר 
class Product {
    constructor(title, category, description, availability, image, price, id) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.availability = availability;
        this.image = image;
        this.price = price;
        this.id = id; // הוספת מזהה המוצר
    }
}

//   INDEX מחלקת פרטי הטופס
class FormDetails {
    constructor(fullName, email, phone) {
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    updateNavUserLink();

    // טיפול בלחיצה על כפתור ההתנתקות
    const logoutLink = document.getElementById('logoutLink');
    logoutLink.addEventListener('click', function(event) {
        event.preventDefault(); // מניעת פעולת ברירת מחדל של הלינק
        localStorage.removeItem('username'); // מחיקת שם המשתמש מ-localStorage
        localStorage.removeItem('id_number'); // מחיקת תעודת הזהות מ-localStorage
        updateNavUserLink(); // עדכון ה-NAV לאחר התנתקות
        window.location.href = 'login.html'; // הפניה לעמוד ההתחברות
    });
});

function updateNavUserLink() {
    const navUserLink = document.getElementById('navUserLink');
    const logoutLink = document.getElementById('logoutLink');
    const cartLink = document.querySelector('a[href="cart.html"]'); 
    const adminLink = document.getElementById('adminLink');
    const ordersLink = document.getElementById('ordersLink'); 
    const username = localStorage.getItem('username');
    const idNumber = localStorage.getItem('id_number');

    if (username) {
        navUserLink.textContent = `ברוך הבא, ${username}`;
        logoutLink.style.display = 'flex';
        cartLink.style.display = 'flex';
        ordersLink.style.display = 'flex'; 

        if (idNumber === '999999999' && username === 'admin') {
            adminLink.style.display = 'flex';
        } else {
            adminLink.style.display = 'none';
        }
    } else {
        navUserLink.innerHTML = '<a href="login.html"><i class="fas fa-user"></i> התחברות</a>';
        logoutLink.style.display = 'none';
        cartLink.style.display = 'none';
        ordersLink.style.display = 'none'; 
        adminLink.style.display = 'none';
    }
}





