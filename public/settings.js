// settings/settings.js

document.addEventListener('DOMContentLoaded', function() {

    const jwtToken = localStorage.getItem('jwt');
    
    if (!jwtToken) {
        alert('Je moet ingelogd zijn hiervoor');
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
                throw new Error('Fout bij het updaten van voorkeuren');
            }
        })
        .then(data => {
            localStorage.setItem('formData', JSON.stringify(formData));
            console.log('Voorkeuren succesvol bijgewerkt:', data);
            alert('Voorkeuren zijn succesvol bijgewerkt!');
        })
        .catch(error => {
            console.error('Fout bij het updaten van voorkeuren:', error);
            alert('Er is een fout opgetreden bij het bijwerken van de voorkeuren.');
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
                throw new Error('Fout bij het updaten van voorkeuren');
            }
        })
        .then(data => {
            console.log('E-mailadres is bijgewerkt', data);
            alert('Je e-mailadres is bijgewerkt!');
        })
        .catch(error => {
            console.error('Fout bij het updaten van voorkeuren:', error);
            alert('Er is een fout opgetreden bij het bijwerken van de voorkeuren.');
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
            throw new Error('Fout bij het ophalen van de email');
        }
    })
    .then(data => {
        const emailInput = document.getElementById('email');
        emailInput.value = data;
    })
    .catch(error => {
        console.error('Fout bij het ophalen van e-mailadres:', error);
        const emailInput = document.getElementById('email');
        emailInput.placeholder = "E-mailadres";
    });
    
}