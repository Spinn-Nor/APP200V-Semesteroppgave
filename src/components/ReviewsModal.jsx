/**
 * ReviewsModal.jsx
 * 
 * Modal for displaying all user reviews for a hotel 
 *
 * @author Bendik Viken Wangen
 */

import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { ref, get } from "firebase/database";
import "./ReviewsModal.css";

function ReviewsModal({
    isOpen,
    onClose,
    hotelId,
    hotelName,
}) {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen || !hotelId) return;

        const fetchReviews = async () => {
            setLoading(true);

            try {
                const reviewsRef = ref(db, `hotels/${hotelId}/reviews`);
                const snapshot = await get(reviewsRef);

                if (snapshot.exists()) {
                    const reviewsData = snapshot.val();

                    const reviewsArray = Object.values(reviewsData);

                    reviewsArray.sort(
                        (a, b) => (b.createdAt || 0) - (a.createdAt || 0)
                    );

                    setReviews(reviewsArray);
                } else {
                    setReviews([]);
                }
            } catch (error) {
                console.error("Error fetching reviews:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchReviews();
    }, [isOpen, hotelId]);

    if (!isOpen) return null;

    return (
        <div className="reviews-modal-overlay" onClick={onClose}>
            <div className="reviews-modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="reviews-modal-header">
                    <h2>{hotelName} Reviews</h2>

                    <button
                        className="close-reviews-modal-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="reviews-modal-body">
                    {loading ? (
                        <p>Loading reviews...</p>
                    ) : reviews.length === 0 ? (
                        <p className="no-reviews-text">
                            No reviews yet.
                        </p>
                    ) : (
                        <div className="reviews-list">
                            {reviews.map((review, index) => (
                                <div
                                    key={index}
                                    className="review-item"
                                >
                                    <div className="review-header">
                                        <div className="review-user">
                                            {review.userName || "Anonymous"}
                                        </div>

                                        <div className="review-stars-display">
                                            {"★".repeat(review.rating)}
                                            {"☆".repeat(5 - review.rating)}
                                        </div>
                                    </div>

                                    {review.text && (
                                        <p className="review-text">
                                            {review.text}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ReviewsModal;