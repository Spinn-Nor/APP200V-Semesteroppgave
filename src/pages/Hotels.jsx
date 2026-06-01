/**
 * Hotels Page Component
 *
 * Displays all available hotels with filtering functionality by city.
 * Uses the custom useHotels hook to fetch real-time data from Firebase.
 *
 * Features:
 * - City filter buttons (dynamically generated)
 * - Responsive hotel grid using HotelCard component
 * - Loading and error state handling
 * - Page title management
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 */

import { useState } from "react";
import HotelCard from "../components/HotelCard";
import { useHotels } from "../hooks/useHotels";
import { usePageTitle } from "../hooks/usePageTitle";
import "../styles/Hotels.css";

function Hotels() {
  const { hotels, loading, error } = useHotels();
  const [selectedCity, setSelectedCity] = useState("All");

  usePageTitle("Hotels");

  // Filtering hotels based on chosen city
  const filteredHotels =
    selectedCity === "All"
      ? hotels
      : hotels.filter((hotel) => hotel.city === selectedCity);

  const cities = ["All", ...new Set(hotels.map((h) => h.city))];

  if (loading) {
    return (
      <div className="hotels">
        <h2>Loading hotels...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="hotels">
        <h2>Error: {error}</h2>
      </div>
    );
  }
  return (
    <div className="hotels">
      <div className="container">
        <div className="hotels-header">
          <h1>Our Hotels</h1>
          <p>
            Choose one of premium locations and find the perfect room for you
          </p>
        </div>

        {/* Filter */}
        <div className="filter-bar">
          {cities.map((city) => (
            <button
              key={city}
              className={`filter-btn ${selectedCity === city ? "active" : ""}`}
              onClick={() => setSelectedCity(city)}
            >
              {city}
            </button>
          ))}
        </div>

        {/* Hotell grid */}
        <div className="hotels-grid">
          {filteredHotels.map((hotel) => (
            <HotelCard key={hotel.id} hotel={hotel} />
          ))}
        </div>

        {filteredHotels.length === 0 && (
          <p
            style={{ textAlign: "center", marginTop: "40px", color: "#64748b" }}
          >
            No hotels found for this location.
          </p>
        )}
      </div>
    </div>
  );
}

export default Hotels;
