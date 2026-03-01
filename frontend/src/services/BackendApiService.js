const BackendApiService = {
    sendOtp: async (phoneNumber) => {
        const response = await fetch('/auth/send_otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber })
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Failed to send OTP');
        }
    },

    verifyOtp: async (phoneNumber, code) => {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phoneNumber, code })
        });
        if (!response.ok) {
            const data = await response.json().catch(() => ({}));
            throw new Error(data.message || 'Invalid code');
        }
    },

    getCurrentUser: async () => {
        const response = await fetch('/api/users/me');
        if (response.status === 404) {
            return null; // Authenticated but no profile
        }
        if (!response.ok) {
            throw new Error('Failed to fetch user');
        }
        return await response.json();
    },

    logout: async () => {
        await fetch('/auth/logout', { method: 'POST' });
    },

    getUploadUrl: async (filename, contentType) => {
        const response = await fetch('/api/s3/images', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename, contentType })
        });
        if (!response.ok) {
            throw new Error('Failed to get upload URL');
        }
        return await response.json(); // { uploadUrl, key }
    },

    uploadFileToS3: async (uploadUrl, file) => {
        const response = await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
            headers: { 'Content-Type': file.type }
        });
        if (!response.ok) {
            throw new Error('Failed to upload file to S3');
        }
    },

    createOrUpdateUser: async (userData) => {
        const response = await fetch('/api/users/me', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        if (!response.ok) {
            throw new Error('Failed to update profile');
        }
        return await response.json();
    }
};

export default BackendApiService;
