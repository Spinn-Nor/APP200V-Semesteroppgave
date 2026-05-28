/**
 * RoomBookingModal.jsx
 * Multi-step booking wizard with amenities selection
 * @version 2.1
 */

import { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { db } from "../firebase/config.js";
import { useCart } from "../context/CartContext";
import AmenitiesSelector from "./AmenitiesSelector";
import "../styles/RoomBookingModal.css";
import { useAuth } from "../context/AuthContext";

function RoomBookingModal({
  isOpen,
  onClose,
  room,
  hotelName,
  hotelId,
  hotelAmenities = [],
  initialCheckIn = "",
  initialCheckOut = "",
}) {
  const { addToCart, cart, showToast } = useCart();

  const [step, setStep] = useState(1);
  const [checkIn, setCheckIn] = useState(initialCheckIn);
  const [checkOut, setCheckOut] = useState(initialCheckOut);
  const [nights, setNights] = useState(0);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const [error, setError] = useState("");

  const { currentUser } = useAuth();

  // Scroll Lock when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = "15px"; // Hindrer layout shift
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    }

    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0";
    };
  }, [isOpen]);

  // Calculate nights
  useEffect(() => {
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diff = Math.ceil((end - start) / 86400000);
      setNights(diff > 0 ? diff : 0);
    } else {
      setNights(0);
    }
  }, [checkIn, checkOut]);

  const roomTotal = nights * (room.price || 0);
  const amenitiesTotal = selectedAmenities.reduce(
    (sum, item) => sum + (item.price || 0),
    0,
  );
  const totalPrice = roomTotal + amenitiesTotal;

  const nextStep = () => {
    if (step === 1 && (!checkIn || !checkOut)) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    setError("");
    setStep(step + 1);
  };

  const prevStep = () => setStep(step - 1);

  const goToStep = (newStep) => {
    if (
      newStep === 1 ||
      (newStep === 2 && checkIn && checkOut) ||
      newStep === 3
    ) {
      setStep(newStep);
    }
  };

  // Availability check / double booking prevention
  const isRoomAvailable = async () => {
    if (!checkIn || !checkOut) return true;

    const safeRoomId = room.id || room.roomId || `room-${Date.now()}`;
    const roomName = room.name || "Unknown Room";

    // Check availability against cart
    const cartConflict = cart.find(
      (item) =>
        item.type === "Room" &&
        (item.roomId === safeRoomId || item.name === roomName) &&
        item.checkIn === checkIn &&
        item.checkOut === checkOut,
    );

    if (cartConflict) {
      const msg = `This room is already in your cart for ${checkIn} — ${checkOut}`;
      setError(msg);
      showToast(msg, "error");
      return false;
    }

    // Check for confirmed bookings in db
    try {
      const ordersRef = ref(db, "orders");
      const snapshot = await get(ordersRef);

      if (snapshot.exists()) {
        const allOrders = snapshot.val();

        for (const userOrders of Object.values(allOrders)) {
          for (const order of Object.values(userOrders)) {
            if (!order.items) continue;

            const hasConflict = order.items.some((item) => {
              if (item.type !== "Room") return false;
              if (item.hotelId !== hotelId) return false;

              const sameRoom =
                item.roomId === safeRoomId || item.name === roomName;

              const sameDates =
                item.checkIn === checkIn && item.checkOut === checkOut;

              return sameRoom && sameDates;
            });

            if (hasConflict) {
              const msg = `This room is already booked by someone else for ${checkIn} — ${checkOut}`;
              setError(msg);
              showToast(msg, "error");
              return false;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error checking availability:", error);
    }

    return true;
  };

  const handleAddToCart = async () => {
    if (!checkIn || !checkOut || nights <= 0) {
      setError("Please select both check-in and check-out dates.");
      showToast("Please select both check-in and check-out dates.", "error");
      return;
    }

    if (!currentUser) {
      showToast("You must be logged in to book a room", "error");
      return;
    }

    const available = await isRoomAvailable();
    if (!available) {
      return;
    }

    const safeRoomId = room.id || room.roomId || `room-${Date.now()}`;

    const cartItem = {
      name: room.name || "Unknown Room",
      type: "Room",
      price: totalPrice,
      pricePerNight: room.price || 0,
      nights: Number(nights),
      checkIn,
      checkOut,
      capacity: room.capacity || 1,
      hotelName: hotelName || "Unknown Hotel",
      hotelId: hotelId,
      roomId: safeRoomId,
      amenities: selectedAmenities || [],
      amenitiesTotal: amenitiesTotal || 0,
      date: `${checkIn} — ${checkOut}`,
      itemId: `${safeRoomId}-${Date.now()}`,
      category: "accommodation",
      addedAt: new Date().toISOString(),
    };

    addToCart(cartItem);
    showToast(`"${room.name}" added to cart!`, "success");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content wizard-modal">
        <div className="modal-header">
          <h2>Book {room.name}</h2>
          <button className="close-modal-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="step-indicator">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((step - 1) / 2) * 100}%` }}
            ></div>
          </div>

          <div className="steps">
            <div
              className={`step ${step === 1 ? "active" : ""}`}
              onClick={() => goToStep(1)}
            >
              Dates
            </div>
            <div
              className={`step ${step === 2 ? "active" : ""}`}
              onClick={() => goToStep(2)}
            >
              Amenities
            </div>
            <div
              className={`step ${step === 3 ? "active" : ""}`}
              onClick={() => goToStep(3)}
            >
              Summary
            </div>
          </div>
        </div>

        <div className="modal-body">
          {error && <p className="error-message">{error}</p>}

          {/* Step 1: Dates */}
          {step === 1 && (
            <div className="step-content">
              <h3>Select Dates</h3>
              <div className="form-group">
                <label>Check-in Date</label>
                <input
                  type="date"
                  value={checkIn}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Check-out Date</label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split("T")[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                />
              </div>
            </div>
          )}

          {/* Step 2: Amenities */}
          {step === 2 && (
            <div className="step-content">
              <h3>Additional Services</h3>
              <AmenitiesSelector
                amenities={hotelAmenities}
                selectedAmenities={selectedAmenities}
                onChange={setSelectedAmenities}
              />
            </div>
          )}

          {/* Step 3: Summary */}
          {step === 3 && (
            <div className="step-content">
              <h3>Booking Summary</h3>
              <div className="booking-summary">
                <div className="summary-row">
                  <span>Room</span>
                  <span>
                    <strong>{room.name}</strong>
                  </span>
                </div>
                <div className="summary-row">
                  <span>Dates</span>
                  <span>
                    <strong>
                      {checkIn} — {checkOut}
                    </strong>{" "}
                    ({nights} nights)
                  </span>
                </div>
                <div className="summary-row">
                  <span>Room Price</span>
                  <span>{roomTotal} kr</span>
                </div>

                {selectedAmenities.length > 0 && (
                  <>
                    <div className="summary-row">
                      <span>
                        <strong>Selected Amenities</strong>
                      </span>
                    </div>
                    {selectedAmenities.map((item, index) => (
                      <div key={index} className="summary-row amenity-row">
                        <span>{item.label}</span>
                        <span>+ {item.price} kr</span>
                      </div>
                    ))}
                  </>
                )}

                <div className="summary-row total-row">
                  <span>
                    <strong>Total</strong>
                  </span>
                  <span>
                    <strong>{totalPrice} kr</strong>
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          {step > 1 && (
            <button className="cancel-btn" onClick={prevStep}>
              Back
            </button>
          )}

          {step < 3 ? (
            <button className="next-btn" onClick={nextStep}>
              Next
            </button>
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

export default RoomBookingModal;
