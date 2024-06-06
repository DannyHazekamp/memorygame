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
        return;
    } 


    function parseJwt (token) {
        var base64Url = token.split('.')[1];
        var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
    
        return JSON.parse(jsonPayload);
    }

    const decodedToken = parseJwt(jwtToken);
    const userId = decodedToken.sub;   

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
});