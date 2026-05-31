/**
 * Events.jsx
 *
 * Page for displaying conference and meeting rooms available at Blueberry Hotels.
 *
 * This component allows users to:
 * - View hotels that offer conference and event rooms.
 * - Select a specific hotel to view available conference rooms (fetched from Firebase).
 * - Send a booking request for a selected room via EventDetailsModal.
 *
 * Hotel data is fetched using the custom hook useHotels().
 * Conference room data is retrieved directly from Firebase Realtime Database
 * when a hotel is selected.
 *
 * The function addToCart (from CartContext via useCart) is used to store
 * booking requests in the cart for later confirmation and checkout.
 *
 * @author Pelle Thoresen
 * @version 1.4
 */

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/Events.css";
import { getDatabase, ref, onValue } from "firebase/database";
import { db } from "../firebase/config";
import { useHotels } from "../hooks/useHotels"; // custom hook for fetching hotels data
import { useCart } from "../context/CartContext"; // hook for cart context
import EventDetailsModal from "../components/EventDetailsModal";
// Fetches hotels + loading/error states using custom hook

// Handles conference room display, room retrieval from Firebase,
  // and booking modal state management.
function Events()

{
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotels();
  const { addToCart } = useCart(); 
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeRoom, setActiveRoom] = useState(null);
  const [isBookingOpen, setIsBookingOpen] = useState(false);

 // Fetches conference rooms from Firebase whenever a hotel is selected.
  // Also handles loading state, error handling, and cleanup of the database listener.

  useEffect(() => {
    if (!selectedHotelId) {
      setRooms([]);
      return;
    }

    setLoading(true);
    const database = db || getDatabase();
    const roomsRef = ref(database, `conferenceRooms/${selectedHotelId}/rooms`);

    const unsubscribe = onValue(
      roomsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
           // Converts the Firebase object into an array and uses each objects key as its unique id.
          const roomsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setRooms(roomsList);
        } else {
          setRooms([]);
        }
        setLoading(false);
      },
      (firebaseError) => {
        console.error("Firebase error:", firebaseError);
        setError(
          "Failed to retrieve conference rooms. Please try again later.",
        );
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [selectedHotelId]);

  // filters hotels that has conference rooms, by checking hotel.hasEvents === true, and identifies currently selected hotel for display. 
  const eventHotels = hotels
    ? hotels.filter((hotel) => hotel.hasEvents === true)
    : [];
  const currentHotel = hotels
    ? hotels.find((h) => h.id === selectedHotelId)
    : null;

    // Renders the Events page, including hotel selection,
// conference room listings, and booking functionality.
  return (
    <main className="events-page">
      {/* Landing Section */}
      <section className="events-hero">
        <div className="events-hero-overlay" />
        <div className="events-hero-content">
          <p className="events-tagline">Professional Conference Solutions</p>
          <h1 className="events-title">
            Conferences & <br />
            Successful Meetings
          </h1>
          <p className="events-subtitle">
            Host your next event, workshop or conference in state-of-the-art
            facilities across Blueberry Hotels.
          </p>
           {/* linking to hotel selection section*/}
          <a href="#events-selection" className="events-cta-btn">
            Explore Meeting Rooms
          </a>
        </div>
      </section>

      {/* Intro, context about meeting spaces*/}
      <section className="events-intro container">
        <div className="events-intro-text">
          <h2>Spaces Built for Collaboration</h2>
          <p>
            From intimate boardrooms to expansive event halls—all our rooms
            fulfill the strict Blueberry standard for technical equipment and
            comfort.
          </p>
        </div>
      </section>
 {/* Div used as anchor point for scrolling to hotel selection */}
      <div id="events-selection" className="events-selection-divider"></div>

        {/* Displays hotel selection view only when no hotel is selected . Allows user to choose an event hotel to view conference rooms*/}
      {!selectedHotelId && (
        <section className="events-destinations">
          <div className="container">
            <h2 className="spa-destination-title">
              Select an Event Destination
            </h2>
            <p className="spa-destination-subtitle">
              Find the perfect venue tailored to your next corporate gathering.
            </p>
              {/* Loading state while hotels are still being fetched*/}
            {hotelsLoading ? (
              <p className="wellness-loading">Loading destinations...</p>
            ) : hotelsError ? ( 
              <p className="wellness-error">Error loading locations.</p>
            ) : (
             
             
              // Displays the filtered list of hotels WITH event facilities.
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
                      <button
                        className="see-rooms-btn"
                        onClick={() => setSelectedHotelId(hotel.id)}
                      >
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
              Currently viewing conference rooms available at{" "}
              <strong>{currentHotel?.name || "Chosen Location"}</strong>
            </p>
              {/* Button to go back to hotel selection */}
            <button
              className="filter-btn back-location-btn"
              onClick={() => setSelectedHotelId(null)}
            >
              ← Change Location
            </button>
              {/* Error message if there was an error fetching rooms */}
            {error && (
              <p className="wellness-error format-error-spacing">{error}</p>
            )}
              {/* Loading state while rooms are being fetched */}
            {loading ? (
              <p className="wellness-loading">Loading meeting rooms...</p>
            ) : rooms.length === 0 ? (
              <p className="wellness-error format-error-spacing">
                No conference rooms registered for this location.
              </p>
            ) : (
              <div className="events-table">
                <div className="table-header">
                  <span>Room Class</span>
                  <span>Capacity</span>
                  <span>Standard Equipment</span>
                  <span>Price (Per Day)</span>
                  <span></span>
                </div>
                {/* Renders a list of conference rooms  by mapping Firebase room data*/}
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
                      <span
                        className="price-tag"
                        style={{ fontWeight: "bold" }}
                      >
                        {room.price} kr
                      </span>
                    </div>
                    <div className="action-cell">
                       {/* Opens booking modal and sets selected room */}
                      <button
                        className="book-room-btn"
                        onClick={() => {
                          setActiveRoom(room);
                          setIsBookingOpen(true);
                        }}
                      >
                        Inquiry
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
          <p>
            Our event coordinators are ready to assist you with catering,
            tailor-made layouts and multi-day packages.
          </p>
          <div className="booking-actions">
            <Link to="/contact" className="contact-btn">
              Contact Event Team
            </Link>
          </div>
        </div>
      </section>

      {/* Event/conferenceroom booking Modal*/}
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
