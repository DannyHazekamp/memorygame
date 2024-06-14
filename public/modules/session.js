let sessionTimeout;

export function handleSession() {

    const jwtToken = localStorage.getItem('jwt');
    
    if (!localStorage.getItem('formData')) {
        const defaultFormData = {
            api: 'dogs',
            color_found: '#800080', 
            color_closed: '#90ee90'
        };
    
        localStorage.setItem('formData', JSON.stringify(defaultFormData));
    }

    if (!jwtToken) {
        alert('Je moet ingelogd zijn om deze pagina te bezoeken');
        window.location.href = "/index.html";
        return;
    }

    const decodedToken = parseJwt(jwtToken);
    const currentTime = Math.floor(Date.now() / 1000);
    const tokenExpiration = decodedToken.exp;
    const userId = decodedToken.sub;
    localStorage.setItem('userId', userId);

    if (currentTime >= tokenExpiration) {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        localStorage.removeItem('formData');
        localStorage.removeItem('gameDurations');
        alert('Sessie verlopen, je moet opnieuw inloggen');
        window.location.href = "/index.html";
    } else {
        const timeUntilExpiration = (tokenExpiration - currentTime) * 1000;
        setupSessionTimeout(timeUntilExpiration);
    }
}

export function logout() {
    document.getElementById('logout-button').addEventListener('click', function() {
        localStorage.clear();
        window.location.href = '/index.html';
    });
}

function setupSessionTimeout(timeoutDuration) {
    clearTimeout(sessionTimeout); 

    sessionTimeout = setTimeout(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        localStorage.removeItem('formData');
        localStorage.removeItem('gameDurations');
        alert('Sessie verlopen, je moet opnieuw inloggen');
        window.location.href = "/index.html";
    }, timeoutDuration);
}

function parseJwt(token) {

    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
