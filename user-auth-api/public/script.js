document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');
    const loginForm = document.getElementById('login-form');
    const registerFormContainer = document.getElementById('register-form-container');
    const loginFormContainer = document.getElementById('login-form-container');
    const profileContainer = document.getElementById('profile-container');
    const authContainer = document.getElementById('auth-container');
    const message = document.getElementById('message');
    const showLogin = document.getElementById('show-login');
    const showRegister = document.getElementById('show-register');
    const logoutBtn = document.getElementById('logout-btn');

    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');

    const API_URL = 'http://localhost:5000/api/users';

    // Show login form
    showLogin.addEventListener('click', (e) => {
        e.preventDefault();
        registerFormContainer.style.display = 'none';
        loginFormContainer.style.display = 'block';
    });

    // Show register form
    showRegister.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormContainer.style.display = 'none';
        registerFormContainer.style.display = 'block';
    });

    // Register form submit
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const password = document.getElementById('register-password').value;

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                showMessage('Registration successful!');
                showProfile(data.name, data.email);
            } else {
                showMessage(data.message, true);
            }
        } catch (err) {
            showMessage('An error occurred', true);
        }
    });

    // Login form submit
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                showMessage('Login successful!');
                showProfile(data.name, data.email);
            } else {
                showMessage(data.message, true);
            }
        } catch (err) {
            showMessage('An error occurred', true);
        }
    });

    // Logout button
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        authContainer.style.display = 'block';
        profileContainer.style.display = 'none';
        showMessage('Logged out successfully');
    });

    // Show profile
    function showProfile(name, email) {
        profileName.textContent = name;
        profileEmail.textContent = email;
        authContainer.style.display = 'none';
        profileContainer.style.display = 'block';
    }

    // Show message
    function showMessage(msg, isError = false) {
        message.textContent = msg;
        message.style.color = isError ? 'red' : 'green';
    }

    // Check for token on page load
    async function checkToken() {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const res = await fetch(`${API_URL}/profile`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                const data = await res.json();

                if (res.ok) {
                    showProfile(data.name, data.email);
                } else {
                    localStorage.removeItem('token');
                }
            } catch (err) {
                localStorage.removeItem('token');
            }
        }
    }

    checkToken();
});
