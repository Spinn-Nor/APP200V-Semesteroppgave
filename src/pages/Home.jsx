/**
 * Home Page Component
 *
 * The main landing page of Blueberry Hotels. Features a prominent hero section
 * with a smart booking search bar, destination autocomplete dropdown, featured
 * hotels, wellness & events highlights, and a call-to-action section.
 *
 * Key functionalities:
 * - Real-time hotel search with destination autocomplete
 * - Date validation for check-in / check-out
 * - Navigation to HotelDetail or Hotels page based on search
 * - Display of featured hotels using HotelCard component
 *
 * @author Victor Orby
 * @version 1.2
 */

import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useHotels } from "../hooks/useHotels";
import { useAuth } from "../context/AuthContext";
import { usePageTitle } from "../hooks/usePageTitle";
import HotelCard from "../components/HotelCard";

function Home() {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState("1");
  const [destination, setDestination] = useState("");
  const [showWellnessPopup, setShowWellnessPopup] = useState(false);
  const navigate = useNavigate();

  usePageTitle("Home");

  const today = new Date().toISOString().split("T")[0];
  const minCheckOut = checkIn
    ? new Date(new Date(checkIn).getTime() + 86400000)
        .toISOString()
        .split("T")[0]
    : today;

  const { hotels } = useHotels();
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter hotels for the search result dropdown list based on user-input in the destination field
  const filteredHotels = (hotels || []).filter((hotel) => {
    const city = hotel.city?.toLowerCase() || "";
    const secondWord = hotel.name.split(" ")[1]?.toLowerCase() || "";

    // Search for hotels based the first letter of the city/hotel name when searching for a single letter
    // Search for cities/hotels containing the search string when input-length is not 1
    return destination.length === 1
      ? city.startsWith(destination.toLowerCase()) ||
          secondWord.startsWith(destination.toLowerCase())
      : city.includes(destination.toLowerCase()) ||
          secondWord.includes(destination.toLowerCase());
  });

  const handleCheckInChange = (e) => {
    const newCheckIn = e.target.value;
    setCheckIn(newCheckIn);
    if (checkOut && checkOut <= newCheckIn) setCheckOut("");
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    const matchedHotel = hotels?.find(
      (h) => h.name.toLowerCase() === destination.toLowerCase(),
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
          <h1 className="hero-title">
            Your perfect stay,
            <br />
            wherever you are
          </h1>
          <p className="hero-subtitle">
            Discover luxury, comfort, and world-class service at every one of
            our locations.
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

              {showDropdown && destination.length >= 1 && (
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
                        <span className="dropdown-pin">📍</span>
                        <span className="dropdown-text">
                          <span className="dropdown-hotel-name">
                            {hotel.name}
                          </span>
                          <span className="dropdown-hotel-city">
                            {hotel.city}
                          </span>
                        </span>
                      </li>
                    ))
                  ) : (
                    <li className="no-match">No destinations found</li>
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
              <select
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
              >
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <option key={n} value={n}>
                    {n} {n === 1 ? "Guest" : "Guests"}
                  </option>
                ))}
              </select>
            </div>
            <button className="booking-search-btn" onClick={handleSearch}>
              Search Hotels
            </button>
          </div>
        </div>
      </section>

      {/* ── Features strip ── */}
      <section className="features-section">
        <div className="features-grid">
          {[
            {
              num: "01",
              title: "6 Locations",
              desc: "Handpicked hotels across Norway's most beautiful cities.",
            },
            {
              num: "02",
              title: "Spa & Wellness",
              desc: "Unwind with world-class treatments and facilities.",
            },
            {
              num: "03",
              title: "Events & Conferences",
              desc: "Flexible spaces for meetings, celebrations and more.",
            },
            {
              num: "04",
              title: "Free Cancellation",
              desc: "Plans change. Book with confidence, cancel any time.",
            },
          ].map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-num">{f.num}</span>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured hotels ── */}
      {hotels && hotels.length > 0 && (
        <section className="featured-section">
          <div className="home-section-inner">
            <div className="featured-header">
              <h2>Our Hotels</h2>
              <p>Handpicked stays across Norway's most beautiful cities</p>
            </div>
            <div className="featured-grid">
              {hotels.slice(0, 3).map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
            <div className="featured-footer">
              <Link to="/hotels" className="view-all-btn">
                Browse all hotels
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Experiences split ── */}
      <section className="experiences-section">
        <div className="home-section-inner">
          <div className="experiences-header">
            <h2>Experiences</h2>
            <p>More than just a place to sleep</p>
          </div>
          <div className="experiences-grid">
            <Link
              to="/wellness"
              className="experience-panel"
              style={{
                backgroundImage: `url("https://images.ctfassets.net/nwbqij9m1jag/3cuyh0NoZmDGiPvIIsjArS/988d7a799f8ac2dce0c18cab53e7876a/Comfort_Hotel_Bergen_-_Common_Area_-_Roof_terrace_original?fm=webp&q=80&w=2560")`,
              }}
            >
              <div className="experience-overlay" />
              <div className="experience-content">
                <span className="experience-tag">Wellness</span>
                <h3>Spa & Relaxation</h3>
                <p>Unwind with world-class treatments and facilities</p>
                <span className="experience-link">Explore Wellness →</span>
              </div>
            </Link>
            <Link
              to="/events"
              className="experience-panel"
              style={{
                backgroundImage: `url("https://images.ctfassets.net/nwbqij9m1jag/1jsqqONTu3rX7UDfPrLamq/23bc3c9801faea0f2d542cd4da95f846/Comfort_Hotel_Union_Brygge_-_Lobby_original?fm=webp&q=80&w=2560")`,
              }}
            >
              <div className="experience-overlay" />
              <div className="experience-content">
                <span className="experience-tag">Events</span>
                <h3>Conferences & Celebrations</h3>
                <p>Host your next meeting or special occasion with us</p>
                <span className="experience-link">See Events →</span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA banner ── */}
      <section className="cta-section">
        <h2 className="cta-title">Ready to explore Norway?</h2>
        <p className="cta-subtitle">Find your perfect hotel in minutes.</p>
        <Link to="/hotels" className="cta-btn">
          Search hotels →
        </Link>
      </section>
    </main>
  );
}

export default Home;
