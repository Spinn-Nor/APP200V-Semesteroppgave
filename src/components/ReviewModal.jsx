/**
 * ReviewModal.jsx
 * 
 * Modal for rating/reviewing hotels  
 *
 * @author Bendik Viken Wangen
 */

import { useEffect, useState } from "react";
import { db, auth } from "../firebase/config";
import { ref, get, set } from "firebase/database";
import "./ReviewModal.css";

function ReviewModal({ isOpen, onClose, hotelId, hotelName, onReviewSubmitted }) {
    const currentUser = auth.currentUser;

    const [rating, setRating] = useState(0);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!isOpen || !currentUser || !hotelName) return;

        const fetchExistingReview = async () => {
            try {
                const reviewRef = ref(
                    db,
                    `hotels/${hotelId}/reviews/${currentUser.uid}`
                );

                const snapshot = await get(reviewRef);

                if (snapshot.exists()) {
                    const data = snapshot.val();

                    setRating(data.rating || 0);
                    setReviewText(data.text || "");
                } else {
                    setRating(0);
                    setReviewText("");
                }
            } catch (error) {
                console.error("Error fetching review:", error);
            }
        };

        fetchExistingReview();
    }, [isOpen, currentUser, hotelName]);

    const handleSubmit = async () => {
        if (!rating || !currentUser) return;

        setLoading(true);

        try {
            const reviewRef = ref(
                db,
                `hotels/${hotelId}/reviews/${currentUser.uid}`
            );

            await set(reviewRef, {
                rating,
                text: reviewText.trim(),
                userId: currentUser.uid,
                userName: currentUser.displayName || "Anonymous",
                createdAt: Date.now(),
            });

            await onReviewSubmitted();

            onClose();
        } catch (error) {
            console.error("Error saving review:", error);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="review-modal-overlay">
            <div className="review-modal-content">
                <div className="review-modal-header">
                    <h2>Review {hotelName}</h2>

                    <button
                        className="close-review-modal-btn"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="review-modal-body">
                    <div className="review-stars">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                className={`star-btn ${star <= (hoveredStar || rating) ? "filled" : ""
                                    }`}
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHoveredStar(star)}
                                onMouseLeave={() => setHoveredStar(0)}
                            >
                                ★
                            </button>
                        ))}
                    </div>

                    <textarea
                        className="review-textarea"
                        placeholder="Tell us about your experience (optional)"
                        value={reviewText}
                        onChange={(e) => setReviewText(e.target.value)}
                    />
                </div>

                <div className="review-modal-footer">
                    <button
                        className="review-cancel-btn"
                        onClick={onClose}
                    >
                        Cancel
                    </button>

                    <button
                        className="review-submit-btn"
                        onClick={handleSubmit}
                        disabled={!rating || loading}
                    >
                        {loading ? "Submitting..." : "Submit Review"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ReviewModal;