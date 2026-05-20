/**
 * RoomCard.jsx
 *
 * Displays a single room card and opens booking modal.
 *
 * @author Fredrik Fordelsen
 * @version 1.3
 */

import { useState } from "react";
import RoomBookingModal from "./RoomBookingModal";

function RoomCard({ room, hotelName, hotelId }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="room-card">
        <div className="room-type">
          <h3>{room.name}</h3> {/* Bruker room.name */}
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

        <button className="book-roomBtn" onClick={() => setIsModalOpen(true)}>
          Add to Cart
        </button>
      </div>

      <RoomBookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        room={room}
        hotelName={hotelName}
        hotelId={hotelId}
      />
    </>
  );
}

export default RoomCard;
