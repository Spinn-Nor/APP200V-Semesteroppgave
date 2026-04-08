import {useParams, Link} from 'react-router-dom';
import {useEffect, useState} from 'react';
import {db} from '../firebase/config'
import {ref, get} from 'firebase/database';


function HotelDetail() {
    const {id} = useParams(); // Gets hotel id from URL
    const [hotel, setHotel] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHotel = async () => {
            try {
                const hotelRef = ref(db, `hotels/${id}`);
                const snapshot = await get(hotelRef);

                if (snapshot.exists()) {
                    setHotel(snapshot.value());
                } else {
                    console.log("Hotel not found");
                }
            } catch (error) {
                console.error("Error fetching hotel:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHotels();
    }, [id]);

    if (loading) return <h2>Loading hotel...</h2>;
    if (!hotel) return <h2>Hotel not found</h2>;

  return (
    <div className="hotel-detail">
        <div className="container">
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
        </div>

        <div className="hotel-detail-content">
            <p className="hotel-description">{hotel.description}</p>

            <div className="hotel-amenities">
                {hotel.hasSpa && <span>♨️ Spa available</span>}
                {hotel.hasConference && <span>🏢 Conference Rooms available</span>}
            </div>

            <h2>Available rooms</h2>

        </div>
    </div>
  )
}

export default HotelDetail