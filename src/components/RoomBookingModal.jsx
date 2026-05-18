/**
 * RoomBookingModal.jsx
 * 
 * Modal with date selection and double-booking prevention.
 * Checks against existing bookings in Firebase before allowing add to cart.
 * 
 * @author Fredrik Fordelsen - Implemented double booking check
 * @version 1.4
 */

import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';
import './styles/RoomBookingModal.css';

function RoomBookingModal({ isOpen, onClose, room, hotelName, hotelId }) {
    const { addToCart, showToast } = useCart();

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');
    const [nights, setNights] = useState(0);
    const [error, setError] = useState('');
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const today = new Date().toISOString().split('T')[0];

    // Calculate nights
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffTime = Math.abs(end - start);
            const calculatedNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            setNights(calculatedNights > 0 ? calculatedNights : 0);
        } else {
            setNights(0);
        }
    }, [checkIn, checkOut]);

    const totalPrice = nights * (room.price || 0);

    // Check if room is available in selected period
    const checkRoomAvailability = async () => {
        if (!checkIn || !checkOut) return true;

        setCheckingAvailability(true);
        setError('');

        try {
            const allOrdersRef = ref(db, 'orders');
            const snapshot = await get(allOrdersRef);

            if (!snapshot.exists()) return true;

            const allOrders = snapshot.val();

            for (const userOrders of Object.values(allOrders)) {
                for (const order of Object.values(userOrders)) {
                    if (order.items) {
                        for (const item of order.items) {
                            // Check if it's the same room
                            if (item.roomId === room.id || item.name === room.type) {
                                const existingCheckIn = new Date(item.checkIn);
                                const existingCheckOut = new Date(item.checkOut);
                                const newCheckIn = new Date(checkIn);
                                const newCheckOut = new Date(checkOut);

                                // Overlap check
                                if (newCheckIn < existingCheckOut && newCheckOut > existingCheckIn) {
                                    setError(`This room is already booked from ${item.checkIn} to ${item.checkOut}.`);
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
            return true;
        } catch (err) {
            console.error("Error checking availability:", err);
            return true; // Allow booking if check fails (fail-safe)
        } finally {
            setCheckingAvailability(false);
        }
    };

    const handleAddToCart = async () => {
        if (!checkIn || !checkOut || nights <= 0) {
            setError("Please select both check-in and check-out dates.");
            showToast("Please select both dates.", "error");
            return;
        }

        if (new Date(checkIn) < new Date(today)) {
            setError("Check-in cannot be in the past.");
            showToast("Check-in cannot be in the past.", "error");
            return;
        }

        if (new Date(checkOut) <= new Date(checkIn)) {
            setError("Check-out must be at least one day after check-in.");
            showToast("Check-out must be after check-in.", "error");
            return;
        }

        // Check availability in database
        const isAvailable = await checkRoomAvailability();
        if (!isAvailable) {
            showToast("This room is not available in the selected period.", "error");
            return;
        }

        const cartItem = {
            name: room.type || "Unknown Room",
            type: "Room",
            price: totalPrice,
            pricePerNight: room.price,
            nights: nights,
            checkIn: checkIn,
            checkOut: checkOut,
            capacity: room.capacity || 1,
            hotelName: hotelName,
            hotelId: hotelId,
            roomId: room.id,
            date: `${checkIn} til ${checkOut}`,
            itemId: room.id || Date.now(),
            category: "accommodation"
        };

        addToCart(cartItem);
        showToast(`"${room.type}" from ${hotelName} has been added to your cart! 🎉`, "success");
        onClose();

        // Reset form
        setCheckIn('');
        setCheckOut('');
        setNights(0);
        setError('');
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
                            <p>Number of nights: <strong>{nights}</strong></p>
                            <p>Price per night: <strong>{room.price} kr</strong></p>
                            <p><strong>Total: {totalPrice} kr</strong></p>
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button 
                        className="add-to-cart-modal-btn" 
                        onClick={handleAddToCart}
                        disabled={checkingAvailability}
                    >
                        {checkingAvailability ? "Checking availability..." : "Add to Cart"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomBookingModal;