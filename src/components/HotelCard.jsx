import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import "../styles/Hotels.css";

function HotelCard({ hotel }) {
  const { search } = useLocation();

  const [rating, setRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const hotelRef = ref(db, `hotels/${hotel.id}`);
        const snapshot = await get(hotelRef);

        if (snapshot.exists()) {
          const hotelData = snapshot.val();

          if (hotelData.reviews) {
            const reviewsArray = Object.values(hotelData.reviews);

            const total = reviewsArray.reduce(
              (sum, review) => sum + (review.rating || 0),
              0
            );

            const average = total / reviewsArray.length;

            setRating(average.toFixed(1));
            setReviewCount(reviewsArray.length);
          } else {
            setRating(0);
            setReviewCount(0);
          }
        }
      } catch (error) {
        console.error("Error fetching hotel rating:", error);
      }
    };

    fetchRating();
  }, [hotel.id]);

  return (
    <div className="hotel-card">
      <img
        src={hotel.images[0]}
        alt={hotel.name}
        className="hotel-image"
      />

      <div className="hotel-info">
        <h3>{hotel.name}</h3>

        <p className="hotel-location">{hotel.city}</p>

        <div className="hotel-details">
          <span>{rating} ★ ({reviewCount} {reviewCount == 1 ? "review" : "reviews"})</span>
        </div>

        <p className="hotel-description">
          {hotel.description}
        </p>

        <Link
          to={`/hotels/${hotel.id}${search}`}
          className="see-rooms-btn"
        >
          View available rooms
        </Link>
      </div>
    </div>
  );
}

export default HotelCard;