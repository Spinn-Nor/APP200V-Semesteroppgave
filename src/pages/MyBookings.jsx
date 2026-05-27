/**
 * MyBookings.jsx
 *
 * Dynamic user dashboard with details modal and custom cancel confirmation.
 *
 * @author Fredrik Fordelsen & Bendik Viken Wangen
 * @version 1.9
 */

import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, get, remove } from "firebase/database";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import BookingCard from "../components/BookingCard";

import { usePageTitle } from "../hooks/usePageTitle";
import "./MyBookings.css";

function MyBookings() {
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState(null);

  const { currentUser } = useAuth();
  const { showToast } = useCart();

  usePageTitle("My Bookings");

  const userId = currentUser?.uid;
  const userName =
    currentUser?.displayName || currentUser?.email?.split("@")[0] || "User";

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchBookings = async () => {
      try {
        const bookingsRef = ref(db, `orders/${userId}`);
        const snapshot = await get(bookingsRef);

        if (snapshot.exists()) {
          const data = snapshot.val();
          const bookingsArray = Object.keys(data)
            .map((key) => ({ id: key, ...data[key] }))
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const upcoming = [];
          const past = [];

          bookingsArray.forEach((booking) => {
            const hasUpcomingItem = booking.items?.some((item) => {
              if (!item.checkIn) return false;
              return new Date(item.checkIn) >= today;
            });

            if (hasUpcomingItem) {
              upcoming.push(booking);
            } else {
              past.push(booking);
            }
          });

          setUpcomingBookings(upcoming);
          setPastBookings(past);
        } else {
          setUpcomingBookings([]);
          setPastBookings([]);
        }
      } catch (error) {
        console.error("Error fetching bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userId]);

  const openCancelModal = (orderId) => {
    setBookingToCancel(orderId);
    setShowCancelModal(true);
  };

  const confirmCancel = async () => {
    if (!bookingToCancel) return;

    try {
      const orderRef = ref(db, `orders/${userId}/${bookingToCancel}`);
      await remove(orderRef);

      setUpcomingBookings((prev) =>
        prev.filter((b) => b.id !== bookingToCancel),
      );
      setPastBookings((prev) => prev.filter((b) => b.id !== bookingToCancel));

      showToast("Booking has been successfully cancelled.", "success");
    } catch (error) {
      console.error("Error cancelling booking:", error);
      showToast("Could not cancel the booking.", "error");
    } finally {
      setShowCancelModal(false);
      setBookingToCancel(null);
    }
  };

  if (!currentUser) {
    return (
      <div className="my-bookings-container">
        <h2>Please log in to see your bookings</h2>
      </div>
    );
  }

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
            {upcomingBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={openCancelModal}
                onViewDetails={setSelectedBooking}
              />
            ))}
          </div>
        </>
      )}

      {pastBookings.length > 0 && (
        <>
          <h2 className="section-title">Past Reservations</h2>
          <ul className="past-bookings-list">
            {pastBookings.map((booking) => (
              <li key={booking.id} className="past-booking-item">
                <div>
                  <strong>Reservation #{booking.orderId?.slice(-8)}</strong>
                  <p>
                    {new Date(booking.createdAt).toLocaleDateString("nb-NO")} —{" "}
                    {booking.totalPrice} kr
                  </p>
                </div>

                <button
                  className="details-btn"
                  onClick={() => setSelectedBooking(booking)}
                >
                  View
                </button>
              </li>
            ))}
          </ul>
        </>
      )}

      {upcomingBookings.length === 0 && pastBookings.length === 0 && (
        <div className="no-bookings">
          <h3>You have no reservations yet</h3>
          <p>When you book rooms, they will appear here.</p>
        </div>
      )}

      {/* ==================== DETAIL MODAL ==================== */}
      {selectedBooking && (
        <div className="modal-overlay" onClick={() => setSelectedBooking(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Reservation Details</h2>
              <button
                className="close-modal-btn"
                onClick={() => setSelectedBooking(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-row">
                <span>Reservation ID</span>
                <span>#{selectedBooking.orderId?.slice(-8)}</span>
              </div>
              <div className="detail-row">
                <span>Booked on</span>
                <span>
                  {new Date(selectedBooking.createdAt).toLocaleDateString(
                    "nb-NO",
                  )}
                </span>
              </div>

              <h3>Booked Items</h3>
              {selectedBooking.items?.map((item, index) => (
                <div key={index} className="modal-item">
                  <strong>{item.name}</strong> — {item.type}
                  {item.hotelName && <p>at {item.hotelName}</p>}
                  {item.date && <p className="item-date">{item.date}</p>}
                  {/* Amenities vises her */}
                  {item.amenities && item.amenities.length > 0 && (
                    <div className="modal-amenities">
                      <strong>Additional Services:</strong>
                      <ul>
                        {item.amenities.map((amenity, i) => (
                          <li key={i}>
                            {amenity.label}{" "}
                            <span className="price">+{amenity.price} kr</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}

              <div className="detail-total">
                <strong>Total Amount: {selectedBooking.totalPrice} kr</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancelModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowCancelModal(false)}
        >
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Cancel Reservation</h2>
            <p>
              Are you sure you want to cancel this booking?
              <br />
              This action cannot be undone.
            </p>
            <div className="cancel-modal-actions">
              <button
                className="cancel-modal-no"
                onClick={() => setShowCancelModal(false)}
              >
                No, keep it
              </button>
              <button className="cancel-modal-yes" onClick={confirmCancel}>
                Yes, cancel booking
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyBookings;
