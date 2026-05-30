/**
 * CartContext.jsx
 *
 * Global cart management supporting multiple booking types:
 * - Rooms (accommodation)
 * - Spa treatments
 * - Events / Conference rooms
 *
 * When confirmed, the entire cart is saved as one Order in Firebase.
 *
 * @author Fredrik Fordelsen - Extended cart to support multiple booking types
 * @version 1.1
 */

import { createContext, useContext, useState } from "react";
import { db } from "../firebase/config";
import { ref, push, set, get } from "firebase/database";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const { currentUser } = useAuth();
  const [toast, setToast] = useState(null);

  /**
   * Add any type of booking item to the cart
   */
  const addToCart = (item) => {
    const cartItem = {
      ...item,
      cartId: Date.now(),
      addedAt: new Date().toISOString(),
    };
    setCart((prev) => [...prev, cartItem]);
  };

  const removeFromCart = (cartId) => {
    setCart((prev) => prev.filter((item) => item.cartId !== cartId));
  };

  const clearCart = () => setCart([]);

  const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    // Remove toast after 4 seconds
    setTimeout(() => setToast(null), 4000);
  };

  /**
   * Saves the entire cart as one Order in Firebase
   */
  const confirmBooking = async () => {
    if (cart.length === 0) return false;

    const user = currentUser;

    if (!user) {
      showToast("You must be logged in to confirm booking", "error");
      return false;
    }

    try {
      const orderId = `order-${Date.now()}`;

      // Fetch customer name from the users node in the database
      const userRef = ref(db, `users/${user.uid}`);
      const userSnapshot = await get(userRef);

      let customerName = "Unknown Customer";
      if (userSnapshot.exists()) {
        const userData = userSnapshot.val();
        customerName =
          userData.displayName ||
          userData.fullName ||
          userData.name ||
          (user.email ? user.email.split("@")[0] : "Unknown Customer");
      }

      // Clean and prepare items - preserve original fields for MyBookings compatibility
      const cleanItems = cart.map((item) => ({
        // Spread original item to preserve all data (including date, checkIn, etc.)
        ...item,

        // Ensure important fields are always present and properly formatted
        name: item.name || "Unknown Room",
        type: item.type || "Room",
        price: Number(item.price) || 0,
        pricePerNight: Number(item.pricePerNight) || 0,
        nights: Number(item.nights) || 1,

        // Date fields - critical for MyBookings to display dates correctly
        date: item.date || item.checkIn || null,
        checkIn: item.checkIn || item.date || null,
        checkOut: item.checkOut || null,

        hotelName: item.hotelName || "Unknown Hotel",
        hotelId: item.hotelId || "unknown",
        roomId: item.roomId || item.id || "unknown-room",
        amenities: item.amenities || [],
        amenitiesTotal: Number(item.amenitiesTotal) || 0,
        category: item.category || "accommodation",
      }));

      // Create the complete order object
      const orderData = {
        userId: user.uid,
        customerName: customerName,
        customerEmail: user.email || "—",
        totalPrice: Number(totalPrice) || 0,
        status: "confirmed",
        createdAt: new Date().toISOString(),
        orderId: orderId,
        items: cleanItems,
      };

      // Save to Firebase
      await set(ref(db, `orders/${user.uid}/${orderId}`), orderData);

      clearCart();
      showToast("Booking confirmed successfully!", "success");
      return true;
    } catch (error) {
      console.error("Error saving order:", error);
      showToast("Failed to confirm booking. Please try again.", "error");
      return false;
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalPrice,
        confirmBooking,
        showToast,
      }}
    >
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`}>{toast.message}</div>
      )}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
