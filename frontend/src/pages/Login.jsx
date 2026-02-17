import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackendApiService from '../services/BackendApiService';
import '../App.css';

const Login = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [step, setStep] = useState('phone'); // 'phone' or 'otp'
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, checkAuthStatus } = useAuth();
    const navigate = useNavigate();

    const handleSendOtp = async () => {
        if (!phoneNumber) {
            setError('Please enter a phone number');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await BackendApiService.sendOtp(phoneNumber);
            setStep('otp');
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerifyOtp = async () => {
        if (!verificationCode) {
            setError('Please enter the code');
            return;
        }
        setIsLoading(true);
        setError('');
        try {
            await BackendApiService.verifyOtp(phoneNumber, verificationCode);

            // Login successful (cookie set), now get user details
            const user = await checkAuthStatus();

            // If user is null but authentication succeeded (404 from /me), redirect to create account
            if (!user) {
                navigate('/create-account');
            } else {
                navigate('/');
            }
        } catch (err) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Login</h1>
            {step === 'phone' ? (
                <div className="form-group">
                    <label>Phone Number</label>
                    <input
                        type="tel"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        placeholder="+1234567890"
                    />
                    <button onClick={handleSendOtp} disabled={isLoading}>
                        {isLoading ? 'Sending...' : 'Send Code'}
                    </button>
                </div>
            ) : (
                <div className="form-group">
                    <label>Verification Code</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="123456"
                    />
                    <button onClick={handleVerifyOtp} disabled={isLoading}>
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </button>
                    <button className="link-button" onClick={() => setStep('phone')}>
                        Change Phone Number
                    </button>
                </div>
            )}
            {error && <div className="error">{error}</div>}
        </div>
    );
};

export default Login;
