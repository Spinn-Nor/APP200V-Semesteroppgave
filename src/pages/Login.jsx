/**
 * Login.jsx
 * 
 * Login and Register page with Firebase Authentication.
 * 
 * @author Fredrik Fordelsen - Fixed register function
 * @author Victor Orby - setup layout and design
 * @version 1.2
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

function Login() {
    const [activeTab, setActiveTab] = useState('login');

    // Login form
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Register form
    const [signupFirstName, setSignupFirstName] = useState('');   // ← Denne manglet
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await login(loginEmail, loginPassword);
            navigate('/');
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError('');

        if (signupPassword !== signupConfirmPassword) {
            setError("Passwords do not match");
            return;
        }

        if (signupPassword.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        if (!signupFirstName.trim()) {
            setError("First name is required");
            return;
        }

        setLoading(true);

        try {
            await register(signupEmail, signupPassword, signupFirstName);
            navigate('/');
        } catch (err) {
            setError(err.message || "Failed to create account");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <h1>{activeTab === 'login' ? 'Welcome back' : 'Create account'}</h1>
                <p>{activeTab === 'login' ? 'Sign in to your Blueberry Hotels account' : 'Join Blueberry Hotels and start exploring'}</p>
            </div>

            <div className="login-form-wrap">
                <div className="login-tabs">
                    <button
                        className={`login-tab ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => setActiveTab('login')}
                    >
                        Login
                    </button>
                    <button
                        className={`login-tab ${activeTab === 'register' ? 'active' : ''}`}
                        onClick={() => setActiveTab('register')}
                    >
                        Register
                    </button>
                </div>

                {error && <p className="error-message">{error}</p>}

                {activeTab === 'login' && (
                    <form onSubmit={handleLogin} className="login-body">
                        <div className="form-group">
                            <label htmlFor="login-email">Email</label>
                            <input 
                                id="login-email" 
                                type="email" 
                                placeholder="you@example.com" 
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="login-password">Password</label>
                            <input 
                                id="login-password" 
                                type="password" 
                                placeholder="••••••••" 
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                        </div>

                        <a href="#" className="forgot-link">Forgot password?</a>

                        <button 
                            type="submit" 
                            className="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign in"}
                        </button>
                    </form>
                )}

                {activeTab === 'register' && (
                    <form onSubmit={handleRegister} className="login-body">
                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="reg-first">First name</label>
                                <input 
                                    id="reg-first" 
                                    type="text" 
                                    placeholder="John" 
                                    value={signupFirstName}
                                    onChange={(e) => setSignupFirstName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="reg-last">Last name</label>
                                <input id="reg-last" type="text" placeholder="Doe" />
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-email">Email</label>
                            <input 
                                id="reg-email" 
                                type="email" 
                                placeholder="you@example.com" 
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-password">Password</label>
                            <input 
                                id="reg-password" 
                                type="password" 
                                placeholder="Min. 6 characters" 
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="reg-confirm">Confirm password</label>
                            <input 
                                id="reg-confirm" 
                                type="password" 
                                placeholder="••••••••" 
                                value={signupConfirmPassword}
                                onChange={(e) => setSignupConfirmPassword(e.target.value)}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="login-submit-btn"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default Login;