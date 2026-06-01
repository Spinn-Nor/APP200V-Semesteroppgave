/**
 * BookingCard.jsx
 *
 * Reusable card component for displaying a single booking/reservation.
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 */

function BookingCard({ booking, onCancel, onViewDetails }) {
  // Determine if the booking is upcoming (kun dato-sammenligning)
  const isUpcoming = booking.items?.some((item) => {
    if (!item.checkIn) return false;

    const checkInDate = new Date(item.checkIn);
    const today = new Date();

    // Reset time so we're only comparing date
    checkInDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return checkInDate >= today;
  });

  const displayStatus = isUpcoming ? "Confirmed" : "Completed";

  return (
    <div className="booking-card-modern">
      <div className="booking-card-header">
        <h3>Reservation #{booking.orderId?.slice(-8)}</h3>
        <span className={`status-badge ${displayStatus.toLowerCase()}`}>
          {displayStatus}
        </span>
      </div>

      {/* Display check-in date from the first room/item if available, 
          otherwise fall back to when the booking was created */}
      <div className="booking-date">
        {(() => {
          const firstItem = booking.items?.[0];
          const displayDate = firstItem?.checkIn || booking.createdAt;

          return new Date(displayDate).toLocaleDateString("nb-NO", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        })()}
      </div>

      <div className="booking-total">
        Total: <strong>{booking.totalPrice} kr</strong>
      </div>

      <div className="booking-items">
        {booking.items &&
          booking.items.map((item, index) => (
            <div key={index} className="booking-item">
              <strong>{item.name}</strong> — {item.type}
              {item.hotelName && <span> at {item.hotelName}</span>}
              {item.date && <p className="item-date">{item.date}</p>}
            </div>
          ))}
      </div>

      <div className="booking-actions">
        <button className="details-btn" onClick={() => onViewDetails(booking)}>
          View details
        </button>

        {isUpcoming && (
          <button className="cancel-btn" onClick={() => onCancel(booking.id)}>
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}

export default BookingCard;
