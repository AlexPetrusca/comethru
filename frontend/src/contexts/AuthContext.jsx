import { createContext, useState, useEffect, useContext } from 'react';
import BackendApiService from '../services/BackendApiService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const checkAuthStatus = async () => {
        try {
            const userData = await BackendApiService.getCurrentUser();
            setIsAuthenticated(true);
            if (userData) {
                setUser(userData);
                return userData;
            } else {
                setUser(null);
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
            await BackendApiService.logout();
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
