/**
 * RoomBookingModal.jsx
 * 
 * Modal that opens when user wants to add a room to the cart.
 * Allows selecting check-in and check-out dates, shows number of nights
 * and estimated total price.
 * 
 * @author Fredrik Fordelsen - Created RoomBookingModal for date selection
 * @version 1.0
 */

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import './styles/RoomBookingModal.css';

function RoomBookingModal({isOpen, onClose, room, hotelName}) {
    const { addToCart, showToast } = useCart();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [nights, setNights] = useState(0);

    // Calculate amount of nights
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end - start);
            const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(calculatedNights > 0 ? calculatedNights : 0);
        }
    }, [checkIn, checkOut]);

    const totalPrice = nights * (room.price || 0);

    const handleAddToCart = () => {
        if (!checkIn || !checkOut || nights <= 0) {
            showToast("Please choose a check in and check out date", "error");
            return;
        }

        const cartItem = {
            name: room.type || "Unknown Room",
            type: "Room",
            price: totalPrice,                    // Total price for the whole stay
            pricePerNight: room.price,
            nights: nights,
            checkIn: checkIn,
            checkOut: checkOut,
            capacity: room.capacity || 1,
            hotelName: hotelName,
            date: `${checkIn} til ${checkOut}`,
            itemId: room.id || Date.now(),
            category: "accommodation"
        };

        addToCart(cartItem);
        showToast(`"${room.type}" from ${hotelName} has been added to the cart!`, "success");
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Book {room.type}</h2>
                    <button className="close-modal-btn" onClick={onClose}>✕</button>
                </div>

                <div className="modal-body">
                    <div className="form-group">
                        <label>Check in</label>
                        <input 
                            type="date"
                            value={checkIn}    
                            onChange={(e) => setCheckIn(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Check out</label>
                        <input 
                            type="date" 
                            value={checkOut} 
                            onChange={(e) => setCheckOut(e.target.value)} 
                        />
                    </div>

                    {nights > 0 && (
                        <div className="price-summary">
                            <p>Amount of nights: <strong>{nights}</strong></p>
                            <p>Price per night: <strong>{room.price} kr</strong></p>
                            <p><strong>Total Price: {totalPrice} kr</strong></p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button className="add-to-cart-modal-btn" onClick={handleAddToCart}>
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomBookingModal;