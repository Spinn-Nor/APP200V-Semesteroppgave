import {useCart} from '../context/CartContext'
import './styles/CartDrawer.css';

/**
 * 
 * Slide-in cart panel (drawer) from the right side of the screen.
 * Displays all items in the cart, allows removal of items, shows total price,
 * and confirms the full booking by calling confirmBooking() from CartContext.
 * 
 * @author Fredrik Fordelsen - Full implementation of slide-in cart drawer.
 */

function CartDrawer({isOpen, onClose}) {
    // Get cart data and functions from our global CartContext
    const [cart, removeFromCart, clearCart, totalPrice] = useCart();

    /**
     * Handles the final confirmation of the booking.
     * Calls confirmBooking() from CartContext which saves the order to Firebase.
     * If successful, the cart is cleared and the drawer is closed.
     */

    const handleConfirm = async () => {
        if (cart.length === 0) return;

        const success = await confirmBooking();

        if (success) {
            onClose(); // Close the drawer after successful booking
        }
    };

    // Do not render anything if the drawer is closed
    if (!isOpen) return null;

    return (
        <>
            {/* Dark overlay behind the drawer - clicking it closes the cart */}
            {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

            {/* The actual sliding drawer */}
            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>

                {/* Header with title and close button */}
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-drawer-btn" onClick={onClose}>✕</button>
                </div>

                {/* Main content area - shows cart items or empty message */}
                <div className="cart-content">
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ): (
                        <ul className="cart-items">
                            {cart.map(item => (
                                <li key={item.cartId} className="cart-item">
                                    <div className="cart-item-info">
                                        <strong>{item.name}</strong>
                                        <p>{item.type}</p>
                                        {item.date && <small>{item.date}</small>}
                                    </div>
                                    <div className="cart-item-price">
                                        {item.price} kr
                                        <button 
                                        className="remove btn"
                                        onClick={removeFromCart(item.cartId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Footer with total price and confirm button - only shown if cart has items */}
                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <strong>{totalPrice} kr</strong>
                        </div>
                        <button className="confirm-order-btn" onClick={handleConfirm}>
                            Confirm Booking
                        </button>
                    </div>
                )}
            </div>
        </>
    )
}

export default CartDrawer;