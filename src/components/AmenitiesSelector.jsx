/**
 * AmenitiesSelector Component
 *
 * A reusable component that allows users to select and deselect additional
 * amenities (e.g. breakfast, spa access, WiFi) during the booking process.
 *
 * Features:
 * - Toggle amenities by clicking on cards
 * - Visual feedback for selected items
 * - Displays icon, label and price for each amenity
 *
 * @author Fredrik Fordelsen
 * @version 1.0
 *
 */

import { useState } from "react";
import "../styles/AmenitiesSelector.css";

function AmenitiesSelector({
  amenities = [],
  selectedAmenities = [],
  onChange,
}) {
  const toggleAmenity = (amenity) => {
    if (selectedAmenities.some((a) => a.id === amenity.id)) {
      onChange(selectedAmenities.filter((a) => a.id !== amenity.id));
    } else {
      onChange([...selectedAmenities, amenity]);
    }
  };

  if (!amenities || amenities.length === 0) {
    return <p>Ingen tilleggsfasiliteter tilgjengelig for dette hotellet.</p>;
  }

  return (
    <div className="amenities-selector">
      <h3>Tilleggsfasiliteter</h3>
      <p className="amenities-subtitle">Klikk for å velge / fjerne</p>

      <div className="amenities-grid">
        {amenities.map((amenity) => {
          const isSelected = selectedAmenities.some((a) => a.id === amenity.id);

          return (
            <div
              key={amenity.id}
              className={`amenity-card ${isSelected ? "selected" : ""}`}
              onClick={() => toggleAmenity(amenity)}
            >
              <span className="amenity-icon">{amenity.icon}</span>
              <div className="amenity-info">
                <p className="amenity-label">{amenity.label}</p>
                <p className="amenity-price">+ {amenity.price} kr</p>
              </div>
              <input
                type="checkbox"
                checked={isSelected}
                readOnly
                className="amenity-checkbox"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AmenitiesSelector;
