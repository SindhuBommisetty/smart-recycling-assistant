// register.js
document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    const confirmPasswordError = document.getElementById('confirmPasswordError');
    const serverMessage = document.getElementById('serverMessage');

    // Function to clear error messages
    const clearErrors = () => {
        emailError.textContent = '';
        passwordError.textContent = '';
        confirmPasswordError.textContent = '';
        serverMessage.textContent = '';
        serverMessage.className = 'server-message'; // Reset class
    };

    // Basic email validation regex
    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    // Strong password validation regex
    // At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    const isStrongPassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+={}\[\]|\\:;"'<>,.?/~`]).{8,}$/;
        return regex.test(password);
    };

    registerForm.addEventListener('submit', async (event) => {
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
        } else if (!isStrongPassword(passwordInput.value.trim())) {
            passwordError.textContent = 'Password must meet complexity requirements.';
            passwordError.style.display = 'block';
            isValid = false;
        }

        // Validate Confirm Password
        if (confirmPasswordInput.value.trim() === '') {
            confirmPasswordError.textContent = 'Please confirm your password.';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        } else if (passwordInput.value.trim() !== confirmPasswordInput.value.trim()) {
            confirmPasswordError.textContent = 'Passwords do not match.';
            confirmPasswordError.style.display = 'block';
            isValid = false;
        }

        if (!isValid) {
            return; // Stop if client-side validation fails
        }

        // Prepare data for backend
        const formData = {
            email: emailInput.value.trim(),
            password: passwordInput.value.trim()
            // Note: confirmPassword is not usually sent to backend
        };

        try {
            // Replace '/api/register' with your actual backend registration endpoint
            const response = await fetch('/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json(); // Assuming backend returns JSON

            if (response.ok) { // Check if status code is 2xx
                serverMessage.textContent = data.message || 'Registration successful! You are contributing something to the environment!';
                serverMessage.classList.add('success');
                // You might auto-login or redirect to login page after successful registration
                setTimeout(() => {
                    window.location.href = '/login.html';
                }, 3000); // Redirect after 3 seconds
            } else {
                // Handle errors from the server (e.g., email already exists)
                serverMessage.textContent = data.message || 'Registration failed. Please try again.';
                serverMessage.classList.add('error');
            }
        } catch (error) {
            console.error('Network or server error during registration:', error);
            serverMessage.textContent = 'An unexpected error occurred. Please try again later.';
            serverMessage.classList.add('error');
        }
    });
});