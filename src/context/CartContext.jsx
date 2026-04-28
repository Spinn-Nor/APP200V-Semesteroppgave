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
    const [toast, setToast] = useState(null);

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

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        // Fjern toast etter 4 sekunder
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

        // Temporary test user (bytt senere)
        const testUserId = "fredrik-123";   // ← change to dynamic id later

        const currentUserId = currentUser?.uid || testUserId;

        try {
            const orderRef = ref(db, `orders/${currentUserId}`);
            const newOrderRef = push(orderRef);

            const orderData = {
                orderId: newOrderRef.key,
                userId: currentUserId,
                items: cart,
                totalPrice: totalPrice,
                status: "confirmed",
                createdAt: new Date().toISOString()
            };

            await set(newOrderRef, orderData);

            console.log("✅ Bestilling lagret i Firebase:", orderData);
            clearCart();
            return true;

        } catch (error) {
            console.error("Feil ved lagring til Firebase:", error);
            alert("Kunne ikke lagre bestillingen. Prøv igjen.");
            return false;
        }

        if (success) {
            showToast("Bestillingen er bekreftet! 🎉", "success");   // ← Pen melding
            return true;
        }
    };

    return (
        <CartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice,
            confirmBooking,
            showToast
        }}>
            {children}
            {toast && (
                <div className={`toast toast-${toast.type}`}>
                    {toast.message}
                </div>
            )}
        </CartContext.Provider>
    );
}

export const useCart = () => useContext(CartContext);