/**
 * Nav.jsx
 * 
 * Main navigation bar for Blueberry Hotels.
 * Includes logo, navigation links, login button and cart icon with slide-in drawer.
 * 
 * @author Fredrik Fordelsen - Added cart icon and CartDrawer integration
 * @version 1.0
 */

import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import CartDrawer from '../components/CartDrawer';

function Nav() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    
    const { cart } = useCart();

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/locations", label: "Locations" },
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

                    {/* Desktop Navigation Links */}
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

                        {/* Login / Register */}
                        <Link
                            to="/login"
                            className="login-btn"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Login / Register
                        </Link>

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

                    {/* Hamburger Button for Mobile */}
                    <button className="hamburger" onClick={toggleMenu}>
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                </nav>
            </header>

            {/* Cart Slide-in Drawer */}
            <CartDrawer 
                isOpen={isCartOpen} 
                onClose={() => setIsCartOpen(false)} 
            />
        </>
    );
}

export default Nav;