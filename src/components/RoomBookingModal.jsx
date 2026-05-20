/**
 * RoomBookingModal.jsx
 *
 * Modal with date selection and availability check for booking a room.
 *
 * @author Fredrik Fordelsen
 * @version 1.6
 */

import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import "./styles/RoomBookingModal.css";

function RoomBookingModal({ isOpen, onClose, room, hotelName, hotelId }) {
  const { addToCart, showToast } = useCart();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [nights, setNights] = useState(0);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      setNights(diff > 0 ? diff : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const totalPrice = nights * (room.price || 0);

  const handleAddToCart = async () => {
    if (!checkIn || !checkOut || nights <= 0) {
      setError("Please select both check-in and check-out dates.");
      showToast("Please select both dates.", "error");
      return;
    }

    const isAvailable = true; // TODO: Legg til availability check senere

    if (!isAvailable) {
      showToast("This room is not available in the selected period.", "error");
      return;
    }

    const cartItem = {
      name: room.name || "Unknown Room",
      type: "Room",
      price: totalPrice,
      pricePerNight: room.price,
      nights: nights,
      checkIn,
      checkOut,
      capacity: room.capacity || 1,
      hotelName,
      hotelId,
      roomId: room.id || room.name?.toLowerCase().replace(/\s+/g, "-"),
      date: `${checkIn} to ${checkOut}`,
      itemId: Date.now(),
      category: "accommodation",
    };

    addToCart(cartItem);
    showToast(
      `"${room.name}" from ${hotelName} has been added to your cart! 🎉`,
      "success",
    );
    onClose();

    // Reset form
    setCheckIn("");
    setCheckOut("");
    setNights(0);
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Book {room.name}</h2> {/* ← Endret fra room.type til room.name */}
          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {error && <p className="error-message">{error}</p>}

          <div className="form-group">
            <label>Check-in Date</label>
            <input
              type="date"
              value={checkIn}
              min={today}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Check-out Date</label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>

          {nights > 0 && (
            <div className="price-summary">
              <p>
                Number of nights: <strong>{nights}</strong>
              </p>
              <p>
                Price per night: <strong>{room.price} kr</strong>
              </p>
              <p>
                <strong>Total: {totalPrice} kr</strong>
              </p>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="cancel-btn" onClick={onClose}>
            Cancel
          </button>
          <button
            className="add-to-cart-modal-btn"
            onClick={handleAddToCart}
            disabled={checking}
          >
            {checking ? "Checking availability..." : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoomBookingModal;
