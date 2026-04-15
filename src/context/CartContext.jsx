import {createContext, useContext, useState} from 'react'


/**
 * CartContext - Provides global cart state and functions to the entire application.
 * This follows the React Context API pattern for sharing state without prop drilling.
 * * @author Fredrik Fordelsen - Created CartContext, addToCart, removeFromCart and totalPrice logic
 */
const cartContext = createContext();

/**
 * CartProvider - Wraps the application and makes cart data available to all components.
 * This is the "Provider" part of the Context pattern.
 */
export function CartProvider({children}) {
    const [cart, setCart] = useState(); // Array of items currently in the cart

    /**
     * Adds a new item (room, spa treatment, conference room, etc.) to the cart.
     * Each item gets a unique cartId for easy removal later.
     */

    const addToCart = (item) => {
        const newItem = {
            ...item,
            cartId: Date.now() // Unique identifier for this cart entry
        };
        setCart(prev => [...prev, newItem]);
    };

    /**
     * Removes a specific item from the cart using its cartId
     */

    const removeFromCart = (cartId) => {
        setCart(prev => prev.filter(item => item.cartId !== cartId));
    };

    /**
     * Clears entire cart (used after successful booking)
     */

    const clearCart = () => setCart([]);

    /**
     * Calculates the total price of all items currently in the cart
     */

    const totalPrice = cart.reduce((sum, item) => sum + (item.price || 0), 0);

    return (
        <cartContext.Provider value={{
            cart,
            addToCart,
            removeFromCart,
            clearCart,
            totalPrice
        }}>
            {children}
        </cartContext.Provider>
    );
}

/**
 * Custom hook to easily access cart data and functions from any component.
 */
