import { useState, useEffect } from 'react';
import './App.css';

function App() {
    const [screen, setScreen] = useState('login'); // login, verification, home
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentTime, setCurrentTime] = useState('Loading...');

    // Check auth status on mount
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/time');
            if (response.ok) {
                setScreen('home');
                fetchCurrentTime();
            } else {
                setScreen('login');
            }
        } catch (err) {
            setScreen('login');
        }
    };

    const clearMessages = () => {
        setError('');
        setSuccess('');
    };

    const handleSendOtp = async () => {
        if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
        }
        // Simple validation
        if (!/^\+\d{10,15}$/.test(phoneNumber)) {
            setError('Please enter a valid phone number in format +1234567890');
            return;
        }

        setIsLoading(true);
        clearMessages();

        try {
            const response = await fetch('/auth/send_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber })
            });

            if (response.ok) {
                setScreen('verification');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerify = async () => {
        if (!verificationCode) {
            setError('Please enter the verification code');
            return;
        }
        if (!/^\d{6}$/.test(verificationCode)) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        clearMessages();

        try {
            const response = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber, code: verificationCode })
            });

            if (response.ok) {
                setSuccess('Verification successful!');
                setTimeout(() => {
                    setScreen('home');
                    fetchCurrentTime();
                }, 1000);
            } else {
                const data = await response.json();
                setError(data.message || 'Invalid verification code');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResend = async () => {
        setIsLoading(true);
        clearMessages();
        try {
            const response = await fetch('/auth/send_otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phoneNumber })
            });

            if (response.ok) {
                setSuccess('OTP sent successfully!');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to resend OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCurrentTime = async () => {
        try {
            const response = await fetch('/api/time');
            if (response.ok) {
                const data = await response.json();
                setCurrentTime(`${data.currentTime} (Unix timestamp: ${data.timestamp})`);
            } else {
                setCurrentTime('Error fetching time');
            }
        } catch (err) {
            console.error(err);
            setCurrentTime('Error fetching time');
        }
    };

    const handleLogout = async () => {
        try {
            await fetch('/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error(err);
        } finally {
            setPhoneNumber('');
            setVerificationCode('');
            setScreen('login');
        }
    };

    return (
        <div className="container">
            <h1>ComeThru</h1>

            {screen === 'login' && (
                <div id="login-screen">
                    <div className="form-group">
                        <label htmlFor="phone-number">Phone Number:</label>
                        <input
                            type="tel"
                            id="phone-number"
                            placeholder="+1234567890"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                        />
                    </div>
                    <button onClick={handleSendOtp} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send OTP'}
                    </button>
                    {error && <div className="error">{error}</div>}
                </div>
            )}

            {screen === 'verification' && (
                <div id="verification-screen">
                    <div className="form-group">
                        <label htmlFor="verification-code">Verification Code:</label>
                        <input
                            type="text"
                            id="verification-code"
                            placeholder="Enter 6-digit code"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                        />
                    </div>
                    <button onClick={handleVerify} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button onClick={handleResend} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Resend Code'}
                    </button>
                    {error && <div className="error">{error}</div>}
                    {success && <div className="success">{success}</div>}
                </div>
            )}

            {screen === 'home' && (
                <div id="home-screen">
                    <h2>Welcome!</h2>
                    <p>You are successfully logged in.</p>
                    <div className="form-group">
                        <label>Current Time from Backend:</label>
                        <div id="current-time">{currentTime}</div>
                    </div>
                    <button onClick={fetchCurrentTime}>Refresh Time</button>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}

export default App;
