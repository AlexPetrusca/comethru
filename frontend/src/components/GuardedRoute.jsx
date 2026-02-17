import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Route where the user MUST be logged-in
const GuardedRoute = ({ children, requireUser = true }) => {
    const { user, isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return <div>Loading...</div>; // todo: improve
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (requireUser && user == null) {
        return <Navigate to="/create-account" replace />;
    }

    return children;
};

export default GuardedRoute;
