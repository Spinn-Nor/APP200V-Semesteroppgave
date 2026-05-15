/**
 * MyBookings.jsx
 * 
 * User dashboard showing all previous bookings/orders.
 * Currently using a test user ID - will be replaced with real auth later.
 * 
 * @author Fredrik Fordelsen - Created My Bookings page
 * @version 1.0
 */

import { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';

function MyBookings() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    // Temporary test ID
    const testUserId = "fredrik-123";

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const bookingsRef = ref(db, `order/${testUserId}`);
                const snapshot = await get(bookingsRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    // Converting to array
                    const bookingsArray = Object.keys(data).map(key => ({
                        id: key,
                        ...data[key]
                    }))
                    setBookings(bookingsArray);
                } else {
                    setBookings([]);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, []);

    if (loading) return <h2>Laster dine bestillinger...</h2>;

    return (
        <div className="container">
            <h1>My Bookings</h1>
            <p>Welcome back! Here are your previous and upcoming bookings.</p>

            {bookings.length === 0 ? (
                <p>You have no bookings.</p>
            ): (
                <div className="bookings-list">
                    {bookings.map(booking => (
                        <div key={booking.id} className="booking-card">
                            <div className="booking-header">
                                <h3>Order #{booking.orderId?.slice(0, 8)}</h3>
                                <span className={`status ${booking.status}`}>{booking.status}</span>
                            </div>

                            <p><strong>Date:</strong> {new Date(booking.createdAt).toLocaleDateString('nb-NO')}</p>
                            <p><strong>Total:</strong> {booking.totalPrice} kr</p>

                            <div>
                                {booking.items.map((item, index) => (
                                    <div key={index} className="booking-item">
                                        <strong>{item.name}</strong> — {item.type}
                                        {item.hotelName && <span> hos {item.hotelName}</span>}
                                        {item.date && <p>{item.date}</p>}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyBookings