/**
 * MyBookings.jsx
 * 
 * Modern user dashboard with detailed reservation modal.
 * 
 * @author Fredrik Fordelsen - Improved details modal
 * @version 1.5
 */

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, get, remove } from 'firebase/database';
import BookingCard from '../components/BookingCard';
import './MyBookings.css';

function MyBookings() {
    const [upcomingBookings, setUpcomingBookings] = useState([]);
    const [pastBookings, setPastBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState(null);

    const userId = "fredrik-123";
    const userName = "Fredrik";

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRef = ref(db, `orders/${userId}`);
                const snapshot = await get(bookingsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    const bookingsArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                    const today = new Date();
                    const upcoming = [];
                    const past = [];

                    bookingsArray.forEach(booking => {
                        const isUpcoming = booking.items?.some(item => 
                            item.checkIn && new Date(item.checkIn) >= today
                        );
                        if (isUpcoming) upcoming.push(booking);
                        else past.push(booking);
                    });

                    setUpcomingBookings(upcoming);
                    setPastBookings(past);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    const cancelBooking = async (orderId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) return;

        try {
            const orderRef = ref(db, `orders/${userId}/${orderId}`);
            await remove(orderRef);
            
            setUpcomingBookings(prev => prev.filter(b => b.id !== orderId));
            setPastBookings(prev => prev.filter(b => b.id !== orderId));
        } catch (error) {
            console.error("Error cancelling booking:", error);
            alert("Could not cancel the booking.");
        }
    };

    if (loading) return <h2>Loading your reservations...</h2>;

    return (
        <div className="my-bookings-container">
            <div className="welcome-header">
                <h1>Welcome back, {userName} 👋</h1>
                <p>Here is the overview of your reservations</p>
            </div>

            {upcomingBookings.length > 0 && (
                <>
                    <h2 className="section-title">Upcoming Reservations</h2>
                    <div className="bookings-grid">
                        {upcomingBookings.map(booking => (
                            <BookingCard 
                                key={booking.id} 
                                booking={booking} 
                                onCancel={cancelBooking}
                                onViewDetails={setSelectedBooking}
                            />
                        ))}
                    </div>
                </>
            )}

            {pastBookings.length > 0 && (
                <>
                    <h2 className="section-title">Past Reservations</h2>
                    <div className="bookings-grid">
                        {pastBookings.map(booking => (
                            <BookingCard 
                                key={booking.id} 
                                booking={booking} 
                                onCancel={cancelBooking}
                                onViewDetails={setSelectedBooking}
                            />
                        ))}
                    </div>
                </>
            )}

            {upcomingBookings.length === 0 && pastBookings.length === 0 && (
                <div className="no-bookings">
                    <h3>You have no reservations yet</h3>
                </div>
            )}

            {/* Modern Details Modal */}
            {selectedBooking && (
                <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
                    <div className="details-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Reservation Details</h2>
                            <button className="close-modal-btn" onClick={() => setSelectedBooking(null)}>✕</button>
                        </div>

                        <div className="modal-body">
                            <div className="detail-row">
                                <span className="detail-label">Reservation ID</span>
                                <span className="detail-value">#{selectedBooking.orderId?.slice(-8)}</span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Date</span>
                                <span className="detail-value">
                                    {new Date(selectedBooking.createdAt).toLocaleDateString('nb-NO', {
                                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                                    })}
                                </span>
                            </div>
                            <div className="detail-row">
                                <span className="detail-label">Total Amount</span>
                                <span className="detail-value total">{selectedBooking.totalPrice} kr</span>
                            </div>

                            <h3 className="items-title">Booked Items</h3>
                            <div className="modal-items">
                                {selectedBooking.items && selectedBooking.items.map((item, index) => (
                                    <div key={index} className="modal-item">
                                        <strong>{item.name}</strong> — {item.type}
                                        {item.hotelName && <p>at {item.hotelName}</p>}
                                        {item.date && <p className="item-date">{item.date}</p>}
                                        {item.nights && <p>{item.nights} nights</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default MyBookings;