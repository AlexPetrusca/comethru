import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import CreateAccount from './pages/CreateAccount';
import Profile from './pages/Profile';
import GuardedRoute from './components/GuardedRoute.jsx';
import './App.css';
import UnguardedRoute from "./components/UnguardedRoute.jsx";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/login" element={
                        <UnguardedRoute>
                            <Login />
                        </UnguardedRoute>
                    } />

                    <Route
                        path="/create-account"
                        element={
                            <GuardedRoute requireUser={false}>
                                <CreateAccount />
                            </GuardedRoute>
                        }
                    />

                    <Route
                        path="/profile"
                        element={
                            <GuardedRoute>
                                <Profile />
                            </GuardedRoute>
                        }
                    />

                    <Route path="/" element={
                        <Home />
                    } />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
