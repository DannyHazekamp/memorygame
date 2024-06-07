export function handleAuth() {
    const jwtToken = localStorage.getItem('jwt');
    if (jwtToken) {
        const decodedToken = parseJwt(jwtToken);
        const userId = decodedToken.sub;
        localStorage.setItem('userId', userId);
    } else {
        alert('Je moet ingelogd zijn hiervoor');
        window.location.href = "/index.html";
    }

    if (!localStorage.getItem('formData')) {
        localStorage.setItem('formData', JSON.stringify({
            api: 'dogs',
            color_closed: '#90ee90',
            color_found: '#800080'
        }));
    }
}

export function setupSessionTimeout() {
    const jwtToken = localStorage.getItem('jwt');
    const ttl = 3600;

    setTimeout(() => {
        localStorage.removeItem('jwt');
        localStorage.removeItem('userId');
        localStorage.removeItem('formData');
        localStorage.removeItem('gameDurations');
        alert('Sessie verlopen, je moet opnieuw inloggen');
        window.location.href = "/index.html";
    }, ttl * 1000);
}

function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}
