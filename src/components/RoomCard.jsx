/**
 * RoomCard.jsx
 * 
 * Displays a single room and opens a booking modal when "Add to Cart" is clicked.
 * 
 * @author Fredrik Fordelsen - Updated to use RoomBookingModal
 * @version 1.2
 */

import { useState } from 'react';
import { useCart } from '../context/CartContext';
import RoomBookingModal from './RoomBookingModal';

function RoomCard({ room, hotelName }) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="room-card">
                <div className="room-type">
                    <h3>{room.type}</h3>
                </div>

                <div className="room-details">
                    <p><strong>Price per night:</strong> {room.price} kr</p>
                    <p><strong>Capacity:</strong> {room.capacity} people</p>
                    <p><strong>Available:</strong> {room.available} rooms</p>
                </div>

                <div className="room-amenities">
                    {room.amenities && room.amenities.map((amenity, index) => (
                        <span key={index} className="amenity-tag">{amenity}</span>
                    ))}
                </div>

                <button 
                    className="book-roomBtn"
                    onClick={() => setIsModalOpen(true)}
                >
                    Add to Cart
                </button>
            </div>

            {/* Booking Modal */}
            <RoomBookingModal 
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                room={room}
                hotelName={hotelName}
            />
        </>
    );
}

export default RoomCard;