import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useHotels } from '../hooks/useHotels'
import { useAuth } from "../context/AuthContext";

function Home() {
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState('1')
  const [destination, setDestination] = useState('')
  const [showWellnessPopup, setShowWellnessPopup] = useState(false);
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000).toISOString().split('T')[0]
    : today;

  const { hotels } = useHotels();
  const [showDropdown, setShowDropdown] = useState(false);

  const filteredHotels = (hotels || []).filter(hotel =>
    hotel.name && hotel.name.toLowerCase().includes(destination.toLowerCase())
  );

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    if (checkOut && checkOut <= newCheckIn) setCheckOut('');
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set('checkIn', checkIn);
    if (checkOut) params.set('checkOut', checkOut);

    const matchedHotel = hotels?.find(
      h => h.name.toLowerCase() === destination.toLowerCase()
    );

    if (matchedHotel) {
      navigate(`/hotels/${matchedHotel.id}?${params.toString()}`);
    } else {
      navigate(`/hotels?${params.toString()}`);
    }
  };

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
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                onChange={(e) => setDestination(e.target.value)}
              />

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
                min={today}
                onChange={handleCheckInChange}
              />
            </div>
            <div className="booking-divider" />
            <div className="booking-field">
              <label>Check-out</label>
              <input
                type="date"
                value={checkOut}
                min={minCheckOut}
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
            <button className="booking-search-btn" onClick={handleSearch}>Search Hotels</button>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Home
