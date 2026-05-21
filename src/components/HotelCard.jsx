import { Link, useLocation } from 'react-router-dom'

function HotelCard({hotel}) {
  const { search } = useLocation();

  return (
    <div className="hotel-card">
        <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" />

        <div className="hotel-info">
            <h3>{hotel.name}</h3>
            <p className="hotel-location">{hotel.city}</p>

            <div className="hotel-details">
                <span>{hotel.rating} ★</span>
            </div>

            <p className="hotel-description">{hotel.description}</p>

            <Link to={`/hotels/${hotel.id}${search}`} className="see-rooms-btn">
                View available rooms
            </Link>
        </div>
    </div>
  )
}

export default HotelCard