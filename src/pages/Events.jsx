/**
 * Events.jsx
 *
 * Page for displaying conference and meeting room options.
 *
 * @author Pelle Thoresen
 * @version 1.2
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Events.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { useHotels } from '../hooks/useHotels';
import { useCart } from "../context/CartContext"; // ← 1. HENT UT USECART
import EventDetailsModal from "../components/EventDetailsModal";

function Events() {
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotels();
  const { addToCart } = useCart(); // ← 2. HENT UT ADDTOCART-FUNKSJONEN
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeRoom, setActiveRoom] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  useEffect(() => {
    if (!selectedHotelId) {
      setRooms([]);
      return;
    }

    setLoading(true);
    const database = db || getDatabase();
    const roomsRef = ref(database, `conferenceRooms/${selectedHotelId}/rooms`);

    const unsubscribe = onValue(roomsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const roomsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key]
        }));
        setRooms(roomsList);
      } else {
        setRooms([]);
      }
      setLoading(false);
    }, (firebaseError) => {
      console.error("Firebase error:", firebaseError);
      setError("Failed to retrieve conference rooms. Please try again later.");
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedHotelId]);

  const eventHotels = hotels ? hotels.filter(hotel => hotel.hasEvents === true) : [];
  const currentHotel = hotels ? hotels.find(h => h.id === selectedHotelId) : null;

  return (
    <main className="events-page">
      {/* Hero */}
      <section className="events-hero">
        <div className="events-hero-overlay" />
        <div className="events-hero-content">
          <p className="events-tagline">Professional Conference Solutions</p>
          <h1 className="events-title">Conferences & <br />Successful Meetings</h1>
          <p className="events-subtitle">
            Host your next event, workshop or conference in state-of-the-art facilities across Blueberry Hotels.
          </p>
          <a href="#events-selection" className="events-cta-btn">Explore Meeting Rooms</a>
        </div>
      </section>

      {/* Intro */}
      <section className="events-intro container">
        <div className="events-intro-text">
          <h2>Spaces Built for Collaboration</h2>
          <p>
            From intimate boardrooms to expansive event halls—all our rooms fulfill the strict Blueberry standard for technical equipment and comfort.
          </p>
        </div>
      </section>

      <div id="events-selection" className="events-selection-divider"></div>

      {/* Destination Selection */}
      {!selectedHotelId && (
        <section className="events-destinations">
          <div className="container">
            <h2 className="spa-destination-title">Select an Event Destination</h2>
            <p className="spa-destination-subtitle">Find the perfect venue tailored to your next corporate gathering.</p>

            {hotelsLoading ? (
              <p className="wellness-loading">Loading destinations...</p>
            ) : hotelsError ? (
              <p className="wellness-error">Error loading locations.</p>
            ) : (
              <div className="hotels-grid">
                {eventHotels.map((hotel) => (
                  <div key={hotel.id} className="hotel-card">
                    <img
                      src={hotel.images && hotel.images[0]}
                      alt={hotel.name}
                      className="hotel-image"
                    />
                    <div className="hotel-info">
                      <h3>{hotel.name}</h3>
                      <p className="hotel-location">📍 {hotel.city}</p>
                      <p className="hotel-description">{hotel.description}</p>
                      <button className="see-rooms-btn" onClick={() => setSelectedHotelId(hotel.id)}>
                        View Conference Rooms
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Rooms Table */}
      {selectedHotelId && (
        <section className="events-rooms-section">
          <div className="container">
            <h2 className="spa-menu-title">Available Meeting Spaces</h2>
            <p className="spa-menu-subtitle">
              Currently viewing conference rooms available at <strong>{currentHotel?.name || 'Chosen Location'}</strong>
            </p>

            <button className="filter-btn back-location-btn" onClick={() => setSelectedHotelId(null)}>
              ← Change Location
            </button>

            {error && <p className="wellness-error format-error-spacing">{error}</p>}

            {loading ? (
              <p className="wellness-loading">Loading meeting rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="wellness-error format-error-spacing">No conference rooms registered for this location.</p>
            ) : (
              <div className="events-table">
                <div className="table-header">
                  <span>Room Class</span>
                  <span>Capacity</span>
                  <span>Standard Equipment</span>
                  <span>Price (Per Day)</span>
                  <span></span>
                </div>

                {rooms.map((room) => (
                  <div key={room.id} className="table-row">
                    <div className="room-name-cell">
                      <strong>{room.name}</strong>
                    </div>
                    <div className="capacity-cell">{room.capacity}</div>
                    <div className="equipment-cell">
                      <small>{room.equipment}</small>
                    </div>
                    <div className="price-cell">
                      <span className="price-tag" style={{ fontWeight: 'bold' }}>{room.price} kr</span>
                    </div>
                    <div className="action-cell">
                      <button
                        className="book-room-btn"
                        onClick={() => {
                          setActiveRoom(room);
                          setIsBookingOpen(true);
                        }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Contact Footer */}
      <section className="wellness-booking">
        <div className="wellness-booking-content container">
          <h2>Planning a Larger Event?</h2>
          <p>Our event coordinators are ready to assist you with catering, tailor-made layouts and multi-day packages.</p>
          <div className="booking-actions">
            <Link to="/contact" className="contact-btn">Contact Event Team</Link>
          </div>
        </div>
      </section>

      {/* Modalen */}
      <EventDetailsModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setActiveRoom(null);
        }}
        room={activeRoom}
        hotelId={selectedHotelId}
        hotelName={currentHotel?.name}
        addToCart={addToCart}
      />
    </main>
  );
}

export default Events;