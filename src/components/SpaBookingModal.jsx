import { useState, useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import "../styles/RoomBookingModal.css";

function SpaBookingModal({ isOpen, onClose, treatment, hotelName, hotelId }) {
  const { addToCart, showToast } = useCart();
  const { currentUser } = useAuth();

  const [step, setStep] = useState(1);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [error, setError] = useState("");

  // Scroll Lock when modal is open (hindrer scrolling av bakgrunnen)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px";
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    };
  }, [isOpen]);

  if (!isOpen || !treatment) return null;

  // Henter ut kun tallene fra prisen (hvis den f.eks. er lagret som "1290kr" eller "1290,-")
  const rawPrice = treatment.Price ? treatment.Price.toString().replace(/\D/g, "") : "0";
  const numericPrice = parseInt(rawPrice, 10) || 0;

  const nextStep = () => {
    if (step === 1 && (!bookingDate || !bookingTime)) {
      setError("Please select both a date and a time slot.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const handleAddToCart = () => {
    if (!bookingDate || !bookingTime) {
      setError("Please select both a date and a time slot.");
      return;
    }

    if (!currentUser) {
      showToast("You must be logged in to book a treatment", "error");
      return;
    }

    const safeTreatmentId = treatment.id || `spa-${Date.now()}`;

    // Bygger et cartItem som snakker samme språk som handlekurven deres
    const cartItem = {
      name: treatment.name || "Unknown Treatment",
      type: "Spa", // <-- Viktig for å skille fra "Room" senere
      price: numericPrice,
      duration: treatment.Duration || "N/A",
      bookingDate,
      bookingTime,
      hotelName: hotelName || "Unknown Hotel",
      hotelId: hotelId,
      treatmentId: safeTreatmentId,
      date: `${bookingDate} @ ${bookingTime}`, // Vises automatisk i CartDrawer
      cartId: `spa-${safeTreatmentId}-${Date.now()}`,
      itemId: `spa-${safeTreatmentId}-${Date.now()}`, // Unik ID i kurven
      category: "spa",
      addedAt: new Date().toISOString(),
      nights: 1,
      amenities: [],
      checkIn: bookingDate,
      checkOut: bookingDate,
      roomId: `spa-room-${safeTreatmentId}`,
    };

    addToCart(cartItem);
    showToast(`"${treatment.name}" added to cart!`, "success");
    onClose();
    setStep(1); // Nullstiller modalen til neste gang den åpnes
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content wizard-modal">
        <div className="modal-header">
          <h2>Book {treatment.name}</h2>
          <button className="close-modal-btn" onClick={onClose}>✕</button>
        </div>

        {/* Progress Bar (2 steg: Dato/tid -> Oppsummering) */}
        <div className="step-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((step - 1) / 1) * 100}%` }}
            ></div>
          </div>
          <div className="steps">
            <div className={`step ${step === 1 ? "active" : ""}`} onClick={() => setStep(1)}>
              Date & Time
            </div>
            <div className={`step ${step === 2 ? "active" : ""}`} onClick={() => bookingDate && bookingTime && setStep(2)}>
              Summary
            </div>
          </div>
        </div>

        <div className="modal-body">
          {error && <p className="error-message">{error}</p>}

          {/* Steg 1: Velg Dato og Tid */}
          {step === 1 && (
            <div className="step-content">
              <h3>Select Appointment Details</h3>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  value={bookingDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setBookingDate(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Preferred Time</label>
                <input
                  type="time"
                  value={bookingTime}
                  step="1800" // Half or Whole hour increments
                  onChange={(e) => setBookingTime(e.target.value)} // Saves users choice 
                />
              </div>
            </div>
          )}

          {/* Recap for Order */}
          {step === 2 && (
            <div className="step-content">
              <h3>Booking Summary</h3>
              <div className="booking-summary">
                <div className="summary-row">
                  <span>Treatment</span>
                  <span><strong>{treatment.name}</strong></span>
                </div>
                <div className="summary-row">
                  <span>Location</span>
                  <span>{hotelName}</span>
                </div>
                <div className="summary-row">
                  <span>Duration</span>
                  <span>⏱ {treatment.Duration}</span>
                </div>
                <div className="summary-row">
                  <span>Date & Time</span>
                  <span><strong>{bookingDate} — kl. {bookingTime}</strong></span>
                </div>
                <div className="summary-row total-row">
                  <span><strong>Total</strong></span>
                  <span><strong>{numericPrice} kr</strong></span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="cancel-btn" onClick={prevStep}>Back</button>
          )}

          {step < 2 ? (
            <button className="next-btn" onClick={nextStep}>Next</button>
          ) : (
            <button className="add-to-cart-modal-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default SpaBookingModal;