import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import './Wellness.css'; 
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';
import { useHotels } from '../hooks/useHotels';

function Wellness() {
  // Fetches hotels from the hook, and manages state for the selected hotel ID
  const { hotels, loading: hotelsLoading, error: hotelsError } = useHotels();
  const [selectedHotelId, setSelectedHotelId] = useState(null); 
  

  const [treatments, setTreatments] = useState([]);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); // Network or Firebase error state

  useEffect(() => {
    const database = db || getDatabase();
    const treatmentsRef = ref(database, 'Spa/treatments');
    
    const unsubscribe = onValue(treatmentsRef, (snapshot) => {
      const data = snapshot.val();
      
      if (data) {
        const treatmentsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
          // Fallback image in case the image field is missing in the NoSQL database
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

  // >>> NEW: Filters hotels that have hasSpa === true, and finds the currently active hotel
  const spaHotels = hotels ? hotels.filter(hotel => hotel.hasSpa === true) : [];
  const currentHotel = hotels ? hotels.find(h => h.id === selectedHotelId) : null;
  // >>> END NEW

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
          {/* >>> NEW: Changed link anchor so the button scrolls down to the destination selector */}
          <a href="#spa-selection" className="wellness-cta-btn">Explore Treatments</a>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="wellness-intro container">
        <div className="wellness-intro-text">
          <h2>Rejuvenate Your Mind & Body</h2>
          <p>
            Our expert therapists are dedicated to providing personalized care in a tranquil environment. 
            From therapeutic massages to revitalizing facials, every treatment is designed to 
            restore balance and enhance your well-being.
          </p>
        </div>
      </section>

      {/*  ID anchor that handles the scroll from the "Explore Treatments" button */}
      <div id="spa-selection" className="spa-selection-divider"></div>

      {/*  If selectedHotelId is null (nothing selected), display the hotel grid first */}
      {!selectedHotelId && (
        <section className="wellness-treatments">
          <div className="container">
            <h2 className="spa-destination-title">Select a Spa Destination</h2>
            <p className="spa-destination-subtitle">
              Our luxury treatments are tailored to the environment of each unique location.
            </p>

            {hotelsLoading ? (
              <p className="wellness-loading">Loading destinations...</p>
            ) : hotelsError ? (
              <p className="wellness-error">Error loading locations.</p>
            ) : (
              /* This grid automatically reuses classes and styling from Hotels.css */
              <div className="hotels-grid">
                {spaHotels.map((hotel) => (
                  <div key={hotel.id} className="hotel-card">
                    <img src={hotel.image} alt={hotel.name} className="hotel-image" />
                    <div className="hotel-info">
                      <h3>{hotel.name}</h3>
                      <p className="hotel-location">📍 {hotel.city}</p>
                      <p className="hotel-description">{hotel.description}</p>
                      {/* Clicking this sets the hotel ID in state, flipping the view to Step 2 */}
                      <button 
                        className="see-rooms-btn" 
                        onClick={() => setSelectedHotelId(hotel.id)}
                      >
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
   

      {/* If selectedHotelId has an ID value, hide the hotels and display the spa menu */}
      {selectedHotelId && (
        <section id="treatments" className="wellness-treatments">
          <div className="container">
            
            {/* Button that resets the selection and takes the user back to the destinations */}
            <button 
              className="filter-btn back-location-btn" 
              onClick={() => setSelectedHotelId(null)}
            >
              ← Change Location
            </button>

            <h2 className="spa-menu-title">Spa Menu</h2>
            {/* Displays the name of the hotel the user clicked on in the previous step */}
            <p className="spa-menu-subtitle">
              Currently viewing treatments available at <strong>{currentHotel?.name || 'Chosen Location'}</strong>
            </p>
            
            {error && (
              <p className="wellness-error format-error-spacing">{error}</p>
            )}
            
            {loading ? (
              <p className="wellness-loading">Loading treatments...</p>
            ) : (
              <div className="treatment-grid">
                {treatments.map((treatment) => (
                  <div key={treatment.id} className="treatment-card">
                    <div className="treatment-image-wrapper">
                      <img src={treatment.image} alt={treatment.name} />
                    </div>
                    <div className="treatment-details">
                      <h3>{treatment.name}</h3>
                      <p className="treatment-description">{treatment.Description}</p>
                      <div className="treatment-meta">
                        <span className="duration">{treatment.Duration}</span>
                        <span className="price">{treatment.Price}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    

      {/* Booking */}
      <section className="wellness-booking">
        <div className="wellness-booking-content container">
          <h2>Ready for Your Spa Experience?</h2>
          <p>
            Book your appointment online or contact our reception to create your personalized 
            wellness journey.
          </p>
          <div className="booking-actions">
            <Link to="/contact" className="contact-btn">Call Reception</Link>
            <Link to="/booking" className="book-now-btn">Book Online</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Wellness;