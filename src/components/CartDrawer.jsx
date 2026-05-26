/**
 * CartDrawer.jsx
 *
 * Slide-in cart panel from the right side of the screen.
 *
 * @author Fredrik Fordelsen
 * @version 1.6
 */

import { useCart } from "../context/CartContext";
import { useScrollLock } from "../hooks/useScrollLock"; // ← Lagt til
import "./styles/CartDrawer.css";

function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, totalPrice, confirmBooking, showToast } =
    useCart();

  // Scroll Lock når carten er åpen
  useScrollLock(isOpen);

  const handleConfirm = async () => {
    if (cart.length === 0) return;

    const success = await confirmBooking();

    if (success) {
      showToast(
        "Your reservation has been confirmed! Thank you for choosing Blueberry Hotels!",
        "success",
      );
      onClose();
    }
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? "open" : ""}`}
        onClick={onClose}
      ></div>

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? "open" : ""}`}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button className="close-drawer-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        <div className="cart-content">
          {cart.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            <ul className="cart-items">
              {cart.map((item) => (
                // CartDrawer.jsx - Oppdatert
                <li key={item.cartId} className="cart-item">
                  <div className="cart-item-info">
                    <strong>{item.name}</strong>
                    {item.hotelName && (
                      <p className="item-hotel">at {item.hotelName}</p>
                    )}
                    <p>
                      {item.date} • {item.nights} nights
                    </p>

                    {/* Vis amenities */}
                    {item.amenities && item.amenities.length > 0 && (
                      <div className="cart-item-amenities">
                        <small>Additional:</small>
                        <ul>
                          {item.amenities.map((amenity, index) => (
                            <li key={index}>
                              {amenity.label} (+{amenity.price} kr)
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
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
            <button className="confirm-order-btn" onClick={handleConfirm}>
              Confirm Booking
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default CartDrawer;
