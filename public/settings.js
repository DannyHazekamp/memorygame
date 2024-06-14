document.addEventListener('DOMContentLoaded', function() {

    const jwtToken = localStorage.getItem('jwt');
    
    if (!jwtToken) {
        window.location.href = "index.html";
        return;
    } 

    const backButton = document.getElementById('backButton');
    backButton.addEventListener('click', function() {
        window.location.href = "memory.html";
    });

    const userId = localStorage.getItem('userId');
    loadUserPreferences();

    document.getElementById('preferencesForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            api: document.getElementById('api').value,
            color_closed: document.getElementById('color_closed').value,
            color_found: document.getElementById('color_found').value,
        };

        fetch(`http://localhost:8000/api/player/${userId}/preferences`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.status === 204) {
                return;
            } else if (response.ok) {
                return response.json;
            } else {
                throw new Error('Er is een fout opgetreden bij het bijwerken van je voorkeuren.');
            }
        })
        .then(data => {
            let successMessage = document.getElementById('successMessage');
            let errorMessage = document.getElementById('errorMessage');

            successMessage.textContent = 'Je voorkeuren zijn succesvol bijgewerkt!';
            errorMessage.textContent = '';
            localStorage.setItem('formData', JSON.stringify(formData));
        })
        .catch(error => {
            console.error('Er is een fout opgetreden bij het bijwerken van je voorkeuren:', error);
            let successMessage = document.getElementById('successMessage');
            let errorMessage = document.getElementById('errorMessage');
                
            errorMessage.textContent = 'Er is een fout opgetreden bij het bijwerken van je voorkeuren';
            successMessage.textContent = '';
        });
    });



    document.getElementById('emailForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            email: document.getElementById('email').value
        };

        fetch(`http://localhost:8000/api/player/${userId}/email`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.status === 204) {
                return;
            } else if (response.ok) {
                return response.json;
            } else {
                throw new Error('Fout bij het bijwerken van je voorkeuren');
            }
        })
        .then(data => {
            console.log('Je e-mailadres is bijgewerkt', data);
            let successMessageEmail = document.getElementById('successMessageEmail');
            let errorMessageEmail = document.getElementById('errorMessageEmail');

            successMessageEmail.textContent = 'Je e-mailadres is bijgewerkt';
            errorMessageEmail.textContent = '';
        })
        .catch(error => {
            console.error('Fout bij het updaten van je voorkeuren:', error);
            let successMessageEmail = document.getElementById('successMessageEmail');
            let errorMessageEmail = document.getElementById('errorMessageEmail');
                
            errorMessageEmail.textContent = 'Er is een fout opgetreden bij het bijwerken van je e-mail';
            successMessageEmail.textContent = '';
        });
    });

    loadUserPreferences();
});

function loadUserPreferences() {
    const storedPreferences = JSON.parse(localStorage.getItem('formData'));
    if (storedPreferences) {
        document.getElementById('api').value = storedPreferences.api;
        document.getElementById('color_closed').value = storedPreferences.color_closed;
        document.getElementById('color_found').value = storedPreferences.color_found;
    }

    const userId = localStorage.getItem('userId');
    fetch(`http://localhost:8000/api/player/${userId}/email`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + localStorage.getItem('jwt')
        }
    })
    .then(response => {
        if (response.status === 204) {
            return;
        } else if (response.ok) {
            return response.json();
        } else {
            throw new Error('Fout bij het ophalen van je e-mailadres');
        }
    })
    .then(data => {
        const emailInput = document.getElementById('email');
        emailInput.value = data;
    })
    .catch(error => {
        console.error('Fout bij het ophalen van je e-mailadres:', error);
        const emailInput = document.getElementById('email');
        emailInput.placeholder = "E-mailadres";
    });
    
}