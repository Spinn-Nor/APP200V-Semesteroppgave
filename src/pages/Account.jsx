/**
 * Account dashboard for customers
 * @author Fredrik Fordelsen
 * @version 1.5
 */

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/config";
import { ref, set } from "firebase/database";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
  getAuth,
} from "firebase/auth";
import "./Account.css";

function Account() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  const [activeSection, setActiveSection] = useState("profile");

  // Profile
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    displayName: currentUser?.displayName || "",
  });

  // Password change
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      setFormData({ displayName: currentUser.displayName || "" });
    }
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await set(ref(db, `users/${currentUser.uid}`), {
        email: currentUser.email,
        displayName: formData.displayName,
        updatedAt: new Date().toISOString(),
      });
      showToast("Profile updated successfully!", "success");
      setEditMode(false);
    } catch (error) {
      showToast("Failed to update profile.", "error");
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!currentPassword || !newPassword || !confirmPassword) {
      showToast("All fields are required.", "error");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match.", "error");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters.", "error");
      return;
    }

    setPasswordLoading(true);

    try {
      const auth = getAuth();
      const user = auth.currentUser; // ← Henter frisk bruker

      if (!user) {
        throw new Error("No user found");
      }

      // Re-authenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword,
      );
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      showToast("Password changed successfully!", "success");

      // Clear fields
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password change error:", error);
      if (error.code === "auth/wrong-password") {
        showToast("Current password is incorrect.", "error");
      } else if (error.code === "auth/requires-recent-login") {
        showToast("Please log out and log in again, then try.", "error");
      } else {
        showToast("Failed to change password. Please try again.", "error");
      }
    } finally {
      setPasswordLoading(false);
    }
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
          <button
            className={`menu-item ${activeSection === "profile" ? "active" : ""}`}
            onClick={() => setActiveSection("profile")}
          >
            Profile
          </button>
          <button
            className={`menu-item ${activeSection === "security" ? "active" : ""}`}
            onClick={() => setActiveSection("security")}
          >
            Security
          </button>
        </div>
      </div>

      <div className="account-content">
        {activeSection === "profile" && (
          <div>
            <div className="account-header">
              <h1>Profile Information</h1>
            </div>
            <div className="profile-card">
              <div className="profile-header">
                <h2>Personal Details</h2>
                <button
                  onClick={() => setEditMode(!editMode)}
                  className="edit-btn"
                >
                  {editMode ? "Cancel" : "Edit"}
                </button>
              </div>

              <form onSubmit={handleSaveProfile}>
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
        )}

        {activeSection === "security" && (
          <div>
            <div className="account-header">
              <h1>Security Settings</h1>
            </div>
            <div className="profile-card">
              <div className="profile-header">
                <h2>Change Password</h2>
              </div>

              <form onSubmit={handleChangePassword} className="password-form">
                <div className="form-group">
                  <label>Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Minimum 6 characters"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Repeat New Password</label>
                  <input
                    type="password"
                    placeholder="Repeat new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="save-btn"
                  disabled={passwordLoading}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Account;
