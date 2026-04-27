/**
 * CartDrawer.jsx
 * 
 * Slide-in cart panel from the right side of the screen.
 * Shows success toast when booking is confirmed.
 * 
 * @author Fredrik Fordelsen - Added success toast on confirm booking
 * @version 1.4
 */

import { useCart } from '../context/CartContext';
import './styles/CartDrawer.css';

function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, totalPrice, confirmBooking, showToast } = useCart();

    const handleConfirm = async () => {
        if (cart.length === 0) return;

        const success = await confirmBooking();

        if (success) {
            showToast("Your reservation has been confirmed! Thank you for choosing Blueberry Hotels!", "success");
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {isOpen && <div className="cart-overlay" onClick={onClose}></div>}

            <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
                <div className="cart-header">
                    <h2>Your Cart</h2>
                    <button className="close-drawer-btn" onClick={onClose}>✕</button>
                </div>

                <div className="cart-content">
                    {cart.length === 0 ? (
                        <p className="empty-cart">Your cart is empty.</p>
                    ) : (
                        <ul className="cart-items">
                            {cart.map(item => (
                                <li key={item.cartId} className="cart-item">
                                    <div className="cart-item-info">
                                        <strong>{item.name}</strong>
                                        {item.hotelName && <p className="item-hotel">at {item.hotelName}</p>}
                                        <p>{item.type}</p>
                                        {item.date && <small>{item.date}</small>}
                                    </div>
                                    <div className="cart-item-price">
                                        {item.price} kr
                                        <button 
                                            className="remove-btn"
                                            onClick={() => removeFromCart(item.cartId)}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="cart-footer">
                        <div className="cart-total">
                            <span>Total:</span>
                            <strong>{totalPrice} kr</strong>
                        </div>
                        <button 
                            className="confirm-order-btn" 
                            onClick={handleConfirm}
                        >
                            Confirm Booking
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default CartDrawer;