// settings.js

document.addEventListener('DOMContentLoaded', function() {

    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {

        const ttl = 3600;

        setTimeout(() => {
            localStorage.removeItem('jwt');
            alert('Sessie verlopen, je moet opnieuw inloggen');

            window.location.href = "../auth/login.html";
        }, ttl * 1000);
    } else {
        alert('Je moet ingelogd zijn hiervoor');
        window.location.href = "../auth/login.html";
    }    

    document.getElementById('preferencesForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const formData = {
            preferredApi: document.getElementById('preferredApi').value,
            colorClosed: document.getElementById('colorClosed').value,
            colorFound: document.getElementById('colorFound').value,
            email: document.getElementById('email').value
        };

        fetch('http://localhost:8000/api/player/preferences', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('jwt')
            },
            body: JSON.stringify(formData)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error('Failed to update preferences');
            }
        })
        .then(data => {
            console.log('Preferences updated successfully:', data);
            alert('Voorkeuren zijn succesvol bijgewerkt!');
        })
        .catch(error => {
            console.error('Error updating preferences:', error);
            alert('Er is een fout opgetreden bij het bijwerken van de voorkeuren.');
        });
    });
});