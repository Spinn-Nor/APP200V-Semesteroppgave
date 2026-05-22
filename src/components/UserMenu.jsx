/**
 * UserMenu.jsx
 *
 *  A user menu with links to the users account page, bookings page and a logout button 
 *
 * @author Bendik Viken Wangen
 */

import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./styles/UserMenu.css";

function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);

    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    // Reference to the menu container
    const menuRef = useRef(null);

    const handleLogout = async () => {
        try {
            await logout();
            navigate("/");
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ) {
                setIsOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    const displayName =
        currentUser?.displayName ||
        currentUser?.email?.split("@")[0] ||
        "User";

    return (
        <div className="user-menu" ref={menuRef}>
            {/* Trigger Button */}
            <button
                className="user-menu-trigger"
                onClick={() => setIsOpen(!isOpen)}
            >
                {displayName} ▾
            </button>

            {/* Dropdown */}
            {isOpen && (
                <div className="user-dropdown">
                    <div className="user-dropdown-header">
                        <p className="user-dropdown-name">
                            {displayName}
                        </p>
                    </div>

                    {currentUser.role == "admin" && (
                        <Link
                            to="/admin"
                            className="dropdown-link"
                            onClick={() => setIsOpen(false)}
                        >
                            Admin Dashboard
                        </Link>
                    )}

                    <Link
                        to="/account"
                        className="dropdown-link"
                        onClick={() => setIsOpen(false)}
                    >
                        Account
                    </Link>

                    <Link
                        to="/my-bookings"
                        className="dropdown-link"
                        onClick={() => setIsOpen(false)}
                    >
                        My Bookings
                    </Link>

                    <button
                        className="dropdown-logout"
                        onClick={handleLogout}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserMenu;