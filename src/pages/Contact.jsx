/**
 * Contact Page Component
 *
 * A contact form that allows users (both logged in and guests) to send messages
 * to the Blueberry Hotels team. The form data is stored in Firebase Realtime
 * Database under the "contacts" node.
 *
 * Features:
 * - Pre-fills name and email for logged-in users
 * - Form validation
 * - Toast notifications for success/error feedback
 * - Loading state during submission
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 */

import { useState } from "react";
import { db } from "../firebase/config";
import { ref, push, set } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import "../styles/Contact.css";

function Contact() {
  const { currentUser } = useAuth();
  const { showToast } = useCart();

  usePageTitle("Contact Us");

  const [formData, setFormData] = useState({
    name: currentUser?.displayName || "",
    email: currentUser?.email || "",
    subject: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.subject ||
      !formData.message
    ) {
      showToast("Please fill in all fields", "error");
      return;
    }

    setLoading(true);

    try {
      const newMessageRef = push(ref(db, "contacts"));

      await set(newMessageRef, {
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
        userId: currentUser?.uid || null,
        status: "unread",
        createdAt: new Date().toISOString(),
      });

      showToast("Message sent successfully! We will reply soon.", "success");

      // Reset form
      setFormData({
        name: currentUser?.displayName || "",
        email: currentUser?.email || "",
        subject: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending message:", error);
      showToast("Failed to send message. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-container">
      <div className="contact-header">
        <h1>Contact Us</h1>
        <p>We'd love to hear from you. Send us a message!</p>
      </div>

      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Booking inquiry, Feedback, etc."
              required
            />
          </div>

          <div className="form-group full-width">
            <label>Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows="8"
              placeholder="Write your message here..."
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default Contact;
