import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const TopBar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const isFullyAuthenticated = isAuthenticated && user != null;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowMenu(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="top-bar">
            <div className="top-bar-left">
                <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
                    <div className="logo-icon">CT</div>
                    <span className="company-name">ComeThru</span>
                </div>
            </div>
            <div className="top-bar-right">
                <button className="create-button" onClick={() => navigate('/create')}>
                    + Create
                </button>
                {isFullyAuthenticated ? (
                    <div className="user-menu-container" ref={menuRef}>
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
                    <button className="login-button" onClick={() => navigate('/login')}>
                        Login
                    </button>
                )}
            </div>
        </div>
    );
};

export default TopBar;
