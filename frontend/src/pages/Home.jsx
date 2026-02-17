import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Home = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);

    const isFullyAuthenticated = isAuthenticated && user != null;

    return (
        <div className="container">
            <header className="header">
                <h1>ComeThru</h1>
                {isFullyAuthenticated ? (
                    <div className="user-menu-container">
                        <div
                            className="profile-icon"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            {user?.profilePicUrl ? (
                                <img
                                    src={`/api/s3/images/${user.profilePicUrl}`}
                                    alt="Profile"
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/40'; }}
                                />
                            ) : (
                                <div className="profile-placeholder">
                                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                                </div>
                            )}
                        </div>
                        {showMenu && (
                            <div className="dropdown-menu">
                                <button onClick={() => navigate('/profile')}>Profile</button>
                                <button onClick={logout}>Logout</button>
                            </div>
                        )}
                    </div>
                ) : (
                    <button onClick={() => navigate('/login')}>Login</button>
                )}
            </header>

            <main>
                <h2>Welcome to ComeThru!</h2>
                {isFullyAuthenticated ? (
                    <p>Hello, {user?.firstName}!</p>
                ) : (
                    <p>Please login to continue.</p>
                )}
            </main>
        </div>
    );
};

export default Home;
