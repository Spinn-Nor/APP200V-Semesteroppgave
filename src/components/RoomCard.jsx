/**
 * RoomCard.jsx
 *
 * Displays a single room card and opens booking modal.
 *
 * @author Fredrik Fordelsen
 * @version 1.8
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext"; // ← Lagt til
import RoomBookingModal from "./RoomBookingModal";

function RoomCard({
  room,
  hotelName,
  hotelId,
  hotelAmenities,
  initialCheckIn,
  initialCheckOut,
}) {
  const { currentUser } = useAuth();
  const { showToast } = useCart(); // ← Lagt til

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openBookingModal = () => {
    if (!currentUser) {
      showToast("You must be logged in to book a room", "error");
      return;
    }
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="room-card">
        <div className="room-type">
          <h3>{room.name}</h3>
        </div>

        <div className="room-details">
          <p>
            <strong>Price per night:</strong> {room.price} kr
          </p>
          <p>
            <strong>Capacity:</strong> {room.capacity} people
          </p>
        </div>

        <div className="room-amenities">
          {room.amenities && room.amenities.length > 0 ? (
            room.amenities.map((amenity, index) => (
              <span key={index} className="amenity-tag">
                {amenity}
              </span>
            ))
          ) : (
            <span className="no-amenities">No amenities listed</span>
          )}
        </div>

        <button
          className="book-roomBtn"
          onClick={openBookingModal} // ← Endret til openBookingModal
        >
          Add to Cart
        </button>
      </div>

      <RoomBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
        hotelName={hotelName}
        hotelId={hotelId}
        hotelAmenities={hotelAmenities || []}
        initialCheckIn={initialCheckIn}
        initialCheckOut={initialCheckOut}
      />
    </>
  );
}

export default RoomCard;
