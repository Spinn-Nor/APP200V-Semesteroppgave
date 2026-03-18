import {useState} from 'react';
import {Link, NavLink} from 'react-router-dom';

function Nav() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    // Reusable list of nav links
    const navLinks = [
        { to: "/", label: "Home" },
        { to: "/rooms", label: "Rooms" },
        { to: "/locations", label: "Locations" },
        { to: "/spa", label: "Spa" },
        { to: "/conference", label: "Conference Rooms" },
        { to: "/business", label: "Business" },
        { to: "/about", label: "About" },
    ];

  return (
    <header className="nav">
        <nav className="nav-container">
            <Link to="/" className="nav-logo">
                Blueberry Hotels
            </Link>

            {/* Desktop menu */}
            <div className="nav-links desktop">
            {navLinks.map((link) => (
                <NavLink
                key={link.to}
                to={link.to}
                className="nav-item"
                >
                {link.label}
                </NavLink>
            ))}
            </div>

            {/*Desktop menu - right side */}
            <div className="nav-actions desktop">
                <Link to="/login" className="login-link">Login / Register</Link>
                <Link to="/booking" className="book-now-btn">Book Now</Link>
            </div>

            {/* Hamburger button */}
            <button className="hamburger-btn" onClick={toggleMenu}>
                {isOpen ? '✕' : '☰'}
            </button>
        </nav>

        {/* Mobile menu */}

    </header>
  )
}

export default Nav