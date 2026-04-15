/**
 * CartContext.jsx
 * 
 * Manages the global shopping cart state for the Blueberry Hotels application.
 * Allows users to add multiple bookings (rooms, spa, conference rooms) before
 * confirming the entire order as one booking in Firebase.
 * 
 * @author Fredrik Fordelsen - Full implementation of CartContext, addToCart,
 *
 */

import { createContext, useContext, useState } from 'react';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';
import { useAuth } from './AuthContext';

const CartContext = createContext();

/**
 * CartProvider - Provides cart state and functions to all child components.
 * Uses React Context to avoid prop drilling.
 */
export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { currentUser } = useAuth();

    /**
     * Adds a new item to the cart.
     * Each item receives a unique cartId for easy removal.
     */
    const addToCart = (item) => {
        const newItem = { 
            ...item, 
            cartId: Date.now() 
        };
        setCart(prev => [...prev, newItem]);
    };

    /**
     * Removes an item from the cart using its cartId.
     */
    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    /**
     * Clears the entire cart after a successful booking.
     */
    const clearCart = () => setCart([]);

    /**
     * Calculates the total price of all items in the cart.
     */
    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    /**
     * Saves the entire cart as one Order in Firebase Realtime Database.
     * Path: orders/{userId}/{orderId}
     * This allows users to later view their bookings on a "My Bookings" page.
     */
    const confirmBooking = async () => {
        if (cart.length === 0 || !currentUser) {
            alert("You must be logged in to confirm a booking.");
            return false;
        }

        try {
            const orderRef = ref(db, `orders/${currentUser.uid}`);
            const newOrderRef = push(orderRef);

            const orderData = {
                orderId: newOrderRef.key,
                userId: currentUser.uid,
                items: cart,
                totalPrice: totalPrice,
                status: "confirmed",
                createdAt: new Date().toISOString()
            };

            await set(newOrderRef, orderData);

            console.log("Order successfully saved to Firebase:", orderData);
            clearCart();
            return true;

        } catch (error) {
            console.error("Failed to save order to Firebase:", error);
            alert("Failed to save booking. Please try again.");
            return false;
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice,
            confirmBooking
        }}>
            {children}
        </CartContext.Provider>
    );
}

/**
 * Custom hook to access cart context from any component.
 */
export const useCart = () => useContext(CartContext);