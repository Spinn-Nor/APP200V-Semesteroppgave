/**
 * Resuable footer
 * @author Fredrik Fordelsen
 * @version 1.0
 */

import { Link } from "react-router-dom";
import "../styles/Footer.css";

function Footer() {
  return (
    <footer className="main-footer">
      <div className="footer-container container">
        <div className="footer-content">
          {/* Left Column - Brand */}
          <div className="footer-column">
            <h3>Blueberry Hotels</h3>
            <p>Luxury accommodations and wellness experiences across Norway.</p>
          </div>

          {/* Middle Column - Quick Links */}
          <div className="footer-column">
            <h4>Quick Links</h4>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/hotels">Our Hotels</Link>
              </li>
              <li>
                <Link to="/wellness">Wellness & Spa</Link>
              </li>
              <li>
                <Link to="/restaurants">Restaurants</Link>
              </li>
            </ul>
          </div>

          {/* Right Column - Contact & Booking */}
          <div className="footer-column">
            <h4>Contact Us</h4>
            <p>📍 Oslo • Bergen • Tromsø</p>
            <p>📞 +47 123 45 678</p>
            <p>✉️ hello@blueberryhotels.no</p>

            <div className="footer-cta">
              <Link to="/contact" className="footer-book-btn">
                Contact
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Blueberry Hotels. All rights
            reserved.
          </p>
          <div className="footer-legal">
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
