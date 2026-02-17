import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Route where the user MUST NOT be logged-in
const UnguardedRoute = ({ children }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // todo: improve
    }

    if (user == null) {
        return <Navigate to="/create-account" replace />;
    }

    if (isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default UnguardedRoute;
