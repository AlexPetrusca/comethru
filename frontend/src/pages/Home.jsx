import { useAuth } from '../contexts/AuthContext';
import '../App.css';

const Home = () => {
    const { user, isAuthenticated } = useAuth();

    const isFullyAuthenticated = isAuthenticated && user != null;

    return (
        <div className="container">
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
