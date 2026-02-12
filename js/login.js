// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const button = input.nextElementSibling;
    
    if (input.type === 'password') {
        input.type = 'text';
        button.textContent = '🙈';
    } else {
        input.type = 'password';
        button.textContent = '👁️';
    }
}

// Login form submission
document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Store user info
    localStorage.setItem('userEmail', email);
    
    // In a real application, you would validate credentials and determine role from backend
    // For demo, redirect to client dashboard
    window.location.href = 'client/dashboard.html';
});

// Google Login
function loginWithGoogle() {
    // In a real application, this would integrate with Google OAuth
    alert('Google login would be integrated here.');
    
    localStorage.setItem('userEmail', 'demo@google.com');
    localStorage.setItem('userName', 'Google User');
    
    window.location.href = 'client/dashboard.html';
}
