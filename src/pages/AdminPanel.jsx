/**
 * AdminPanel.jsx
 *
 * Main admin dashboard with full CRUD for Hotels + details view with tabs.
 *
 * @author Fredrik Fordelsen
 * @version 1.7
 */

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHotels } from "../hooks/useHotels";
import { db } from "../firebase/config";
import { ref, set, remove, push } from "firebase/database";
import { useCart } from "../context/CartContext";
import "./AdminPanel.css";

function AdminPanel() {
  const { currentUser, logout } = useAuth();
  const { hotels, loading } = useHotels();
  const { showToast } = useCart();

  const [activeTab, setActiveTab] = useState("hotels");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [detailTab, setDetailTab] = useState("general");

  // Add New Hotel Modal
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    city: "",
    address: "",
    rating: "",
    imageUrl: "",
    hasSpa: false,
    hasEvents: false,
  });

  // General Info
  const [generalForm, setGeneralForm] = useState({});

  // Room Modal
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });

  // ==================== HOTEL FUNCTIONS ====================

  const openHotelModal = () => {
    setFormData({
      name: "",
      city: "",
      address: "",
      rating: "",
      imageUrl: "",
      hasSpa: false,
      hasEvents: false,
    });
    setShowModal(true);
  };

  const saveHotel = async (e) => {
    e.preventDefault();
    try {
      const newHotelRef = push(ref(db, "hotels"));
      await set(newHotelRef, formData);
      showToast("New hotel added successfully!", "success");
      setShowModal(false);
    } catch (error) {
      console.error(error);
      showToast("Could not add hotel.", "error");
    }
  };

  const openHotelDetails = (hotel) => {
    setSelectedHotel(hotel);
    setGeneralForm({ ...hotel });
    setDetailTab("general");
    setActiveTab("details");
  };

  const closeDetails = () => {
    setSelectedHotel(null);
    setActiveTab("hotels");
  };

  const saveGeneralInfo = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;
    try {
      await set(ref(db, `hotels/${selectedHotel.id}`), generalForm);
      showToast("Hotel information updated successfully!", "success");
    } catch (error) {
      showToast("Could not update hotel information.", "error");
    }
  };

  // ==================== ROOM FUNCTIONS ====================

  const openRoomModal = (roomId = null, room = null) => {
    if (room) {
      setEditingRoom(roomId);
      setRoomForm({ ...room });
    } else {
      setEditingRoom(null);
      setRoomForm({ name: "", price: "", capacity: "", imageUrl: "" });
    }
    setShowRoomModal(true);
  };

  const saveRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotel) return;

    try {
      if (editingRoom) {
        await set(
          ref(db, `hotels/${selectedHotel.id}/rooms/${editingRoom}`),
          roomForm,
        );
      } else {
        const newRoomRef = push(ref(db, `hotels/${selectedHotel.id}/rooms`));
        await set(newRoomRef, roomForm);
      }
      showToast("Room type saved successfully!", "success");
      setShowRoomModal(false);
    } catch (error) {
      showToast("Could not save room type.", "error");
    }
  };

  const deleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room type?")) return;
    try {
      await remove(ref(db, `hotels/${selectedHotel.id}/rooms/${roomId}`));
      showToast("Room type deleted.", "success");
    } catch (error) {
      showToast("Could not delete room type.", "error");
    }
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Blueberry Admin</h2>
        </div>

        <div className="admin-menu">
          <button
            className={`menu-item ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("hotels");
              setSelectedHotel(null);
            }}
          >
            🏨 Manage Hotels
          </button>
        </div>

        <div className="admin-user">
          <p>{currentUser?.displayName || currentUser?.email}</p>
          <button onClick={logout} className="logout-btn">
            Logout
          </button>
        </div>
      </div>
      {/* Main Content */}
      <div className="admin-content">
        {/* Hotels List */}
        {activeTab === "hotels" && (
          <>
            <div className="admin-header">
              <h1>Manage Hotels</h1>
              <button className="add-btn" onClick={openHotelModal}>
                + Add New Hotel
              </button>
            </div>

            {loading ? (
              <p>Loading hotels...</p>
            ) : (
              <div className="hotels-list">
                {hotels.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="hotel-admin-card"
                    onClick={() => openHotelDetails(hotel)}
                  >
                    <h3>{hotel.name}</h3>
                    <p>
                      {hotel.city} • {hotel.address}
                    </p>
                    <p>Rating: {hotel.rating} ★</p>
                    <div className="actions">
                      <button className="view-btn">View Details</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Hotel Details View */}
        {activeTab === "details" && selectedHotel && (
          <div className="hotel-details-view">
            <div className="details-header">
              <h1>{selectedHotel.name}</h1>
              <button className="close-details-btn" onClick={closeDetails}>
                ← Back to Hotels
              </button>
            </div>
            // Tabs on detail page
            <div className="details-tabs">
              <button
                className={`detail-tab ${detailTab === "general" ? "active" : ""}`}
                onClick={() => setDetailTab("general")}
              >
                General Info
              </button>
              <button
                className={`detail-tab ${detailTab === "rooms" ? "active" : ""}`}
                onClick={() => setDetailTab("rooms")}
              >
                Rooms
              </button>
              <button
                className={`detail-tab ${detailTab === "spa" ? "active" : ""}`}
                onClick={() => setDetailTab("spa")}
              >
                Spa
              </button>
              <button
                className={`detail-tab ${detailTab === "events" ? "active" : ""}`}
                onClick={() => setDetailTab("events")}
              >
                Events
              </button>
            </div>
            // General info tab
            <div className="details-content">
              {detailTab === "general" && (
                <form onSubmit={saveGeneralInfo} className="details-form">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Hotel Name</label>
                      <input
                        type="text"
                        value={generalForm.name || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>City</label>
                      <input
                        type="text"
                        value={generalForm.city || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            city: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Full Address</label>
                      <input
                        type="text"
                        value={generalForm.address || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            address: e.target.value,
                          })
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Rating</label>
                      <input
                        type="text"
                        value={generalForm.rating || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            rating: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="form-group full-width">
                      <label>Image URL</label>
                      <input
                        type="text"
                        value={generalForm.imageUrl || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            imageUrl: e.target.value,
                          })
                        }
                      />
                    </div>

                    <div className="form-group toggle-group">
                      <label>Has Spa</label>
                      <input
                        type="checkbox"
                        checked={generalForm.hasSpa || false}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            hasSpa: e.target.checked,
                          })
                        }
                      />
                    </div>
                    <div className="form-group toggle-group">
                      <label>Has Events</label>
                      <input
                        type="checkbox"
                        checked={generalForm.hasEvents || false}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            hasEvents: e.target.checked,
                          })
                        }
                      />
                    </div>
                  </div>

                  <div className="modal-actions">
                    <button type="button" onClick={closeDetails}>
                      Cancel
                    </button>
                    <button type="submit">Save Changes</button>
                  </div>
                </form>
              )}

              {detailTab === "rooms" && (
                <div>
                  <div className="tab-header">
                    <h2>Rooms at {selectedHotel.name}</h2>
                    <button className="add-btn" onClick={() => openRoomModal()}>
                      + Add Room Type
                    </button>
                  </div>

                  <div className="rooms-list">
                    {selectedHotel.rooms ? (
                      Object.keys(selectedHotel.rooms).map((roomId) => {
                        const room = selectedHotel.rooms[roomId];
                        return (
                          <div key={roomId} className="room-card">
                            <div className="room-info">
                              <h3>{room.name}</h3>
                              <p>Max {room.capacity} guests</p>
                              <p>
                                <strong>{room.price} kr</strong> per night
                              </p>
                            </div>
                            <div className="room-actions">
                              <button
                                onClick={() => openRoomModal(roomId, room)}
                              >
                                Edit
                              </button>
                              <button
                                className="delete-btn"
                                onClick={() => deleteRoom(roomId)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p>No rooms added yet for this hotel.</p>
                    )}
                  </div>
                </div>
              )}

              {detailTab === "spa" && <p>Spa management coming soon...</p>}
              {detailTab === "events" && (
                <p>Events management coming soon...</p>
              )}
            </div>
          </div>
        )}
      </div>
      // Modal for adding new hotels
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Hotel</h2>
            <form onSubmit={saveHotel}>
              <input
                type="text"
                placeholder="Hotel Name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="City"
                value={formData.city}
                onChange={(e) =>
                  setFormData({ ...formData, city: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Rating (e.g. 4.5)"
                value={formData.rating}
                onChange={(e) =>
                  setFormData({ ...formData, rating: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) =>
                  setFormData({ ...formData, imageUrl: e.target.value })
                }
              />

              <div className="form-group toggle-group">
                <label>Has Spa</label>
                <input
                  type="checkbox"
                  checked={formData.hasSpa}
                  onChange={(e) =>
                    setFormData({ ...formData, hasSpa: e.target.checked })
                  }
                />
              </div>
              <div className="form-group toggle-group">
                <label>Has Events</label>
                <input
                  type="checkbox"
                  checked={formData.hasEvents}
                  onChange={(e) =>
                    setFormData({ ...formData, hasEvents: e.target.checked })
                  }
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit">Add Hotel</button>
              </div>
            </form>
          </div>
        </div>
      )}
      // Modal for adding/editing rooms
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingRoom ? "Edit Room Type" : "Add New Room Type"}</h2>
            <form onSubmit={saveRoom}>
              <input
                type="text"
                placeholder="Room Type (e.g. Double Room, Suite)"
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price per night (kr)"
                value={roomForm.price}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, price: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Max guests"
                value={roomForm.capacity}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, capacity: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Image URL (optional)"
                value={roomForm.imageUrl}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, imageUrl: e.target.value })
                }
              />

              <div className="modal-actions">
                <button type="button" onClick={() => setShowRoomModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Room Type</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
