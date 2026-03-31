import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { testFirebaseConnection } from '../firebase/testConnection';

function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [destination, setDestination] = useState('')

  useEffect(() => {
    testFirebaseConnection();
  }, []);
  
  return (
    <main className="home">

      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay" />
        <div className="hero-content">
          <p className="hero-tagline">Welcome to Blueberry Hotels</p>
          <h1 className="hero-title">Your perfect stay,<br />wherever you are</h1>
          <p className="hero-subtitle">
            Discover luxury, comfort, and world-class service at every one of our locations.
          </p>

          {/* Booking bar */}
          <div className="booking-bar">
            <div className="booking-field">
              <label>Destination</label>
              <input
                type="text"
                placeholder="Where to?"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
            </div>
            <div className="booking-divider" />
            <div className="booking-field">
              <label>Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
              />
            </div>
            <div className="booking-divider" />
            <div className="booking-field">
              <label>Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
              />
            </div>
            <div className="booking-divider" />
            <div className="booking-field">
              <label>Guests</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)}>
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>
                ))}
              </select>
            </div>
            <Link to="/booking" className="booking-search-btn">Search Hotels</Link>
          </div>
        </div>
      </section>

    </main>
  )
}


export default Home
