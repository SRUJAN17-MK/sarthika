// Dashboard JavaScript - Protected page logic

// Check authentication and redirect if not logged in
function checkAuth() {
    const session = sessionStorage.getItem('auth_session') || localStorage.getItem('auth_session');
    
    if (!session) {
        // No session found, redirect to login
        window.location.href = 'login.html';
        return null;
    }
    
    try {
        return JSON.parse(session);
    } catch (error) {
        // Invalid session data, redirect to login
        sessionStorage.removeItem('auth_session');
        localStorage.removeItem('auth_session');
        window.location.href = 'login.html';
        return null;
    }
}

// Get user initial for avatar
function getInitial(username) {
    return username ? username.charAt(0).toUpperCase() : 'U';
}

// Display user information
function displayUserInfo(session) {
    const userInitial = document.getElementById('user-initial');
    const displayUsername = document.getElementById('display-username');
    const displayEmail = document.getElementById('display-email');
    const infoUsername = document.getElementById('info-username');
    const infoEmail = document.getElementById('info-email');
    
    if (userInitial) {
        userInitial.textContent = getInitial(session.userId);
    }
    
    if (displayUsername) {
        displayUsername.textContent = session.userId;
    }
    
    if (displayEmail) {
        displayEmail.textContent = session.email;
    }
    
    if (infoUsername) {
        infoUsername.textContent = session.userId;
    }
    
    if (infoEmail) {
        infoEmail.textContent = session.email;
    }
}

// Handle logout
function logout() {
    // Clear session from both storage types
    sessionStorage.removeItem('auth_session');
    localStorage.removeItem('auth_session');
    
    // Redirect to login page
    window.location.href = 'login.html';
}

// Initialize dashboard
function initDashboard() {
    const session = checkAuth();
    
    if (session) {
        displayUserInfo(session);
        
        // Add logout button event listener
        const logoutBtn = document.getElementById('logout-btn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', logout);
        }
    }
}

// Run on page load
document.addEventListener('DOMContentLoaded', initDashboard);
