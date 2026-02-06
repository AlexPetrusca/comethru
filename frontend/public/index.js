// DOM elements
const loginScreen = document.getElementById('login-screen');
const verificationScreen = document.getElementById('verification-screen');
const homeScreen = document.getElementById('home-screen');
const phoneNumberInput = document.getElementById('phone-number');
const verificationCodeInput = document.getElementById('verification-code');
const sendOtpBtn = document.getElementById('send-otp-btn');
const verifyBtn = document.getElementById('verify-btn');
const resendBtn = document.getElementById('resend-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginError = document.getElementById('login-error');
const verifyError = document.getElementById('verify-error');
const verifySuccess = document.getElementById('verify-success');

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    // We don't need to check for session_token cookie anymore since backend handles auth via cookies
    // Just check if user is already authenticated by making a request to a protected endpoint
    checkAuthStatus();
});

// Function to check if user is already authenticated
async function checkAuthStatus() {
    try {
        const response = await fetch('/api/time'); // This will return 401 if not authenticated
        if (response.ok) {
            showHomeScreen();
        } else {
            showLoginScreen();
        }
    } catch (error) {
        // If there's a network error, assume user is not logged in
        showLoginScreen();
    }
}

// Show login screen
function showLoginScreen() {
    loginScreen.classList.add('active');
    verificationScreen.classList.remove('active');
    homeScreen.classList.remove('active');
    clearErrors();
}

// Show verification screen
function showVerificationScreen() {
    loginScreen.classList.remove('active');
    verificationScreen.classList.add('active');
    homeScreen.classList.remove('active');
    clearErrors();
}

// Show home screen
function showHomeScreen() {
    loginScreen.classList.remove('active');
    verificationScreen.classList.remove('active');
    homeScreen.classList.add('active');
    clearErrors();

    // Fetch and display current time from backend
    fetchCurrentTime();
}

// Clear error messages
function clearErrors() {
    loginError.textContent = '';
    verifyError.textContent = '';
    verifySuccess.textContent = '';
}

// Get cookie by name
function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}

// Set cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Delete cookie
function deleteCookie(name) {
    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
}

// Send OTP
sendOtpBtn.addEventListener('click', async () => {
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber) {
        loginError.textContent = 'Please enter a phone number';
        return;
    }

    // Validate phone number format
    if (!/^\+\d{10,15}$/.test(phoneNumber)) {
        loginError.textContent = 'Please enter a valid phone number in format +1234567890';
        return;
    }

    try {
        sendOtpBtn.disabled = true;
        sendOtpBtn.textContent = 'Sending...';

        const response = await fetch('/auth/send_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber })
        });

        if (response.ok) {
            showVerificationScreen();
        } else {
            const data = await response.json();
            loginError.textContent = data.message || 'Failed to send OTP';
        }
    } catch (error) {
        loginError.textContent = 'Network error. Please try again.';
    } finally {
        sendOtpBtn.disabled = false;
        sendOtpBtn.textContent = 'Send OTP';
    }
});

// Verify OTP (Login)
verifyBtn.addEventListener('click', async () => {
    const phoneNumber = phoneNumberInput.value.trim();
    const verificationCode = verificationCodeInput.value.trim();

    if (!verificationCode) {
        verifyError.textContent = 'Please enter the verification code';
        return;
    }

    if (!/^\d{6}$/.test(verificationCode)) {
        verifyError.textContent = 'Please enter a valid 6-digit code';
        return;
    }

    try {
        verifyBtn.disabled = true;
        verifyBtn.textContent = 'Verifying...';

        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                phoneNumber,
                code: verificationCode
            })
        });

        if (response.ok) {
            verifySuccess.textContent = 'Verification successful!';
            setTimeout(() => {
                showHomeScreen();
            }, 1000);
        } else {
            const data = await response.json();
            verifyError.textContent = data.message || 'Invalid verification code';
        }
    } catch (error) {
        verifyError.textContent = 'Network error. Please try again.';
    } finally {
        verifyBtn.disabled = false;
        verifyBtn.textContent = 'Verify';
    }
});

// Resend OTP
resendBtn.addEventListener('click', async () => {
    const phoneNumber = phoneNumberInput.value.trim();

    if (!phoneNumber) {
        verifyError.textContent = 'Phone number is required';
        return;
    }

    try {
        resendBtn.disabled = true;
        resendBtn.textContent = 'Sending...';

        const response = await fetch('/auth/send_otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber })
        });

        if (response.ok) {
            verifySuccess.textContent = 'OTP sent successfully!';
        } else {
            const data = await response.json();
            verifyError.textContent = data.message || 'Failed to resend OTP';
        }
    } catch (error) {
        verifyError.textContent = 'Network error. Please try again.';
    } finally {
        resendBtn.disabled = false;
        resendBtn.textContent = 'Resend Code';
    }
});

// Get DOM elements for time functionality
const currentTimeDiv = document.getElementById('current-time');
const refreshTimeBtn = document.getElementById('refresh-time-btn');

// Function to fetch current time from backend
async function fetchCurrentTime() {
    try {
        const response = await fetch('/api/time');
        if (response.ok) {
            const data = await response.json();
            currentTimeDiv.textContent = `${data.currentTime} (Unix timestamp: ${data.timestamp})`;
        } else {
            currentTimeDiv.textContent = 'Error fetching time';
        }
    } catch (error) {
        console.error('Error fetching time:', error);
        currentTimeDiv.textContent = 'Error fetching time';
    }
}

// Refresh time button event listener
refreshTimeBtn.addEventListener('click', fetchCurrentTime);

// Logout
logoutBtn.addEventListener('click', async () => {
    try {
        const response = await fetch('/auth/logout', {
            method: 'POST',
        });

        if (response.ok) {
            phoneNumberInput.value = '';
            verificationCodeInput.value = '';
            showLoginScreen();
        } else {
            const data = await response.json();
            console.error('Logout error:', data.message || 'Failed to logout');
            // Still redirect to login screen even if logout fails
            phoneNumberInput.value = '';
            verificationCodeInput.value = '';
            showLoginScreen();
        }
    } catch (error) {
        console.error('Network error during logout:', error);
        // Redirect to login screen even if network error occurs
        phoneNumberInput.value = '';
        verificationCodeInput.value = '';
        showLoginScreen();
    }
});
