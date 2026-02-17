import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Profile = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    return (
        <div className="container">
            <h1>Your Profile</h1>
            <div className="profile-details">
                {user?.profilePicUrl ? (
                    <img
                        src={`/api/s3/images/${user.profilePicUrl}`}
                        alt="Profile"
                        className="profile-pic-large"
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150'; }}
                    />
                ) : (
                    <div className="profile-pic-placeholder-large">No Image</div>
                )}
                <div className="detail-rows">
                    <div className="detail-row">
                        <strong>First Name:</strong> {user?.firstName}
                    </div>
                    <div className="detail-row">
                        <strong>Last Name:</strong> {user?.lastName}
                    </div>
                    <div className="detail-row">
                        <strong>Phone:</strong> {user?.phoneNumber}
                    </div>
                </div>
            </div>
            <button onClick={() => navigate('/')}>Back to Home</button>
        </div>
    );
};

export default Profile;
