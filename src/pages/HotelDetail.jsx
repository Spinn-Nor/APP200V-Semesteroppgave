/**
 * HotelDetail.jsx
 * 
 * Displays detailed information about a specific hotel fetched from Firebase.
 * Allows users to add available rooms directly to the shopping cart.
 * 
 * @author Fredrik Fordelsen - Added useCart hook and handleAddToCart functionality
 * @version 1.1
 */

import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';
import { useCart } from '../context/CartContext';   // ← Denne linjen manglet
import RoomCard from '../components/RoomCard';

function HotelDetail() {
    const { id } = useParams();
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    // Get addToCart function from global CartContext
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotelRef = ref(db, `hotels/${id}`);
                const snapshot = await get(hotelRef);

                if (snapshot.exists()) {
                    setHotel(snapshot.val());
                } else {
                    console.log("Hotel not found");
                }
            } catch (error) {
                console.error("Error fetching hotel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotel();
    }, [id]);

    if (loading) return <h2>Loading hotel...</h2>;
    if (!hotel) return <h2>Hotel not found</h2>;

    /**
     * Creates a cart item from the selected room and adds it to the global cart.
     */
    const handleAddToCart = (room) => {
        const cartItem = {
            name: room.type || room.name || "Unknown Room",
            type: "Room",
            price: room.price || 0,
            date: "Dates to be selected",           // Can be improved later with date picker
            hotelId: id,
            hotelName: hotel.name,
            roomId: room.id || "unknown"
        };

        addToCart(cartItem);
        alert(`"${room.type || room.name}" has been added to your cart!`);
    };

    return (
        <div className="container">
            <div className="hotel-detail">

                <div className="hotel-detail-header">
                    <img 
                        src={hotel.imageUrl || "https://picsum.photos/id/1015/1200/600"} 
                        alt={hotel.name} 
                        className="detail-image"
                    />
                </div>

                <div className="hotel-detail-info">
                    <h1>{hotel.name}</h1>
                    <p className="hotel-city">{hotel.city} • {hotel.address}</p>
                    <p className="rating">⭐ {hotel.rating} ({hotel.reviewCount || 0} reviews)</p>
                </div>

                <div className="hotel-detail-content">
                    <p className="hotel-description">{hotel.description}</p>

                    <div className="hotel-amenities">
                        {hotel.hasSpa && <span>♨️ Spa available</span>}
                        {hotel.hasConference && <span>🏢 Conference Rooms available</span>}
                    </div>

                    <h2>Available rooms</h2>
                    <div className="rooms-list">
                        {hotel.rooms && Object.entries(hotel.rooms).map(([key, room]) => (
                            <RoomCard 
                                key={key} 
                                room={room}
                                onAddToCart={() => handleAddToCart(room)}   // Pass the function
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HotelDetail;