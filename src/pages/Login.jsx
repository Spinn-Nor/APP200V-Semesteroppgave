<<<<<<< HEAD
/**
 * Login and Register page with Firebase Authentication.
 * 
 * @author Victory Orby - setup, layout and styling
 * @author Fredrik Fordelsen - Added Firebase functionality
 * @version 1.1
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';
=======
import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import './Login.css';
import { loginEmailPassword, registerUser } from '../firebase/auth';
import { useAuth } from '../context/AuthContext';
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148

function Login() {
  const [activeTab, setActiveTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupFirstName, setSignupFirstName] = useState('');
  const [signupLastName, setSignupLastName] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login, register } = useAuth();   // ← Bruker register fra AuthContext
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

    setLoading(true);

    try {
      await register(signupEmail, signupPassword);   // ← Kaller register fra context
      navigate('/');
    } catch (err) {
      setError(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  const { user } = useAuth();

  // redirects user to homepage on successful login 
  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  async function handleLogin(e) {
    e.preventDefault();

    await loginEmailPassword(loginEmail, loginPassword);
  }

  async function handleRegister(e) {
    e.preventDefault();

    await registerUser(signupFirstName, signupLastName, signupEmail, signupPassword);
  }

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
<<<<<<< HEAD
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
=======
          <div className="login-body">
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="login-email">Email</label>
                <input id="login-email" type="email" placeholder="you@example.com" onChange={(e) => setLoginEmail(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="login-password">Password</label>
                <input id="login-password" type="password" placeholder="••••••••" onChange={(e) => setLoginPassword(e.target.value)} />
              </div>
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148

              <a href="#" className="forgot-link">Forgot password?</a>

<<<<<<< HEAD
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
                <input id="reg-first" type="text" placeholder="John" />
=======
              <button type="submit" className="login-submit-btn" >Sign in</button>
            </form>
          </div>
        )}

        {activeTab === 'register' && (
          <div className="login-body">
            <form onSubmit={handleRegister}>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="reg-first">First name</label>
                  <input id="reg-first" type="text" placeholder="John" onChange={(e) => setSignupFirstName(e.target.value)} />
                </div>
                <div className="form-group">
                  <label htmlFor="reg-last">Last name</label>
                  <input id="reg-last" type="text" placeholder="Doe" onChange={(e) => setSignupLastName(e.target.value)} />
                </div>
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148
              </div>

              <div className="form-group">
                <label htmlFor="reg-email">Email</label>
                <input id="reg-email" type="email" placeholder="you@example.com" onChange={(e) => setSignupEmail(e.target.value)} />
              </div>

<<<<<<< HEAD
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
=======
              <div className="form-group">
                <label htmlFor="reg-password">Password</label>
                <input id="reg-password" type="password" placeholder="Min. 8 characters" onChange={(e) => setSignupPassword(e.target.value)} />
              </div>

              <div className="form-group">
                <label htmlFor="reg-confirm">Confirm password</label>
                <input id="reg-confirm" type="password" placeholder="••••••••" />
              </div>

              <button type="submit" className="login-submit-btn" >Create account</button>
            </form>
          </div>
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148
        )}
      </div>
    </div>
  );
}

export default Login;