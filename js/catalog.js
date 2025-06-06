// שהדף נטען
document.addEventListener('DOMContentLoaded', async function() {
    getOptionBycategory();
    document.getElementById('search-btn').addEventListener('click', serchProductsByBtn);
    const products = await fetchProducts();
    const productFlex = document.getElementById('product-flex');
    products.forEach(product => {
        const productCard = createProductCard(product);
        productFlex.appendChild(productCard);
    });
});

// פונקציה לשליפת מוצרים מהשרת
async function fetchProducts() {
    try {
        const response = await fetch('https://lgw4wgncs2.execute-api.us-east-1.amazonaws.com/prod/products');
        const result = await response.json();
        const products = JSON.parse(result.body); 
        console.log('Fetched products:', products); 
        return products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}

// פונקציה ליצירת כרטיס מוצר
function createProductCard(product) {
    const productCard = document.createElement('div');
    productCard.classList.add('product-card');
    productCard.dataset.category = product.category;
    productCard.dataset.manufacturer = product.manufacturer;
    productCard.dataset.price = product.price;

    // בדיקת אם קיימת הנחה
    let priceDisplay = `<p>₪${product.price}</p>`;
    let finalPrice = product.price;

    if (product.discountPercent && product.discountPercent > 0) {
        priceDisplay = `
        <p>
            <s>₪${product.price}</s> 
            <span style="color: red;">₪${product.discountedPrice}</span>
            <span>(${product.discountPercent}% הנחה)</span>
        </p>
        `;
        finalPrice = product.discountedPrice;
    }

    // יצירת HTML של כרטיס המוצר
    productCard.innerHTML = `
        <h2>${product.title}</h2>
        <button class="compare-product"
            data-id="${product.id}" 
            data-title="${product.title}"
            data-category="${product.category}"
            data-description="${product.description}"
            data-availability="${product.availability}"
            data-manufacturer="${product.manufacturer}"
            data-image="${product.image}"
            data-price="${finalPrice}">
            <i class="fas fa-balance-scale"></i> 
        </button>
        <img src="${product.image}">
        ${priceDisplay}
        <button class="btn btn-primary add-to-cart"
            data-id="${product.id}" 
            data-title="${product.title}"
            data-category="${product.category}"
            data-description="${product.description}"
            data-availability="${product.availability}"
            data-manufacturer="${product.manufacturer}"
            data-image="${product.image}"
            data-price="${finalPrice}">
            <i class="fas fa-shopping-cart"></i> לפרטים ולרכישה
        </button>
    `;

    // הוספת אירוע לחיצה לפרטים ולרכישה
    const addToCartButton = productCard.querySelector('.add-to-cart');
    addToCartButton.addEventListener('click', function() {
        const product = {
            id: this.getAttribute('data-id'),
            title: this.getAttribute('data-title'),
            category: this.getAttribute('data-category'),
            description: this.getAttribute('data-description'),
            availability: this.getAttribute('data-availability'),
            image: this.getAttribute('data-image'),
            price: parseFloat(this.getAttribute('data-price'))
        };

        localStorage.setItem('selectedProduct', JSON.stringify(product));
        window.location.href = 'product-details.html';
    });

    // הוספת אירוע לחיצה להשוואה
    const compareButton = productCard.querySelector('.compare-product');
    compareButton.addEventListener('click', function() {
        const product = {
            id: this.getAttribute('data-id'),
            title: this.getAttribute('data-title'),
            category: this.getAttribute('data-category'),
            description: this.getAttribute('data-description'),
            availability: this.getAttribute('data-availability'),
            image: this.getAttribute('data-image'),
            price: parseFloat(this.getAttribute('data-price'))
        };

        addToComparison(product);
    });

    return productCard;
}

// אובייקט יצרנים לפי קטגוריה
const manufacturers = {
    "טלפונים": [
        { value: "iphone", text: "iPhone" },
        { value: "Samsung", text: "Samsung" }
    ],
    "קונסולות": [
        { value: "sony", text: "Sony" },
        { value: "microsoft", text: "Microsoft" },
        { value: "nintendo", text: "Nintendo" }
    ],
    "מסכים": [
        { value: "lg", text: "LG" }
    ],
    "מחשבים": [
        { value: "lenovo", text: "Lenovo" },
        { value: "asus", text: "Asus" },
        { value: "dell", text: "Dell" }
    ]
};

// בחירת יצרן לפי קטגוריה
function getOptionBycategory() {
    const categoryElement = document.getElementById('category');
    if (categoryElement) {
        categoryElement.addEventListener('change', function() {
            const selectedCategory = this.value;
            const manufacturerSelect = document.getElementById('manufacturer');
            manufacturerSelect.innerHTML = '<option value="">בחר יצרן</option>';

            if (selectedCategory) {
                const options = manufacturers[selectedCategory];
                options.forEach(manufacturer => {
                    const optionElement = document.createElement('option');
                    optionElement.value = manufacturer.value;
                    optionElement.textContent = manufacturer.text;
                    manufacturerSelect.appendChild(optionElement);
                });
            }
        });
    } else {
        console.error('Element with id "category" not found.');
    }
}

// חיפוש מוצרים לפי פרמטרים
function serchProductsByBtn() {
    const selectedCategory = document.getElementById('category').value;
    const selectedManufacturer = document.getElementById('manufacturer').value;
    const minPrice = document.getElementById('minPrice').value;
    const maxPrice = document.getElementById('maxPrice').value;
    const imgnotfound = document.getElementById('imageDiv');

    const products = document.querySelectorAll('.product-card');
    let productsFound = false;

    products.forEach(function(product) {
        const productMF = product.getAttribute('data-manufacturer');
        const productCategory = product.getAttribute('data-category');
        const productPrice = parseFloat(product.getAttribute('data-price'));

        const isCategoryMatch = !selectedCategory || productCategory === selectedCategory;
        const isManufacturerMatch = !selectedManufacturer || productMF === selectedManufacturer;
        const isPriceMatch = (!minPrice || productPrice >= parseFloat(minPrice)) && (!maxPrice || productPrice <= parseFloat(maxPrice));

        if (isCategoryMatch && isManufacturerMatch && isPriceMatch) {
            product.style.display = 'flex';
            productsFound = true;
        } else {
            product.style.display = 'none';
        }
    });

    if (!productsFound) {
        imgnotfound.classList.remove("hidden");
        imgnotfound.classList.add("visible");
    } else {
        imgnotfound.classList.remove("visible");
        imgnotfound.classList.add("hidden");
    }
}

// הוספת מוצר להשוואה
function addToComparison(product) {
    let comparedProducts = JSON.parse(localStorage.getItem('comparedProducts')) || [];

    if (comparedProducts.length < 2) {
        comparedProducts.push(product);
        localStorage.setItem('comparedProducts', JSON.stringify(comparedProducts));
        if (comparedProducts.length === 1) {
            alert("מוצר 1/2 נוסף להשוואה בהצלחה");
        }
        if (comparedProducts.length === 2) {
            alert("מוצר 2/2 נוסף להשוואה בהצלחה");
        }
    }

    if (comparedProducts.length === 2) {
        showComparisonPopup();
    }
}

// הצגת חלון קופץ להשוואת מוצרים
function showComparisonPopup() {
    const modal = document.getElementById('myModal');
    modal.style.display = 'block';

    const comparisonProductsDiv = document.getElementById('comparisonProducts');
    comparisonProductsDiv.innerHTML = '';

    const comparedProducts = JSON.parse(localStorage.getItem('comparedProducts')) || [];

    comparedProducts.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.classList.add('product-container');

        const productImg = document.createElement('img');
        productImg.src = product.image;

        const productName = document.createElement('p');
        productName.textContent = product.title;
        productName.classList.add('product-name');

        productContainer.appendChild(productName); 
        productContainer.appendChild(productImg);

        comparisonProductsDiv.appendChild(productContainer);
    });
}

// מעבר לדף השוואה
function compareProducts() {
    window.location.href = 'compare.html';
}

// ניקוי רשימת ההשוואה
function clearComparison() {
    localStorage.removeItem('comparedProducts');
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
}
