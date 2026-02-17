import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const response = await fetch('/api/users/me');
            if (response.ok) {
                const userData = await response.json();
                setUser(userData);
                setIsAuthenticated(true);
                return userData;
            } else if (response.status === 404) {
                // User is authenticated (valid token) but profile doesn't exist
                setUser(null);
                setIsAuthenticated(true);
                return null;
            } else {
                setUser(null);
                setIsAuthenticated(false);
                return null;
            }
        } catch (err) {
            console.error('Auth check failed', err);
            setUser(null);
            setIsAuthenticated(false);
            return null;
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const login = (userData) => {
        setUser(userData);
        setIsAuthenticated(true);
    };

    const logout = async () => {
        try {
            await fetch('/auth/logout', { method: 'POST' });
        } catch (err) {
            console.error('Logout failed', err);
        } finally {
            setUser(null);
            setIsAuthenticated(false);
        }
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout, updateUser, checkAuthStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
