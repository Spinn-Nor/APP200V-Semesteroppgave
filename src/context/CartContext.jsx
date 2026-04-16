/**
 * CartContext.jsx
 * 
 * Manages the global shopping cart state and allows saving the entire cart
 * as one Order in Firebase when the user confirms the booking.
 * 
 * @author Fredrik Fordelsen - Full implementation of CartContext with Firebase integration
 * @version 1.0
 */

import { createContext, useContext, useState } from 'react';
import { db } from '../firebase/config';
import { ref, push, set } from 'firebase/database';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState([]);
    const { currentUser } = useAuth();

    const addToCart = (item) => {
        const newItem = { 
            ...item, 
            cartId: Date.now() 
        };
        setCart(prev => [...prev, newItem]);
    };

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    const clearCart = () => setCart([]);

    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    /**
     * Saves the entire cart as one Order in Firebase.
     */
    const confirmBooking = async () => {
        if (cart.length === 0) {
            alert("Your cart is empty.");
            return false;
        }

        if (!currentUser) {
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
            console.error("Failed to save order:", error);
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

export const useCart = () => useContext(CartContext);