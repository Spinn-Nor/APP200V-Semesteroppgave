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
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';
import './styles/RoomBookingModal.css';

function RoomBookingModal({isOpen, onClose, room, hotelName, initialCheckIn = '', initialCheckOut = ''}) {
    const { addToCart, showToast } = useCart();

    const [checkIn, setCheckIn] = useState(initialCheckIn);
    const [checkOut, setCheckOut] = useState(initialCheckOut);
    const [nights, setNights] = useState(0);
    const [availability, setAvailability] = useState(null); // null | 'available' | 'unavailable'
    const [checkingAvailability, setCheckingAvailability] = useState(false);

    const today = new Date().toISOString().split('T')[0];
    const minCheckOut = checkIn
        ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
        : today;

    // Reset state when modal closes
    useEffect(() => {
        if (!isOpen) {
            setCheckIn(initialCheckIn);
            setCheckOut(initialCheckOut);
            setNights(0);
            setAvailability(null);
        }
    }, [isOpen, initialCheckIn, initialCheckOut]);

    // Calculate amount of nights
    useEffect(() => {
        if (checkIn && checkOut) {
            const start = new Date(checkIn);
            const end = new Date(checkOut);
            const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
            setNights(diffDays > 0 ? diffDays : 0);
        } else {
            setNights(0);
        }
    }, [checkIn, checkOut]);

    // Check availability against existing roomBookings when dates are set
    useEffect(() => {
        if (!checkIn || !checkOut || nights <= 0 || !room.id) {
            setAvailability(null);
            return;
        }

        let cancelled = false;
        const checkAvailability = async () => {
            setCheckingAvailability(true);
            try {
                const snapshot = await get(ref(db, `roomBookings/${room.id}`));
                if (cancelled) return;

                if (!snapshot.exists()) {
                    setAvailability('available');
                    return;
                }

                const hasOverlap = Object.values(snapshot.val()).some(
                    booking => checkIn < booking.checkOut && checkOut > booking.checkIn
                );
                setAvailability(hasOverlap ? 'unavailable' : 'available');
            } catch (error) {
                console.error('Error checking availability:', error);
                if (!cancelled) setAvailability(null);
            } finally {
                if (!cancelled) setCheckingAvailability(false);
            }
        };

        checkAvailability();
        return () => { cancelled = true; };
    }, [checkIn, checkOut, nights, room.id]);

    const handleCheckInChange = (e) => {
        const newCheckIn = e.target.value;
        setCheckIn(newCheckIn);
        if (checkOut && checkOut <= newCheckIn) {
            setCheckOut('');
        }
    };

    const totalPrice = nights * (room.price || 0);

    const handleAddToCart = () => {
        if (!checkIn || !checkOut || nights <= 0) {
            showToast("Please choose a check in and check out date", "error");
            return;
        }
        if (availability === 'unavailable') {
            showToast("Room is not available for these dates", "error");
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
                            min={today}
                            onChange={handleCheckInChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Check out</label>
                        <input
                            type="date"
                            value={checkOut}
                            min={minCheckOut}
                            onChange={(e) => setCheckOut(e.target.value)}
                        />
                    </div>

                    {nights > 0 && (
                        <div className="price-summary">
                            <p>Amount of nights: <strong>{nights}</strong></p>
                            <p>Price per night: <strong>{room.price} kr</strong></p>
                            <p><strong>Total Price: {totalPrice} kr</strong></p>
                            {checkingAvailability && <p className="availability-checking">Checking availability...</p>}
                            {!checkingAvailability && availability === 'available' && (
                                <p className="availability-ok">Room is available for these dates</p>
                            )}
                            {!checkingAvailability && availability === 'unavailable' && (
                                <p className="availability-error">Room is not available for these dates</p>
                            )}
                        </div>
                    )}
                </div>

                <div className="modal-footer">
                    <button className="cancel-btn" onClick={onClose}>Cancel</button>
                    <button
                        className="add-to-cart-modal-btn"
                        onClick={handleAddToCart}
                        disabled={availability === 'unavailable' || checkingAvailability}
                    >
                        Add to cart
                    </button>
                </div>
            </div>
        </div>
    );
}

export default RoomBookingModal;