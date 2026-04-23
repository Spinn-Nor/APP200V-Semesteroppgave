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

import { createContext, useContext, useState } from 'react';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { currentUser } = useAuth();

    /**
     * Add any type of booking item to the cart
     */
    const addToCart = (item) => {
        const cartItem = {
            ...item,
            cartId: Date.now(),
            addedAt: new Date().toISOString()
        };
        setCart(prev => [...prev, cartItem]);
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    /**
     * Saves the entire cart as one single Order in Firebase.
     * This allows showing all bookings on "My Bookings" page later.
     */
    const confirmBooking = async () => {
        if (cart.length === 0 || !currentUser) {
            alert("You must be logged in and have items in cart.");
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

            console.log("Full order saved to Firebase:", orderData);
            clearCart();
            return true;

        } catch (error) {
            console.error("Failed to save order:", error);
            alert("Could not save booking. Please try again.");
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

export const useCart = () => useContext(CartContext);