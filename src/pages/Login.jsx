import { useState } from 'react';
import './Login.css';
import { loginEmailPassword, registerUser } from '../firebase/auth';

function Login() {
  const [activeTab, setActiveTab] = useState('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');

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

        {activeTab === 'login' && (
          <div className="login-body">
            {/* <form> */}
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input id="login-email" type="email" placeholder="you@example.com" onChange={(e) => setLoginEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input id="login-password" type="password" placeholder="••••••••" onChange={(e) => setLoginPassword(e.target.value)} />
            </div>

            <a href="#" className="forgot-link">Forgot password?</a>

            <button type="submit" className="login-submit-btn" onClick={() => loginEmailPassword(loginEmail, loginPassword)}>Sign in</button>
            {/* </form> */}
          </div>
        )}

        {activeTab === 'register' && (
          <div className="login-body">
            {/* <form> */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="reg-first">First name</label>
                <input id="reg-first" type="text" placeholder="John" />
              </div>
              <div className="form-group">
                <label htmlFor="reg-last">Last name</label>
                <input id="reg-last" type="text" placeholder="Doe" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="reg-email">Email</label>
              <input id="reg-email" type="email" placeholder="you@example.com" onChange={(e) => setSignupEmail(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="reg-password">Password</label>
              <input id="reg-password" type="password" placeholder="Min. 8 characters" onChange={(e) => setSignupPassword(e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="reg-confirm">Confirm password</label>
              <input id="reg-confirm" type="password" placeholder="••••••••" />
            </div>

            <button type="submit" className="login-submit-btn" onClick={() => registerUser(signupEmail, signupPassword)}>Create account</button>
            {/* </form> */}
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
