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
    
  return (
    <div>MyBookings</div>
  )
}

export default MyBookings