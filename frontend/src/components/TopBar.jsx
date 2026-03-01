import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {useClickOutside} from "../hooks/ClickOutside.jsx";
import '../App.css';

const TopBar = () => {
    const { user, isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef(null);

    const isFullyAuthenticated = isAuthenticated && user != null;

    useClickOutside(menuRef, () => setShowMenu(false));

    const handleProfileClick = () => {
        navigate('/profile');
        setShowMenu(false);
    };

    const handleLogoutClick = () => {
        logout();
        setShowMenu(false);
    };

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
                                <button onClick={handleProfileClick}>Profile</button>
                                <button onClick={handleLogoutClick}>Logout</button>
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
