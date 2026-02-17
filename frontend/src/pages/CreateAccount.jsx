import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import BackendApiService from '../services/BackendApiService';
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
                const { uploadUrl, key } = await BackendApiService.getUploadUrl(selectedFile.name, selectedFile.type);
                await BackendApiService.uploadFileToS3(uploadUrl, selectedFile);
                profilePicUrl = key;
            }

            // Create User
            const updatedUser = await BackendApiService.createOrUpdateUser({
                firstName,
                lastName,
                profilePicUrl
            });

            updateUser(updatedUser);
            navigate('/');
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
