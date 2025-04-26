document.addEventListener('DOMContentLoaded', function () {
    checkValidityFunction();
    const buttons = document.querySelectorAll('.movetocatalog');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            window.location.href = 'catalog.html';
        });
    });
});

function checkValidityFunction() {
    const form = document.getElementById('registrationForm');

    form.addEventListener('submit', async function (event) {
        event.preventDefault(); // Prevent the default form submission behavior
        if (form.checkValidity()) {
            const fullName = document.getElementById('fullName').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;

            // Create formData object
            const formData = { fullName, email, phone }; // הכנת אובייקט JSON לנתונים

            try {
                const response = await fetch('https://gml9kqreh5.execute-api.us-east-1.amazonaws.com/prod/addform', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formData)
                });
                
                

                const data = await response.json();
                console.log("שרת החזיר:", data); // ← הדפס מה באמת התקבל
                console.log("נשלח לשרת:", JSON.stringify(formData));
                

                if (response.ok) {
                    alert(data.message); // הצגת ההודעה למשתמש
                    //alert('פרטי יצירת הקשר נשלחו ונשמרו בהצלחה');
                    form.reset(); // Clear the form after successful submission
                    form.classList.remove('was-validated');
                } else {
                    alert(data.error || 'Error saving details');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Server connection error');
            }
        } else {
            event.stopPropagation(); // אם יש שדות לא תקינים, מתבצעת הפסקת הפעולה
            form.classList.add('was-validated'); // מוסיפים את המחלקה was-validated לטופס כדי להציג למשתמש את השגיאות
        }
    });
}
