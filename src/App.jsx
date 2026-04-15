import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import './App.css'
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Nav from './components/Nav';
import Locations from './components/LocationsMap';

import Events from './pages/Events';


import HotelDetail from './pages/HotelDetail';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <Nav />

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/events" element={<Events />} />

        <Route path="/hotels" element={<Hotels />} />
        <Route path="/hotels/:id" element={<HotelDetail />} />

        <Route path="/locations" element={<Locations />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  )
}

export default App
