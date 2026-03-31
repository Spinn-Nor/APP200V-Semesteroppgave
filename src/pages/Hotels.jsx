import { useState, useEffect } from 'react';
import HotelCard from '../components/HotelCard';

function Hotels() {
    const [hotels, setHotels] = useState([]);
    const [ftileredHotels, setFilteredHotels] = useState([]);
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
    <div>Hotels</div>
  )
}

export default Hotels