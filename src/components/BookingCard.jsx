/**
 * BookingCard.jsx
 *
 * Reusable card component for displaying a single booking/reservation.
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 */

function BookingCard({ booking, onCancel, onViewDetails }) {
  // Determine if the booking is upcoming based on check-in date
  const isUpcoming = booking.items?.some((item) => {
    if (item.checkIn) {
      return new Date(item.checkIn) >= new Date();
    }
    return false;
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

      <div className="booking-date">
        {new Date(booking.createdAt).toLocaleDateString("nb-NO", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
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
