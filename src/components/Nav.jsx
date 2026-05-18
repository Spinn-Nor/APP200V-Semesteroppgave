/**
 * Nav.jsx
 * 
 * Dynamic navigation bar that changes based on authentication state.
 * 
 * @author Fredrik Fordelsen & Bendik Viken Wangen - Made navigation dynamic with auth
 * @version 1.2
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import { signoutUser } from '../firebase/auth';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);

    const { currentUser, logout } = useAuth();
    const { cart } = useCart();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/hotels", label: "Hotels" },
        { to: "/wellness", label: "Wellness" },
        { to: "/events", label: "Events" },
    ];

    return (
        <>
            <header className="nav">
                <nav className="nav-container">

                    {/* Logo */}
                    <Link to="/" className="nav-logo">
                        <div className="logo-icon">B</div>
                        <span className="logo-text">Blueberry Hotels</span>
                    </Link>

                    {/* Navigation Links */}
                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        {navLinks.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                className="nav-item"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </NavLink>
                        ))}

                        {/* Auth Links */}
                        {currentUser ? (
                            <>
                                <NavLink 
                                    to="/my-bookings" 
                                    className="nav-item"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    My Bookings
                                </NavLink>

                                <div className="nav-user">
                                    <span className="user-name">Hi, {currentUser?.displayName || currentUser?.email?.split('@')[0] || "User"}</span>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="login-btn"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login / Register
                            </Link>
                        )}

                        {/* Cart Icon */}
                        <div
                            className="nav-cart-icon"
                            onClick={() => setIsCartOpen(true)}
                        >
                            🛒
                            {cart.length > 0 && (
                                <span className="cart-count">{cart.length}</span>
                            )}
                        </div>
                    </div>

                    {/* Hamburger */}
                    <button className="hamburger" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </nav>
            </header>

            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </>
    );
}

export default Nav;