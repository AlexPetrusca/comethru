import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const CreateAccount = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();

    const handleFileSelect = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSubmit = async () => {
        if (!firstName || !lastName) {
            setError('Please enter your first and last name');
            return;
        }
        setIsLoading(true);
        setError('');

        try {
            let profilePicUrl = null;

            // Upload image if selected
            if (selectedFile) {
                const urlResponse = await fetch(`/api/s3/upload-url?filename=${encodeURIComponent(selectedFile.name)}&contentType=${encodeURIComponent(selectedFile.type)}`);
                if (urlResponse.ok) {
                    const { uploadUrl, key } = await urlResponse.json();
                    const uploadResponse = await fetch(uploadUrl, {
                        method: 'PUT',
                        body: selectedFile,
                        headers: { 'Content-Type': selectedFile.type }
                    });
                    if (uploadResponse.ok) {
                        profilePicUrl = key;
                    }
                }
            }

            // Create User
            const response = await fetch('/api/users/me', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    profilePicUrl
                })
            });

            if (response.ok) {
                const updatedUser = await response.json();
                updateUser(updatedUser);
                navigate('/');
            } else {
                setError('Failed to create account');
            }
        } catch (err) {
            console.error(err);
            setError('Error creating account');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container">
            <h1>Create Account</h1>
            <div className="form-group">
                <label>First Name</label>
                <input
                    type="text"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Last Name</label>
                <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                />
            </div>
            <div className="form-group">
                <label>Profile Picture</label>
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                />
            </div>
            {error && <div className="error">{error}</div>}
            <button onClick={handleSubmit} disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Account'}
            </button>
        </div>
    );
};

export default CreateAccount;
