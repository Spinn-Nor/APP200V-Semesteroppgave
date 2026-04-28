import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useHotels } from '../hooks/useHotels'
import { testFirebaseConnection } from '../firebase/testConnection';



function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [destination, setDestination] = useState('')

  // Logic start for dropdown menu
  const { hotels } = useHotels(); // Gathers hotell-data from useHotels hook
  const [showDropdown, setShowDropdown] = useState(false); // Controlls dopdown visibility
  // filters dropdown based on what you write in "Where to?" input field
 
  const filteredHotels = (hotels || []).filter(hotel => 
    hotel.name && hotel.name.toLowerCase().includes(destination.toLowerCase())
  );

  useEffect(() => {
   
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
                id="destination-input" 
                name="destination"     
                type="text"
                placeholder="Where to?"
                value={destination}
                // Opens and closes meny for dropdown
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setDestination(e.target.value)}
              />

              {/* Dropdown functionality*/}
              {showDropdown && destination.length > 0 && (
                <ul className="destination-dropdown">
                  {filteredHotels.length > 0 ? (
                    filteredHotels.map((hotel) => (
                      <li 
                        key={hotel.id} 
                        onClick={() => {
                          setDestination(hotel.name);
                          setShowDropdown(false);
                        }}
                      >
                        {hotel.name}
                      </li>
                    ))
                  ) : (
                    <li className="no-match">No hotels found</li>
                  )}
                </ul>
              )}
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