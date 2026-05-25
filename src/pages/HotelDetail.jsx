/**
 * HotelDetail.jsx
 *
 * @author Fredrik Fordelsen & Bendik Viken Wangen
 * @version 1.2
 */

import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import { useCart } from "../context/CartContext";
import RoomCard from "../components/RoomCard";
import ImageCarousel from "../components/ImageCarousel";
import ReviewModal from "../components/ReviewModal";
import ReviewsModal from "../components/ReviewsModal";
import { useAuth } from "../context/AuthContext";

function HotelDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const initialCheckIn = searchParams.get("checkIn") || "";
  const initialCheckOut = searchParams.get("checkOut") || "";

  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();

  const [hotelRating, setHotelRating] = useState(null);
  const [hotelReviewCount, setHotelReviewCount] = useState(0);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const [isReviewsModalOpen, setIsReviewsModalOpen] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelRef = ref(db, `hotels/${id}`);
        const snapshot = await get(hotelRef);

        if (snapshot.exists()) {
          const hotelData = snapshot.val();

          setHotel(hotelData);

          if (hotelData.reviews) {
            const reviewsArray = Object.values(hotelData.reviews);

            const total = reviewsArray.reduce(
              (sum, review) => sum + (review.rating || 0),
              0
            );

            const average = total / reviewsArray.length;

            setHotelRating(average.toFixed(1));
            setHotelReviewCount(reviewsArray.length);
          }
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

  return (
    <div className="container">
      <div className="hotel-detail">
        <div className="hotel-detail-header">
          <ImageCarousel
            images={hotel.images || []}
            autoScroll={true}
            interval={5000}
          />
        </div>

        <div className="hotel-detail-info">
          <h1>{hotel.name}</h1>
          <p className="hotel-city">
            {hotel.city} • {hotel.address}
          </p>

          <div className="hotel-rating-row">
            <button
              className="rating-button"
              onClick={() => setIsReviewsModalOpen(true)}
            >
              ⭐ {hotelRating} ({hotelReviewCount} {hotelReviewCount == 1 ? "review" : "reviews"})
            </button>

            <button
              className={`review-btn ${currentUser ? "" : "review-btn-disabled"}`}
              onClick={() => setIsReviewOpen(true)}
              disabled={currentUser ? false : true}
            >
              Review
            </button>
          </div>
        </div>

        <div className="hotel-detail-content">
          <p className="hotel-description">{hotel.description}</p>

          <div className="hotel-amenities">
            {hotel.hasSpa && <span>♨️ Spa available</span>}
            {hotel.hasEvents && <span>🎉 Events available</span>}
          </div>

          <h2>Available rooms</h2>
          <div className="rooms-list">
            {hotel.rooms && Object.keys(hotel.rooms).length > 0 ? (
              Object.entries(hotel.rooms).map(([roomId, room]) => (
                <RoomCard
                  key={roomId}
                  room={room}
                  hotelName={hotel.name}
                  hotelId={id}
                  initialCheckIn={initialCheckIn}
                  initialCheckOut={initialCheckOut}
                />
              ))
            ) : (
              <p>No rooms available for this hotel yet.</p>
            )}
          </div>
        </div>
      </div>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        hotelId={hotel.id}
        hotelName={hotel.name}
      />

      <ReviewsModal
        isOpen={isReviewsModalOpen}
        onClose={() => setIsReviewsModalOpen(false)}
        hotelId={hotel.id}
        hotelName={hotel.name}
      />
    </div >
  );
}

export default HotelDetail;
