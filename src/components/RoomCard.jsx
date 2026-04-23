/**
 * RoomCard.jsx
 * 
 * Displays room information and adds the room to the cart.
 * 
 * @author Fredrik Fordelsen
 * @version 1.1
 */

import { useCart } from '../context/CartContext';

function RoomCard({ room, hotelName }) {

    const { addToCart } = useCart();

    const handleAddToCart = () => {
        const cartItem = {
            name: room.type || "Unknown Room",
            type: "Room",
            price: room.price || 0,
            capacity: room.capacity || 1,
            date: "Dates to be selected",
            hotelId: "unknown",
            hotelName: hotelName || "Unknown Hotel",
            itemId: room.id || Date.now(),
            category: "accommodation"
        };

        console.log("Adding to cart with hotelName:", cartItem);
        addToCart(cartItem);

        alert(`"${room.type}" from ${hotelName || "Unknown Hotel"} has been added to your cart!`);
    };

    return (
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
                onClick={handleAddToCart}
            >
                Add to Cart
            </button>
        </div>
    );
}

export default RoomCard;