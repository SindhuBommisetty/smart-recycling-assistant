// login.js
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const serverMessage = document.getElementById('serverMessage');

    // Function to clear error messages
    const clearErrors = () => {
        emailError.textContent = '';
        passwordError.textContent = '';
        serverMessage.textContent = '';
        serverMessage.className = 'server-message'; // Reset class
    };

    // Basic email validation regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault(); // Prevent default form submission

        clearErrors(); // Clear previous errors

        let isValid = true;

        // Validate Email
        if (emailInput.value.trim() === '') {
            emailError.textContent = 'Email is required.';
            emailError.style.display = 'block';
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = 'Please enter a valid email address.';
            emailError.style.display = 'block';
            isValid = false;
        }

        // Validate Password
        if (passwordInput.value.trim() === '') {
            passwordError.textContent = 'Password is required.';
            passwordError.style.display = 'block';
            isValid = false;
        }

        if (!isValid) {
            return; // Stop if client-side validation fails
        }

        // Prepare data for backend
        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
        };

        try {
            // Replace '/api/login' with your actual backend login endpoint
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json(); // Assuming backend returns JSON

            if (response.ok) { // Check if status code is 2xx
                serverMessage.textContent = data.message || 'Login successful! Redirecting to dashboard...';
                serverMessage.classList.add('success');
                // Simulate backend redirect to dashboard after a short delay
                setTimeout(() => {
                    window.location.href = '/dashboard.html'; // Or whatever your dashboard URL is
                }, 1500);
            } else {
                // Handle errors from the server (e.g., invalid credentials)
                serverMessage.textContent = data.message || 'Login failed. Please check your credentials.';
                serverMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Network or server error during login:', error);
            serverMessage.textContent = 'An unexpected error occurred. Please try again later.';
            serverMessage.classList.add('error');
        }
    });
});