/**
 * EventDetailsModal.jsx
 * Modal component for viewing conference room details, selecting a booking date, availability status.
 * Booking to Cart for later checkout. 
 *  @author Pelle Thoresen
 * @version 1.4
 */

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import "../styles/EventDetailsModal.css";
import { useCart } from "../context/CartContext"; // add to cart

// Maps database IDs to your custom Firebase image keys
const imageMapping = {
  "conf-small": "Small",
  "conf-medium": "Medium",
  "conf-large": "Large",
};
// Sets up modal state and context for handling room booking, including selected date, availability status, and Firebase image data.
function EventDetailsModal({ isOpen, onClose, room, hotelId, hotelName }) {
  const { addToCart, showToast } = useCart(); // ← Hent showToast

  const [selectedDate, setSelectedDate] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [dbImages, setDbImages] = useState({});

  // Fetch image URLs from central Firebase folder
  useEffect(() => {
    const database = db || getDatabase();
    const imagesRef = ref(database, "conferenceRooms/conferenceRoomImages");

    const unsubscribe = onValue(imagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) setDbImages(data);
    });

    return () => unsubscribe();
  }, []);

  // Check room availability
  useEffect(() => {
    if (!selectedDate || !room || !hotelId) return;

    setCheckingStatus(true);
    const database = db || getDatabase();
    const ordersRef = ref(database, "orders");

    const unsubscribe = onValue(ordersRef, (snapshot) => {
      if (!snapshot.exists()) {
        setIsBooked(false);
        setCheckingStatus(false);
        return;
      }

      const data = snapshot.val();
      let alreadyBooked = false;
 // Loops through all users and their orders to check for conflicts
      Object.values(data).forEach((userOrders) => {
        Object.values(userOrders).forEach((order) => {
          if (!Array.isArray(order.items)) return;

          order.items.forEach((item) => {
            const isMatch =
              item.category === "event" &&
              item.hotelId === hotelId &&
              (item.roomId === room.id || item.id === room.id) &&
              item.date === selectedDate;

            if (isMatch) alreadyBooked = true;
          });
        });
      });

      setIsBooked(alreadyBooked);
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, [selectedDate, room, hotelId]);

   // Prevents rendering modal if not open or no room is selected
  if (!isOpen || !room) return null;

  // if room id does not exitst in imageMapping, use large as standartd, or straight url if that also fails. Bug fix. 
  const imageKey = imageMapping[room.id] || "Large";
  const roomImage =
    dbImages[imageKey] ||
    "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop";

    // Adds selected booking to cart if valid. 
  const handleAddToCart = () => {
    if (!selectedDate || isBooked) return;

    const cartItem = {
      cartId: `${room.id}-${selectedDate}-${Date.now()}`,
      type: "Event",
      category: "event",
      hotelId,
      hotelName,
      id: room.id,
      name: room.name,
      date: selectedDate,
      checkIn: selectedDate,
      checkOut: selectedDate,
      price: parseInt(room.price) || 0,
      image: roomImage,
    };

    addToCart(cartItem);

    // Sucsess message when adding to cart
    showToast(
      `${room.name} for ${selectedDate} er lagt til i handlekurven!`,
      "success",
    );

    // Modal close after adding to cart. 800ms or 0,8 seconds. 
    setTimeout(() => {
      onClose();
    }, 800);
  };
// Render booking modal UI for selected conference room, with details. 
  return (
    <div className="event-modal-overlay" onClick={onClose}>
        {/* Stops click propagation so modal doesn't close when clicking inside */}
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
           {/* Close button that exits the modal */}
        <button className="event-modal-close" onClick={onClose}>
          ×
        </button>

        <div className="event-modal-body">
          <div className="event-modal-image-side">
            <img src={roomImage} alt={room.name} />
          </div>

          <div className="event-modal-info-side">
            <span className="hotel-badge">{hotelName}</span>
            <h2>{room.name}</h2>
            {/* Room specifications */}
            <div className="room-specs">
              <p>
                <strong>👥 Capacity:</strong> {room.capacity}
              </p>
              <p>
                <strong>🛠 Equipment:</strong> {room.equipment}
              </p>
              <p>
                <strong> Price per day:</strong>{" "}
                <span className="modal-price">{room.price} kr</span>
              </p>
            </div>

            <hr />
             {/* Date selection and availability check section */}
            <div className="booking-date-section">
              <label htmlFor="booking-date">
                <strong>Choose Date for your Event:</strong>
              </label>
               {/* Date input restricted to today or future dates */}
              <input
                type="date"
                id="booking-date"
                value={selectedDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="date-picker-input"
              />

              {checkingStatus && (
                <p className="status-msg checking">Checking availability...</p>
              )}
                 {/*  Feedback based on booking status */}
              {selectedDate &&
                !checkingStatus &&
                (isBooked ? (
                  <p className="status-msg error-msg">
                    ❌ This room is already occupied on this date.
                  </p>
                ) : (
                  <p className="status-msg success-msg">
                    ✅ Room is available!
                  </p>
                ))}
            </div>
             {/* Add to cart button (disabled if invalid state) */}
            <button
              className={`event-modal-btn ${!selectedDate || isBooked || checkingStatus ? "disabled" : ""}`}
              disabled={!selectedDate || isBooked || checkingStatus}
              onClick={handleAddToCart}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;
