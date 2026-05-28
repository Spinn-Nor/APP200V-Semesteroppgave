
/**
 * SpaBookingModal.jsx
 *
 * Wizard modal for selecting appointment details and summarizing spa bookings.
 *
 * @author Pelle Thoresen
 * @version 1.8
 */


import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Wellness.css';
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { useHotels } from '../hooks/useHotels';
import SpaBookingModal from "../components/SpaBookingModal";

function Wellness() {
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotels();
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //  POPUP STATE: Stores the treatment that is currently clicked on
  const [activeTreatment, setActiveTreatment] = useState(null);
  // booking modal state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  // for remembering treatment after closing popup
  const [selectedTreatmentForBooking, setSelectedTreatmentForBooking] = useState(null);

  useEffect(() => {
    const database = db || getDatabase();
    const treatmentsRef = ref(database, 'Spa/treatments');

    const unsubscribe = onValue(treatmentsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const treatmentsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          image: data[key].image || 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop'
        }));
        setTreatments(treatmentsList);
      } else {
        setTreatments([]);
      }
      setLoading(false);
    }, (firebaseError) => {
      console.error("Firebase error:", firebaseError);
      setError("Failed to retrieve treatments. Please try again later.");
      setLoading(false);
    });



    return () => unsubscribe();
  }, []);

  const spaHotels = hotels ? hotels.filter(hotel => hotel.hasSpa === true) : [];
  const currentHotel = hotels ? hotels.find(h => h.id === selectedHotelId) : null;

  return (
    <main className="wellness-page">
      {/* Hero */}
      <section className="wellness-hero">
        <div className="wellness-hero-overlay" />
        <div className="wellness-hero-content">
          <p className="wellness-tagline">Serenity & Balance</p>
          <h1 className="wellness-title">Your Sanctuary <br />of Wellness</h1>
          <p className="wellness-subtitle">
            Escape the everyday and discover a world of pure relaxation at Blueberry Spa.
          </p>
          <a href="#spa-selection" className="wellness-cta-btn">Explore Treatments</a>
        </div>
      </section>

      {/* Intro */}
      <section className="wellness-intro container" id='wellnessIntro'>
        <div className="wellness-intro-text">
          <h2>Rejuvenate Your Mind & Body</h2>
          <p>
            Our expert therapists are dedicated to providing personalized care in a tranquil environment.
          </p>
        </div>
      </section>

      <div id="spa-selection" className="spa-selection-divider"></div>

      {/*  Select Location */}
      {!selectedHotelId && (
        <section className="wellness-treatments">
          <div className="container">
            <h2 className="spa-destination-title">Select a Spa Destination</h2>
            <p className="spa-destination-subtitle">Our luxury treatments are tailored to each unique location.</p>

            {hotelsLoading ? (
              <p className="wellness-loading">Loading destinations...</p>
            ) : hotelsError ? (
              <p className="wellness-error">Error loading locations.</p>
            ) : (
              <div className="hotels-grid">
                {spaHotels.map((hotel) => (
                  <div key={hotel.id} className="hotel-card">
                    {/* Gathers pictures stored in DB as an array */}
                    <img
                      src={(hotel.images && hotel.images[0])}
                      alt={hotel.name}
                      className="hotel-image"
                    />
                    <div className="hotel-info">
                      <h3>{hotel.name}</h3>
                      <p className="hotel-location">📍 {hotel.city}</p>
                      <p className="hotel-description">{hotel.description}</p>
                      <button className="see-rooms-btn" onClick={() => setSelectedHotelId(hotel.id)}>
                        View Spa Menu
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}


      {/* STEP 2: Show Spa Menu */}
      {selectedHotelId && (
        <section id="treatments" className="wellness-treatments">
          <div className="container">

            <h2 className="spa-menu-title">Spa Menu</h2>
            <p className="spa-menu-subtitle">
              Currently viewing treatments available at <strong>{currentHotel?.name || 'Chosen Location'}</strong>
            </p>

            <button className="filter-btn back-location-btn" onClick={() => setSelectedHotelId(null)}>
              ← Change Location
            </button>

            {error && <p className="wellness-error format-error-spacing">{error}</p>}

            {loading ? (
              <p className="wellness-loading">Loading treatments...</p>
            ) : (
              <div className="treatment-grid">
                {treatments.map((treatment) => (
                  /* Clicking this card opens the popup by setting the active treatment */
                  <div
                    key={treatment.id}
                    className="treatment-card interactive-card"
                    onClick={() => setActiveTreatment(treatment)}
                  >
                    <div className="treatment-image-wrapper">
                      <img src={treatment.image} alt={treatment.name} />
                    </div>
                    <div className="treatment-details">
                      <h3>{treatment.name}</h3>
                      <p className="treatment-description">{treatment.Description}</p>
                      <div className="treatment-meta">
                        <span className="duration">{treatment.Duration}</span>
                        <span className="price">{treatment.Price}kr</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Popup Modal for booking button */}
      {activeTreatment && (
        <div className="treatment-modal-overlay" onClick={() => setActiveTreatment(null)}>
          <div className="treatment-modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setActiveTreatment(null)}>×</button>

            <div className="wellness-modal-body">
              <div className="modal-image-container">
                <img src={activeTreatment.image} alt={activeTreatment.name} />
              </div>

              <div className="modal-info-container">
                <h2>{activeTreatment.name}</h2>
                <div className="modal-meta-tags">
                  <span className="modal-tag-duration">⏱ {activeTreatment.Duration}</span>
                  <span className="modal-tag-price"> Price: {activeTreatment.Price}</span>
                </div>
                <hr className="modal-divider" />
                <p className="modal-description-text">{activeTreatment.Description}</p>

                <div className="modal-action-row">
                  {/* OPPDATERT: Gjør alt i ett klikk her nå */}
                  <button
                    className="modal-book-btn"
                    onClick={() => {
                      setSelectedTreatmentForBooking(activeTreatment);
                      setIsBookingOpen(true);
                      setActiveTreatment(null);
                    }}
                  >
                    Book Treatment
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Booking Footer */}
      <section className="wellness-booking">
        <div className="wellness-booking-content container">
          <h2>Ready for Your Spa Experience?</h2>
          <p>Book your appointment online or contact our reception.</p>
          <div className="booking-actions">
            {/* <Link to="/contact" className="contact-btn">Call Reception</Link>
            <Link to="/booking" className="book-now-btn">Book Online</Link> */}
          </div>
        </div>
      </section>

      {/* Spa Booking Modal */}
      <SpaBookingModal
        isOpen={isBookingOpen}
        onClose={() => {
          setIsBookingOpen(false);
          setSelectedTreatmentForBooking(null);
        }}
        treatment={selectedTreatmentForBooking}
        hotelName={currentHotel?.name}
        hotelId={selectedHotelId}
      />
    </main>
  );
}

export default Wellness;