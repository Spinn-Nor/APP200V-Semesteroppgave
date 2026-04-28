/**
 * App.jsx
 * 
 * Main application component.
 * AuthProvider must wrap CartProvider because CartContext depends on useAuth.
 * 
 * @author Fredrik Fordelsen - Fixed provider order
 * @version 1.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Nav from './components/Nav';
import Home from './pages/Home';
import Hotels from './pages/Hotels';
import Wellness from './pages/Wellness';
import HotelDetail from './pages/HotelDetail';
import Events from './pages/Events';
import Locations from './components/LocationsMap';
import Login from './pages/Login';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Nav />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/events" element={<Events />} />
            <Route path="/hotels" element={<Hotels />} />
            <Route path="/hotels/:id" element={<HotelDetail />} />
            <Route path="/wellness" element={<Wellness />} />
            <Route path="/locations" element={<Locations />} />
            <Route path="/login" element={<Login />} />
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;