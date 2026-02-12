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

// Password validation
const signupPassword = document.getElementById('signupPassword');
const signupPasswordRepeat = document.getElementById('signupPasswordRepeat');

function validatePassword() {
    const password = signupPassword.value;
    
    // Check length
    const lengthReq = document.getElementById('req-length');
    if (password.length >= 8) {
        lengthReq.classList.add('valid');
    } else {
        lengthReq.classList.remove('valid');
    }
    
    // Check complexity
    const complexityReq = document.getElementById('req-complexity');
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (hasUppercase && hasLowercase && hasNumber && hasSpecial) {
        complexityReq.classList.add('valid');
    } else {
        complexityReq.classList.remove('valid');
    }
}

signupPassword.addEventListener('input', validatePassword);

// Validate all required fields for signup
function validateSignupForm() {
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim();
    const company = document.getElementById('signupCompany').value.trim();
    const country = document.getElementById('signupCountry').value;
    const telegram = document.getElementById('signupTelegram').value.trim();
    const password = signupPassword.value;
    const passwordRepeat = signupPasswordRepeat.value;
    const termsAccepted = document.getElementById('acceptTerms').checked;
    
    const submitBtn = document.getElementById('signupBtn');
    
    // Check if all fields are filled
    const allFieldsFilled = name && email && company && country && telegram && 
                           password && passwordRepeat && termsAccepted;
    
    // Check password requirements
    const lengthValid = password.length >= 8;
    const complexityValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && 
                           /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const passwordsMatch = password === passwordRepeat;
    
    // Enable/disable button
    if (allFieldsFilled && lengthValid && complexityValid && passwordsMatch) {
        submitBtn.disabled = false;
    } else {
        submitBtn.disabled = true;
    }
}

// Add event listeners to all signup form fields
document.getElementById('signupName').addEventListener('input', validateSignupForm);
document.getElementById('signupEmail').addEventListener('input', validateSignupForm);
document.getElementById('signupCompany').addEventListener('input', validateSignupForm);
document.getElementById('signupCountry').addEventListener('change', validateSignupForm);
document.getElementById('signupTelegram').addEventListener('input', validateSignupForm);
signupPassword.addEventListener('input', function() {
    validatePassword();
    validateSignupForm();
});
signupPasswordRepeat.addEventListener('input', validateSignupForm);
document.getElementById('acceptTerms').addEventListener('change', validateSignupForm);

// Initial validation
validateSignupForm();

// Sign up form submission
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const password = signupPassword.value;
    const passwordRepeat = signupPasswordRepeat.value;
    
    // Check if passwords match
    if (password !== passwordRepeat) {
        alert('Passwords do not match!');
        return;
    }
    
    // Check password requirements
    const lengthValid = password.length >= 8;
    const complexityValid = /[A-Z]/.test(password) && /[a-z]/.test(password) && 
                           /[0-9]/.test(password) && /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    if (!lengthValid || !complexityValid) {
        alert('Please meet all password requirements!');
        return;
    }
    
    // Check terms acceptance
    if (!document.getElementById('acceptTerms').checked) {
        alert('Please accept the Terms and Conditions!');
        return;
    }
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const company = document.getElementById('signupCompany').value;
    const country = document.getElementById('signupCountry').value;
    const telegram = document.getElementById('signupTelegram').value;
    
    // Store user info
    localStorage.setItem('userName', name);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userCompany', company);
    localStorage.setItem('userCountry', country);
    localStorage.setItem('userTelegram', telegram);
    localStorage.setItem('userRole', 'client');
    
    // Redirect to client dashboard
    alert('Account created successfully!');
    window.location.href = 'client/dashboard.html';
});

// Google Sign Up
function signupWithGoogle() {
    // In a real application, this would integrate with Google OAuth
    alert('Google sign up would be integrated here. Please complete all additional fields after Google authentication.');
    
    // Pre-fill email and name from Google (simulated)
    document.getElementById('signupName').value = 'Google User';
    document.getElementById('signupEmail').value = 'user@gmail.com';
    
    // Focus on company field
    document.getElementById('signupCompany').focus();
    
    validateSignupForm();
}
