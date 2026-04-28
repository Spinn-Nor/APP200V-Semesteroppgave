import { useState } from 'react';
import { Link } from 'react-router-dom'
import './Wellness.css' //

function Wellness() {
  
  const treatments = [
    {
      id: 1,
      title: 'Deep Tissue Massage',
      description: 'Relieve chronic tension and muscle pain with this focused massage.',
      duration: '60 min',
      price: '1200 NOK',
      image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=600&auto=format&fit=crop' // Massasje-bilde
    },
    {
      id: 2,
      title: 'Aromatherapy Facial',
      description: 'Revitalize your skin with organic essential oils and a hydrating mask.',
      duration: '45 min',
      price: '950 NOK',
      image: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?q=80&w=600&auto=format&fit=crop' // Ansiktsbehandling-bilde
    },
    {
      id: 3,
      title: 'Hot Stone Therapy',
      description: 'Melt away stress with heated stones placed on key energy points.',
      duration: '90 min',
      price: '1600 NOK',
      image: 'https://images.unsplash.com/photo-1600334129128-685c5582fd35?q=80&w=600&auto=format&fit=crop' // Steiner-bilde
    },
    {
      id: 4,
      title: 'Ocean Detox Body Wrap',
      description: 'Mineral-rich seaweed wrap to eliminate toxins and soften skin.',
      duration: '75 min',
      price: '1450 NOK',
      image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=600&auto=format&fit=crop' // Spa-atmosfære
    }
  ]

  return (
    <main className="wellness-page">
      {/* Hero-seksjon */}
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

      {/* Introduksjon-seksjon */}
      <section className="wellness-intro container">
        <div className="wellness-intro-text">
          <h2>Rejuvenate Your Mind & Body</h2>
          <p>
            Our expert therapists are dedicated to providing personalized care in a tranquil environment. 
            From therapeutic massages to revitalizing facials, every treatment is designed to 
            restore balance and enhance your well-being.
          </p>
        </div>
        <div className="wellness-intro-image">
          <img 
            src="https://images.unsplash.com/photo-1591348113651-78709559c55b?q=80&w=800&auto=format&fit=crop" 
            alt="Tranquil spa relaxation area" 
          />
        </div>
      </section>

      {/* Behandlingsmeny (Grid) */}
      <section id="treatments" className="wellness-treatments container">
        <h2>Spa Menu</h2>
        <div className="treatment-grid">
          {treatments.map((treatment) => (
            <div key={treatment.id} className="treatment-card">
              <div className="treatment-image-wrapper">
                <img src={treatment.image} alt={treatment.title} />
              </div>
              <div className="treatment-details">
                <h3>{treatment.title}</h3>
                <p className="treatment-description">{treatment.description}</p>
                <div className="treatment-meta">
                  <span className="duration">{treatment.duration}</span>
                  <span className="price">{treatment.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Booking-seksjon */}
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
  )
}

export default Wellness








