import {Link} from 'react-router-dom'

function RoomCard({room}) {

  return (
    <div className="room-card">
        <div className="room-type">
            <h3>{room.type}</h3>
        </div>

        <div className="room-details">
            <p><strong>Price per night:</strong> {room.price} kr</p>
            <p><strong>Capacity:</strong> {room.capacity} people</p>
            <p><strong>Available</strong> {room.available} room</p>
        </div>

        <div className="room-amenities">
            {room.amenities && room.amenities.map((amenity, index) => (
                <span key={index} className="amenity-tag">{amenity}</span>
            ))}
        </div>

        <button className="book-roomBtn">
            Book this room
        </button>
    </div>
  )
}

export default RoomCard