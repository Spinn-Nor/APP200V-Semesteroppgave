import React from 'react';
import './Events.css';

const Events = () => {
  const roomData = [
    { 
      id: 1, 
      name: "The Boardroom", 
      hotel: "Blueberry Grand Central", 
      capacity: "12 people", 
      equipment: "65'' Screen, Video Hub",
      price: "From 4500,-" 
    },
    { 
      id: 2, 
      name: "The Ocean Hall", 
      hotel: "Farris Bad (Blueberry)", 
      capacity: "150 people", 
      equipment: "Stage, Projector, Sound System",
      price: "From 12000,-" 
    },
    { 
      id: 3, 
      name: "The Creative Studio", 
      hotel: "Blueberry Boutique", 
      capacity: "25 people", 
      equipment: "Whiteboard, VR-set",
      price: "From 6000,-" 
    }
  ];

  return (
    <div className="events-page">
      <header className="events-hero">
        <h1>Conferences & Meetings</h1>
        <p>Book professional meeting spaces across all Blueberry Hotels</p>
      </header>

      <div className="events-table">
        <div className="table-header">
          <span>Room Name</span>
          <span>Hotel Location</span>
          <span>Capacity</span>
          <span>Equipment</span>
          <span>Price</span>
          <span></span>
        </div>

        {roomData.map(room => (
          <div key={room.id} className="table-row">
            <div className="room-name-cell">
              <strong>{room.name}</strong>
            </div>
            <div className="hotel-name-cell">
              <span className="hotel-tag">{room.hotel}</span>
            </div>
            <div className="capacity-cell">
              {room.capacity}
            </div>
            <div className="equipment-cell">
              <small>{room.equipment}</small>
            </div>
            <div className="price-cell">
              {room.price}
            </div>
            <div className="action-cell">
              <button className="book-room-btn">Inquiry</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;