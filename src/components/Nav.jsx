import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';

function Nav() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  // List of links
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/locations", label: "Locations" },
    { to: "/hotels", label: "Hotels" },
    { to: "/wellness", label: "Wellness" },
    { to: "/events", label: "Events" },
  ];

  return (
    <header className="nav">
      <nav className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">B</div>
          <span className="logo-text">Blueberry Hotels</span>
        </Link>

        {/* Menu */}
        <div className={`nav-links ${isOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className="nav-item"
              onClick={() => setIsOpen(false)} // Close menu on click
            >
              {link.label}
            </NavLink>
          ))}
        </div>

        {/* Right side */}
        <div className="nav-actions">

          <Link to="/login" className="login-link">
            Login / Register
          </Link>

          <Link to="/booking" className="book-now-btn">
            Book Now
          </Link>
        </div>

        {/* Menu button */}
        <button className="hamburger" onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </button>
      </nav>
    </header>
  );
}

export default Nav;