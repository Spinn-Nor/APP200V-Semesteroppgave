import { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import './Wellness.css'; 
import { getDatabase, ref, onValue } from 'firebase/database';
import { db } from '../firebase/config';

function Wellness() {
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
          // Fallback i tilfelle et bildefelt skulle mangle helt i NoSQL-databasen, kan slete 
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
          <a href="#treatments" className="wellness-cta-btn">Explore Treatments</a>
        </div>
      </section>

      {/* Introduksjon-seksjon ( */}
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

      {/* Treatment menu */}
      <section id="treatments" className="wellness-treatments">
        <div className="container">
          <h2>Spa Menu</h2>
          
          {/* Shows error message if database fails */}
          {error && (
            <p style={{ textAlign: 'center', color: '#ff4d4d', fontSize: '1.2rem', marginBottom: '2rem' }}>{error}</p>
          )}
          
          {loading ? (
            <p style={{ textAlign: 'center', fontSize: '1.2rem' }}>Loading treatments...</p>
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