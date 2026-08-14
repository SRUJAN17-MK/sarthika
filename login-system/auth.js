// Authentication System - Client-side Demo
// WARNING: This is for educational purposes only. Do NOT use for production security.

// Utility function to hash passwords using SHA-256
async function hashPassword(password) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

// Get users from localStorage
function getUsers() {
    const users = localStorage.getItem('auth_users');
    return users ? JSON.parse(users) : [];
}

// Save users to localStorage
function saveUsers(users) {
    localStorage.setItem('auth_users', JSON.stringify(users));
}

// Validate email format
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Validate password strength
function isValidPassword(password) {
    // At least 8 characters and one number
    const minLength = password.length >= 8;
    const hasNumber = /\d/.test(password);
    return minLength && hasNumber;
}

// Show error message
function showError(elementId, message) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
    }
}

// Clear error message
function clearError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
    }
}

// Clear all error messages
function clearAllErrors() {
    const errorElements = document.querySelectorAll('.error-message');
    errorElements.forEach(el => el.textContent = '');
}

// Check if on register page
function isRegisterPage() {
    return document.getElementById('register-form') !== null;
}

// Check if on login page
function isLoginPage() {
    return document.getElementById('login-form') !== null;
}

// Handle Registration
if (isRegisterPage()) {
    const registerForm = document.getElementById('register-form');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');
    
    // Password visibility toggles
    const passwordToggle = document.getElementById('password-toggle');
    const confirmPasswordToggle = document.getElementById('confirm-password-toggle');
    
    passwordToggle.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
    });
    
    confirmPasswordToggle.addEventListener('click', () => {
        const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
        confirmPasswordInput.type = type;
    });
    
    // Real-time validation
    usernameInput.addEventListener('input', () => {
        clearError('username-error');
    });
    
    emailInput.addEventListener('input', () => {
        clearError('email-error');
    });
    
    passwordInput.addEventListener('input', () => {
        clearError('password-error');
    });
    
    confirmPasswordInput.addEventListener('input', () => {
        clearError('confirm-password-error');
    });
    
    // Form submission
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        
        const username = usernameInput.value.trim();
        const email = emailInput.value.trim();
        const password = passwordInput.value;
        const confirmPassword = confirmPasswordInput.value;
        
        let isValid = true;
        
        // Validate username
        if (!username) {
            showError('username-error', 'Username is required.');
            isValid = false;
        } else if (username.length < 3) {
            showError('username-error', 'Username must be at least 3 characters.');
            isValid = false;
        }
        
        // Validate email
        if (!email) {
            showError('email-error', 'Email is required.');
            isValid = false;
        } else if (!isValidEmail(email)) {
            showError('email-error', 'Please enter a valid email address.');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('password-error', 'Password is required.');
            isValid = false;
        } else if (!isValidPassword(password)) {
            showError('password-error', 'Password must be at least 8 characters with one number.');
            isValid = false;
        }
        
        // Validate confirm password
        if (!confirmPassword) {
            showError('confirm-password-error', 'Please confirm your password.');
            isValid = false;
        } else if (password !== confirmPassword) {
            showError('confirm-password-error', 'Passwords do not match.');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Check if username or email already exists
        const users = getUsers();
        const usernameExists = users.some(user => user.username.toLowerCase() === username.toLowerCase());
        const emailExists = users.some(user => user.email.toLowerCase() === email.toLowerCase());
        
        if (usernameExists) {
            showError('username-error', 'This username is already taken.');
            return;
        }
        
        if (emailExists) {
            showError('email-error', 'This email is already registered.');
            return;
        }
        
        // Hash password and create user
        try {
            const passwordHash = await hashPassword(password);
            
            const newUser = {
                username: username,
                email: email,
                passwordHash: passwordHash,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            saveUsers(users);
            
            // Redirect to login page
            alert('Account created successfully! Please login.');
            window.location.href = 'login.html';
        } catch (error) {
            console.error('Error creating account:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Handle Login
if (isLoginPage()) {
    const loginForm = document.getElementById('login-form');
    const loginIdentifierInput = document.getElementById('login-identifier');
    const loginPasswordInput = document.getElementById('login-password');
    
    // Password visibility toggle
    const passwordToggle = document.getElementById('password-toggle');
    
    passwordToggle.addEventListener('click', () => {
        const type = loginPasswordInput.type === 'password' ? 'text' : 'password';
        loginPasswordInput.type = type;
    });
    
    // Real-time validation
    loginIdentifierInput.addEventListener('input', () => {
        clearError('login-identifier-error');
    });
    
    loginPasswordInput.addEventListener('input', () => {
        clearError('login-password-error');
    });
    
    // Form submission
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        clearAllErrors();
        
        const identifier = loginIdentifierInput.value.trim();
        const password = loginPasswordInput.value;
        
        let isValid = true;
        
        // Validate identifier
        if (!identifier) {
            showError('login-identifier-error', 'Username or email is required.');
            isValid = false;
        }
        
        // Validate password
        if (!password) {
            showError('login-password-error', 'Password is required.');
            isValid = false;
        }
        
        if (!isValid) {
            return;
        }
        
        // Hash the entered password
        try {
            const passwordHash = await hashPassword(password);
            
            // Find user by username or email
            const users = getUsers();
            const user = users.find(u => 
                (u.username.toLowerCase() === identifier.toLowerCase() || 
                 u.email.toLowerCase() === identifier.toLowerCase()) &&
                u.passwordHash === passwordHash
            );
            
            if (user) {
                // Create session
                const session = {
                    userId: user.username,
                    email: user.email,
                    loggedInAt: new Date().toISOString()
                };
                
                sessionStorage.setItem('auth_session', JSON.stringify(session));
                localStorage.setItem('auth_session', JSON.stringify(session));
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
            } else {
                // Generic error message (don't reveal which credential was wrong)
                showError('login-identifier-error', 'Invalid username/email or password.');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('An error occurred. Please try again.');
        }
    });
}

// Check if user is already logged in and redirect
function checkExistingSession() {
    const session = sessionStorage.getItem('auth_session') || localStorage.getItem('auth_session');
    if (session && (isRegisterPage() || isLoginPage())) {
        window.location.href = 'dashboard.html';
    }
}

// Run on page load
checkExistingSession();
