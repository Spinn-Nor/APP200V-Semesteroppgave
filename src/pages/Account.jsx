/**
 * Account dashboard for customers
 * @author Fredrik Fordelsen
 * @version 1.0
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import "./Account.css";

function Account() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
    phone: currentUser?.phone || "",
  });

  const handleSave = async (e) => {
    e.preventDefault();
    setEditMode(false);
  };

  if (!currentUser) {
    return <p>Please log in to view your account.</p>;
  }

  return (
    <div className="account-container">
      <div className="account-sidebar">
        <div className="account-logo">
          <h2>My Account</h2>
        </div>

        <div className="account-menu">
          <button className="menu-item active">Profile</button>
          <button className="menu-item">Security</button>
          <button className="menu-item">Preferences</button>
          <button className="menu-item">Notifications</button>
        </div>
      </div>

      <div className="account-content">
        <h1>Profile Information</h1>

        <div className="profile-card">
          <div className="profile-header">
            <h2>Personal Details</h2>
            <button onClick={() => setEditMode(!editMode)} className="edit-btn">
              {editMode ? "Cancel" : "Edit"}
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={currentUser.email} disabled />
            </div>

            <div className="form-group">
              <label>Display Name</label>
              <input
                type="text"
                value={formData.displayName}
                onChange={(e) =>
                  setFormData({ ...formData, displayName: e.target.value })
                }
                disabled={!editMode}
              />
            </div>

            {editMode && (
              <button type="submit" className="save-btn">
                Save Changes
              </button>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default Account;
