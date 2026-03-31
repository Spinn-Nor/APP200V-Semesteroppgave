import {Link} from 'react-router-dom'

function HotelCard() {
  return (
    <div className="hotel-card">
        <img src={hotel.imageUrl} alt={hotel.name} className="hotel-image" />

        <div className="hotel-info">
            <h3>{hotel.name}</h3>
            <p className="hotel-location">{hotel.city}</p>

            <div className="hotel-details">
                <span>{hotel.rating} ★</span>
                <span>{hotel.roomCount} rom</span>
            </div>

            <p className="hotel-description">{hotel.description}</p>

            <Link to={`/hotels/${hotel.id}`} className="see-rooms-btn">
                Se tilgjengelige rom
            </Link>
        </div>
    </div>
  )
}

export default HotelCard