document.addEventListener('DOMContentLoaded', function() {
    // קריאה מ-local storage לנתונים שמצויים במערך JSON של המוצרים
    let comparedProducts = localStorage.getItem('comparedProducts');
    let productsAsObjects = [];

    if (comparedProducts) {
        comparedProducts = JSON.parse(comparedProducts); // מהפיכת המחרוזת למערך מוצרים

        // מערך חדש שבו נשמור את המוצרים כאובייקטים מסוג Product

        // מילוי המערך החדש באובייקטים מסוג Product
        comparedProducts.forEach(function(productData) {
            // יצירת אובייקט מסוג Product עבור כל מוצר והוספתו למערך החדש
            let product = new Product(
                productData.title,
                productData.category,
                productData.description,
                productData.availability,
                productData.image,
                productData.price
            );
            productsAsObjects.push(product);
        });



        let currentItem1 = document.getElementById('item11'); 
        let currentItem2 = document.getElementById('item12'); 
        let currentItem3 = document.getElementById('item13'); 
        let currentItem4 = document.getElementById('item14'); 
        let currentItem5 = document.getElementById('item15'); 
        let currentItem6 = document.getElementById('item16'); 

        let currentItem7 = document.getElementById('item17'); 
        let currentItem8 = document.getElementById('item18'); 
        let currentItem9 = document.getElementById('item19'); 
        let currentItem10 = document.getElementById('item20'); 
        let currentItem11 = document.getElementById('item21'); 
        let currentItem12 = document.getElementById('item22'); 
    

        currentItem1.textContent=productsAsObjects[0].title;
        currentItem2.textContent=productsAsObjects[0].category;
        currentItem3.textContent=productsAsObjects[0].description;
        currentItem4.textContent=productsAsObjects[0].availability;
        currentItem5.innerHTML = `<img src="${productsAsObjects[0].image}" style="max-width: 100px;">`;
        currentItem6.textContent=productsAsObjects[0].price;

        currentItem7.textContent=productsAsObjects[1].title;
        currentItem8.textContent=productsAsObjects[1].category;
        currentItem9.textContent=productsAsObjects[1].description;
        currentItem10.textContent=productsAsObjects[1].availability;
        currentItem11.innerHTML = `<img src="${productsAsObjects[1].image}"  style="max-width: 100px;">`;
        currentItem12.textContent=productsAsObjects[1].price;

    }


});


