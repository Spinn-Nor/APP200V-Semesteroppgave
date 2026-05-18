/**
 * Nav.jsx
 * 
 * Dynamic navigation bar that changes based on authentication state.
 * 
<<<<<<< HEAD
 * @author Fredrik Fordelsen - Made navigation dynamic with auth
 * @version 1.2
=======
 * @author Fredrik Fordelsen - Added cart icon and CartDrawer integration
 * @author Bendik Viken Wangen
 * @version 1.0
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148
 */

import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';
import { useAuth } from '../context/AuthContext';
import { signoutUser } from '../firebase/auth';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
<<<<<<< HEAD
=======

    const { user } = useAuth();

    const { cart } = useCart();
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148

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

<<<<<<< HEAD
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
                                    <span className="user-name">Hi, {currentUser.email?.split('@')[0]}</span>
                                    <button className="logout-btn" onClick={handleLogout}>
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
=======
                        {/* Login / Register */}
                        {user ? (
                            <>
                                <span className="user-greeting">Hello, {user.displayName}</span>

                                <button onClick={async () => {
                                    await signoutUser();
                                    setIsMenuOpen(false);
                                }}>Logout</button>
                            </>
                        ) : (
                            <Link
                                to="/login"
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148
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

<<<<<<< HEAD
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
=======
            {/* Cart Slide-in Drawer */}
            <CartDrawer
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
>>>>>>> d463073639d5ed6c16b3c70e6fdbf8f14b964148
            />
        </>
    );
}

export default Nav;