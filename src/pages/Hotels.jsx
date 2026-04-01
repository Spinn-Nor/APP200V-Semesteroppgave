import { useState, useEffect } from 'react';
import HotelCard from '../components/HotelCard';

function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [filteredHotels, setFilteredHotels] = useState([]);
    const [selectedCity, setSelectedCity] = useState('Alle');

    useEffect(() => {
    const dummyData = [
        {
        id: "oslo1",
        name: "Blueberry Oslo",
        city: "Oslo",
        rating: 4.7,
        roomCount: 124,
        description: "Moderne hotell sentralt i Oslo med fantastisk utsikt.",
        imageUrl: "https://picsum.photos/id/1015/600/400"
      },
      {
        id: "bergen1",
        name: "Blueberry Bergen",
        city: "Bergen",
        rating: 4.5,
        roomCount: 87,
        description: "Koselig hotell nær Bryggen med fjordutsikt.",
        imageUrl: "https://picsum.photos/id/133/600/400"
      },
      {
        id: "trondheim1",
        name: "Blueberry Trondheim",
        city: "Trondheim",
        rating: 4.8,
        roomCount: 65,
        description: "Nytt og stilfullt hotell i hjertet av Trondheim.",
        imageUrl: "https://picsum.photos/id/201/600/400"
      }
    ];

    setHotels(dummyData);
    setFilteredHotels(dummyData);
    }, []);

    // Filter functionality
    const handleFilter = (city) => {
        setSelectedCity(city);
        if(city === 'Alle') {
            setFilteredHotels(hotels);
        } else {
            setFilteredHotels(hotels.filter(hotel => hotel.city === city));
        }
    };


  return (
    <div className="hotels">
       <div className="container">
         <div className="hotels-header">
            <h1>Our Hotels</h1>
            <p>Choose a hotel and find the perfect room for you</p>
        </div>

        {/* Filter */}
        <div className="filter-bar">

            <button
                className={`filter-btn ${selectedCity === 'Alle' ? 'active' : ''}`}
                onClick={() => handleFilter('Alle')}>
                Alle
            </button>

            <button 
                className={`filter-btn ${selectedCity === 'Oslo' ? 'active' : ''}`}
                onClick={() => handleFilter('Oslo')}
                >
                Oslo
            </button>

            <button 
                className={`filter-btn ${selectedCity === 'Bergen' ? 'active' : ''}`}
                onClick={() => handleFilter('Bergen')}
                >   
                Bergen
            </button>

            <button 
                className={`filter-btn ${selectedCity === 'Trondheim' ? 'active' : ''}`}
                onClick={() => handleFilter('Trondheim')}
                >
                Trondheim
            </button>
        </div>

        {/* Hotel Grid */}
        <div className="hotels-grid">
            {filteredHotels.map(hotel => (
                <HotelCard key={hotel.id} hotel={hotel} />
            ))}
        </div>
       </div>
    </div>
  );
}

export default Hotels;