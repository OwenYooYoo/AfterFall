document.addEventListener('DOMContentLoaded', () => {
    const profileLink = document.querySelector('.icon.fa-user');

    if (profileLink) {
        profileLink.addEventListener('click', (event) => {
            event.preventDefault();
            fetch('/check-session', {
                method: 'GET',
                credentials: 'same-origin' // 'same-origin' for cookies to be included
            }).then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            }).then(data => {
                if (data.loggedIn) {
                    window.location.href = '/profile.html';
                } else {
                    window.location.href = '/login.html';
                }
            }).catch(error => {
                console.error('Error:', error);
            });
        });
    }
});
