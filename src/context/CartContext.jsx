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
    if (cart.length === 0) {
      alert("Handlekurven er tom.");
      return false;
    }

    const currentUserId = currentUser?.uid || "test-user-" + Date.now();

    try {
      const orderRef = ref(db, `orders/${currentUserId}`);
      const newOrderRef = push(orderRef);

      const orderData = {
        orderId: newOrderRef.key,
        userId: currentUserId,
        userEmail: currentUser?.email || "unknown",
        items: cart,
        totalPrice: totalPrice,
        status: "confirmed",
        createdAt: new Date().toISOString(),
      };

      await set(newOrderRef, orderData);

      clearCart();
      showToast("Booking confirmed successfully!", "success");
      return true;
    } catch (error) {
      console.error("Feil ved lagring til Firebase:", error);
      showToast("Could not save booking. Please try again.", "error");
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
