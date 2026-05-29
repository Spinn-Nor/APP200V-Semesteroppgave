import React, { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import "../styles/EventDetailsModal.css";

// Maps database IDs to your custom Firebase image keys
const imageMapping = {
  "conf-small": "Small",
  "conf-medium": "Medium",
  "conf-large": "Large"
};

function EventDetailsModal({ isOpen, onClose, room, hotelId, hotelName, addToCart }) {
  const [selectedDate, setSelectedDate] = useState("");
  const [isBooked, setIsBooked] = useState(false);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [dbImages, setDbImages] = useState({});
  const [cartSuccess, setCartSuccess] = useState(false);

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

  // Check room availability for the selected date
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

      // Goes Through orders -> userId -> orderId 
      Object.values(data).forEach((userOrders) => {
        Object.values(userOrders).forEach((order) => {
          if (!Array.isArray(order.items)) return;

          order.items.forEach((item) => {
            const isMatch =
              item.category === "event" &&
              item.hotelId === hotelId &&
              (item.roomId === room.id || item.id === room.id) &&
              item.date === selectedDate;

            if (isMatch) {
              alreadyBooked = true;
            }
          });
        });
      });

      setIsBooked(alreadyBooked);
      setCheckingStatus(false);
    }, (error) => {
      console.error("Error fetching orders for event check:", error);
      setCheckingStatus(false);
    });

    return () => unsubscribe();
  }, [selectedDate, room, hotelId]);

  if (!isOpen || !room) return null;

  const imageKey = imageMapping[room.id] || "Large";
  const roomImage = dbImages[imageKey] || "https://images.unsplash.com/photo-1517524206127-48bbd363f3d7?q=80&w=600&auto=format&fit=crop";

  // Handles adding the conference item to the context cart
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
      image: roomImage
    };

    if (typeof addToCart === "function") {
      addToCart(cartItem);
    } else {
      const currentCart = JSON.parse(localStorage.getItem("cart")) || [];
      currentCart.push(cartItem);
      localStorage.setItem("cart", JSON.stringify(currentCart));
      window.dispatchEvent(new Event("storage"));
    }

    setCartSuccess(true);
  };

  return (
    <div className="event-modal-overlay" onClick={onClose}>
      <div className="event-modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="event-modal-close" onClick={onClose}>×</button>

        {cartSuccess ? (
          <div className="booking-success-state">
            <span className="success-icon">🛒</span>
            <h2>Added to Cart!</h2>
            <p><strong>{room.name}</strong> at {hotelName} ({selectedDate}) has been added to your cart.</p>
            <button className="event-modal-btn" onClick={() => { setCartSuccess(false); onClose(); }}>Continue Browsing</button>
          </div>
        ) : (
          <div className="event-modal-body">
            
            <div className="event-modal-image-side">
              <img src={roomImage} alt={room.name} />
            </div>

            <div className="event-modal-info-side">
              <span className="hotel-badge">{hotelName}</span>
              <h2>{room.name}</h2>
              
              <div className="room-specs">
                <p><strong>👥 Capacity:</strong> {room.capacity}</p>
                <p><strong>🛠 Equipment:</strong> {room.equipment}</p>
                <p><strong> Price per day:</strong> <span className="modal-price">{room.price} kr</span></p>
              </div>

              <hr />

              <div className="booking-date-section">
                <label htmlFor="booking-date"><strong>Choose Date for your Event:</strong></label>
                <input 
                  type="date" 
                  id="booking-date"
                  value={selectedDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="date-picker-input"
                />

                {checkingStatus && <p className="status-msg checking">Checking availability...</p>}
                
                {selectedDate && !checkingStatus && (
                  isBooked ? (
                    <p className="status-msg error-msg">❌ This room is already occupied on this date.</p>
                  ) : (
                    <p className="status-msg success-msg">✅ Room is available! Ready to add.</p>
                  )
                )}
              </div>

              <button 
                className={`event-modal-btn ${(!selectedDate || isBooked || checkingStatus) ? "disabled" : ""}`}
                disabled={!selectedDate || isBooked || checkingStatus}
                onClick={handleAddToCart}
              >
                Add to Cart
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default EventDetailsModal;