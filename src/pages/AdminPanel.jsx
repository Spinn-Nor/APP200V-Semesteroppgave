/**
 * AdminPanel.jsx
 *
 * Main admin dashboard with full CRUD for Hotels + details view with tabs.
 *
 * @author Fredrik Fordelsen
 * @version 2.0
 */

import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useHotels } from "../hooks/useHotels";
import { db } from "../firebase/config";
import { ref, set, remove, push, get } from "firebase/database";
import { useCart } from "../context/CartContext";
import { usePageTitle } from "../hooks/usePageTitle";
import { useScrollLock } from "../hooks/useScrollLock";
import "../styles/AdminPanel.css";

function AdminPanel() {
  const { currentUser, logout } = useAuth();
  const { hotels, loading } = useHotels();
  const { showToast } = useCart();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hotelToDelete, setHotelToDelete] = useState(null);

  const [activeTab, setActiveTab] = useState("hotels");
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [detailTab, setDetailTab] = useState("general");

  // Add New Hotel Modal
  const [showHotelModal, setShowHotelModal] = useState(false);
  const [hotelForm, setHotelForm] = useState({
    id: "",
    name: "",
    city: "",
    address: "",
    rating: "",
    description: "",
    hasSpa: false,
    hasEvents: false,
    images: [""],
    amenities: [{ id: "", label: "", price: "", icon: "" }],
  });

  usePageTitle("Admin Panel");

  // General Info
  const [generalForm, setGeneralForm] = useState({});

  // ==================== USERS ====================
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Add User Modal
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [addUserForm, setAddUserForm] = useState({
    email: "",
    displayName: "",
    role: "user",
    password: "",
  });

  // ==================== ADD NEW USER ====================
  const openAddUserModal = () => {
    setAddUserForm({ email: "", displayName: "", role: "user", password: "" });
    setShowAddUserModal(true);
  };

  const saveNewUser = async (e) => {
    e.preventDefault();
    if (
      !addUserForm.email ||
      !addUserForm.displayName ||
      !addUserForm.password
    ) {
      showToast("Email, name and password are required", "error");
      return;
    }

    try {
      // Saving to db
      const newUserRef = push(ref(db, "users"));
      await set(newUserRef, {
        email: addUserForm.email,
        displayName: addUserForm.displayName,
        role: addUserForm.role,
        createdAt: new Date().toISOString(),
        uid: newUserRef.key, // midlertidig ID
      });

      showToast("New user added successfully!", "success");
      setShowAddUserModal(false);
      fetchUsers(); // update list
    } catch (error) {
      console.error(error);
      showToast("Failed to add user", "error");
    }
  };

  useEffect(() => {
    if (activeTab === "users") {
      fetchUsers();
    }
  }, [activeTab]);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const usersRef = ref(db, "users");
      const snapshot = await get(usersRef);

      if (snapshot.exists()) {
        const usersData = snapshot.val();
        const usersArray = Object.keys(usersData).map((key) => ({
          id: key,
          ...usersData[key],
        }));
        setUsers(usersArray);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error("Failed to fetch users:", error);
      showToast("Could not fetch users", "error");
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const ordersRef = ref(db, "orders");
      const snapshot = await get(ordersRef);

      if (!snapshot.exists()) {
        setBookings([]);
        return;
      }

      const allOrders = snapshot.val();
      const bookingList = [];

      Object.entries(allOrders).forEach(([userId, userOrders]) => {
        Object.entries(userOrders || {}).forEach(([orderId, order]) => {
          if (!order?.items?.length) return;

          order.items.forEach((item, index) => {
            bookingList.push({
              id: `${orderId}-${index}`,
              orderId: order.orderId || orderId,
              userId: userId,

              // Robust customer info
              customerName:
                order.customerName ||
                order.userName ||
                order.displayName ||
                "Unknown Customer",
              customerEmail: order.customerEmail || order.email || "—",

              // Item details
              type: item.type || item.category || "Room",
              hotelName: item.hotelName || "Unknown Hotel",
              roomName: item.name || item.treatmentName || "Unknown Room",

              // Date handling - important for past bookings
              checkIn: item.checkIn || item.date,
              checkOut: item.checkOut,
              date: item.date || item.checkIn,

              nights: item.nights,
              totalPrice:
                Number(item.price) ||
                Number(item.totalPrice) ||
                Number(order.totalPrice) ||
                0,
              pricePerNight: item.pricePerNight || item.price,

              status: order.status || "confirmed",
              createdAt:
                order.createdAt || order.date || new Date().toISOString(),

              ...item, // spread remaining data
            });
          });
        });
      });

      // Sort by newest first
      bookingList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setBookings(bookingList);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      showToast("Could not load bookings", "error");
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    if (activeTab === "bookings") {
      fetchAllBookings();
    }
  }, [activeTab]);

  // Update booking status
  const updateBookingStatus = async (booking, newStatus) => {
    if (!booking.userId || !booking.orderId) {
      showToast("Cannot update: missing order information", "error");
      return;
    }

    try {
      await set(
        ref(db, `orders/${booking.userId}/${booking.orderId}/status`),
        newStatus,
      );

      showToast(`Booking status updated to ${newStatus}`, "success");
      fetchAllBookings(); // refresh list
    } catch (error) {
      console.error(error);
      showToast("Failed to update status", "error");
    }
  };

  const saveBookingChanges = async (updatedBooking) => {
    if (!updatedBooking?.userId || !updatedBooking?.orderId) {
      showToast("Cannot save: missing booking information", "error");
      return;
    }

    try {
      const orderRef = ref(
        db,
        `orders/${updatedBooking.userId}/${updatedBooking.orderId}`,
      );
      const snapshot = await get(orderRef);

      if (!snapshot.exists()) {
        showToast("Order not found", "error");
        return;
      }

      const originalOrder = snapshot.val();

      // Calculate new nights
      let nights = 0;
      if (updatedBooking.checkIn && updatedBooking.checkOut) {
        const start = new Date(updatedBooking.checkIn);
        const end = new Date(updatedBooking.checkOut);
        nights = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      }

      const pricePerNight =
        Number(updatedBooking.pricePerNight) ||
        Number(updatedBooking.totalPrice) / (updatedBooking.nights || 1) ||
        0;

      const newTotalPrice =
        nights > 0
          ? Math.round(pricePerNight * nights)
          : Number(updatedBooking.totalPrice);

      // Oppdater det riktige itemet
      const updatedItems = originalOrder.items.map((item, index) => {
        // Bedre matching - bruk id eller navn + dato
        if (
          item.name === updatedBooking.name ||
          item.roomName === updatedBooking.roomName ||
          `${originalOrder.id || "order"}-${index}` === updatedBooking.id
        ) {
          return {
            ...item,
            checkIn: updatedBooking.checkIn,
            checkOut: updatedBooking.checkOut,
            nights: nights,
            price: newTotalPrice,
            totalPrice: newTotalPrice,
          };
        }
        return item;
      });

      const updatedOrder = {
        ...originalOrder,
        items: updatedItems,
        status: updatedBooking.status || originalOrder.status,
        updatedAt: new Date().toISOString(),
      };

      await set(orderRef, updatedOrder);

      showToast("Booking updated successfully!", "success");
      setShowBookingDetail(false);
      fetchAllBookings();
    } catch (error) {
      console.error("Save error:", error);
      showToast("Failed to save booking changes", "error");
    }
  };

  // Delete entire booking
  const handleDeleteBooking = async (booking) => {
    if (
      !window.confirm(
        `Delete booking for ${booking.customerName}? This cannot be undone.`,
      )
    ) {
      return;
    }

    try {
      await remove(ref(db, `orders/${booking.userId}/${booking.orderId}`));

      showToast("Booking deleted successfully", "success");
      console.log("🔥 handleDeleteBooking ble kalt med:", booking.orderId);
      setShowBookingDetail(false);
      fetchAllBookings();
    } catch (error) {
      console.error(error);
      showToast("Failed to delete booking", "error");
    }
  };

  // ==================== USER EDIT FUNCTIONS ====================
  const [showEditUserModal, setShowEditUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserForm, setEditUserForm] = useState({
    displayName: "",
    role: "customer",
  });

  const openEditUserModal = (user) => {
    setEditingUser(user);
    setEditUserForm({
      displayName: user.displayName || "",
      role: user.role || "user",
    });
    setShowEditUserModal(true);
  };

  const saveUserChanges = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      await set(ref(db, `users/${editingUser.id}`), {
        ...editingUser,
        displayName: editUserForm.displayName,
        role: editUserForm.role,
        updatedAt: new Date().toISOString(),
      });

      showToast("User updated successfully!", "success");
      setShowEditUserModal(false);

      // Refresh users list
      fetchUsers();
    } catch (error) {
      console.error(error);
      showToast("Failed to update user", "error");
    }
  };

  // ==================== DELETE USER ====================
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await remove(ref(db, `users/${userId}`));
      showToast("User deleted successfully!", "success");
      fetchUsers(); // refresh list
    } catch (error) {
      console.error(error);
      showToast("Failed to delete user", "error");
    }
  };

  // Room Modal
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoomId, setEditingRoomId] = useState(null);
  const [roomForm, setRoomForm] = useState({
    name: "",
    price: "",
    capacity: "",
    imageUrl: "",
  });

  // ==================== DASHBOARD STATS ====================
  const totalHotels = hotels.length;
  const totalRooms = hotels.reduce((sum, hotel) => {
    return sum + (hotel.rooms ? Object.keys(hotel.rooms).length : 0);
  }, 0);

  const [totalBookings, setTotalBookings] = useState(0);
  const [monthlyRevenue, setMonthlyRevenue] = useState(0);
  const [recentBookings, setRecentBookings] = useState([]);

  // ==================== BOOKINGS MANAGEMENT ====================
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showBookingDetail, setShowBookingDetail] = useState(false);
  const [bookingFilter, setBookingFilter] = useState("all"); // all, room, spa, cancelled
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const ordersRef = ref(db, "orders");
        const snapshot = await get(ordersRef);

        if (!snapshot.exists()) {
          setTotalBookings(0);
          setMonthlyRevenue(0);
          setRecentBookings([]);
          return;
        }

        const allOrders = snapshot.val();
        let bookingsCount = 0;
        let revenue = 0;
        const bookingsList = [];
        const debugPrices = []; // ← Debug

        Object.values(allOrders).forEach((userOrders) => {
          Object.values(userOrders || {}).forEach((order) => {
            if (order.items) {
              order.items.forEach((item) => {
                if (item.type === "Room" || item.category === "accommodation") {
                  bookingsCount++;

                  const rawPrice = item.price;
                  const price = Number(item.price) || 0;
                  const totalPrice = Number(item.totalPrice) || price;

                  revenue += totalPrice;

                  // Debug
                  debugPrices.push({
                    hotel: item.hotelName,
                    room: item.name,
                    rawPrice: rawPrice,
                    usedPrice: totalPrice,
                  });

                  bookingsList.push({
                    hotelName: item.hotelName || "Unknown Hotel",
                    roomName: item.name || "Room",
                    checkIn: item.checkIn,
                    checkOut: item.checkOut,
                    totalPrice: totalPrice,
                  });
                }
              });
            }
          });
        });

        console.log("🔍 Debug Prices:", debugPrices); // Sjekk i konsollen
        console.log("Total Revenue calculated:", revenue);

        setTotalBookings(bookingsCount);
        setMonthlyRevenue(revenue);
        setRecentBookings(bookingsList.slice(0, 5));
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      }
    };

    fetchBookings();
  }, []);

  // ==================== HOTEL FUNCTIONS ====================

  const openHotelModal = () => {
    setHotelForm({
      name: "",
      city: "",
      address: "",
      rating: "",
      imageUrl: "",
      hasSpa: false,
      hasEvents: false,
      images: [],
      amenities: [],
    });
    setShowHotelModal(true);
  };

  const openDeleteModal = (hotel) => {
    setHotelToDelete(hotel);
    setShowDeleteModal(true);
  };

  const saveHotel = async (e) => {
    e.preventDefault();

    // Make sure ID and name are defined
    if (!hotelForm.id || !hotelForm.name) {
      showToast("Hotel ID and name are required", "error");
      return;
    }

    try {
      // Cleaning amenities field to make sure that price gets passed as a number
      const cleanedAmenities = (hotelForm.amenities || [])
        .filter((a) => a.label && a.label.trim() !== "")
        .map((amenity) => ({
          ...amenity,
          id: amenity.id || amenity.label.toLowerCase().replace(/\s+/g, "_"),
          price: Number(amenity.price) || 0, // Specifially defines price data type to avoid error
          label: amenity.label.trim(),
        }));

      const hotelData = {
        id: hotelForm.id,
        name: hotelForm.name,
        city: hotelForm.city,
        address: hotelForm.address,
        rating: Number(hotelForm.rating),
        description: hotelForm.description,
        hasSpa: hotelForm.hasSpa,
        hasEvents: hotelForm.hasEvents,
        images: hotelForm.images || [],
        amenities: cleanedAmenities,
        rooms: {},
      };

      // Pushing form data to db
      await set(ref(db, `hotels/${hotelForm.id}`), hotelData);

      // Show success message
      showToast(`Hotel ${hotelForm.name} added successfully!`, "success");
      setShowHotelModal(false);
    } catch (error) {
      // Show error message
      console.error(error);
      showToast("Could not add hotel", "error");
    }
  };

  const confirmDeleteHotel = async () => {
    if (!hotelToDelete) return;

    const hotelName = hotelToDelete.name;

    try {
      await remove(ref(db, `hotels/${hotelToDelete.id}`));

      setShowDeleteModal(false);
      setHotelToDelete(null);
      setSelectedHotel(null);
      setActiveTab("hotels");

      // Toast after state change
      setTimeout(() => {
        showToast(`Hotel "${hotelName}" has been deleted`, "success");
      }, 100);
    } catch (error) {
      console.error(error);
      showToast("Unable to delete hotel", "error");
    }
  };

  const openHotelDetails = (hotel) => {
    setSelectedHotel(hotel);

    // Making sure images and arrays are always arrays
    setGeneralForm({
      ...hotel,
      images: Array.isArray(hotel.images) ? [...hotel.images] : [],
      amenities: Array.isArray(hotel.amenities)
        ? hotel.amenities.map((a) => ({ ...a }))
        : [],
    });

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
      // Clean data before saving
      const cleanedImages = (generalForm.images || []).filter(
        (url) => url && url.trim() !== "",
      );

      const cleanedAmenities = (generalForm.amenities || [])
        .filter((a) => a.label && a.label.trim() !== "")
        .map((amenity) => ({
          ...amenity,
          id: amenity.id || amenity.label.toLowerCase().replace(/\s+/g, "_"),
          price: Number(amenity.price) || 0,
          label: amenity.label.trim(),
        }));

      const updatedHotel = {
        ...selectedHotel,
        ...generalForm,
        images: cleanedImages,
        amenities: cleanedAmenities,
        // Update timestamp
        updatedAt: new Date().toISOString(),
      };

      await set(ref(db, `hotels/${selectedHotel.id}`), updatedHotel);

      // Update local state
      setSelectedHotel(updatedHotel);

      showToast("Hotel information updated successfully!", "success");
    } catch (error) {
      console.error(error);
      showToast("Could not update hotel information.", "error");
    }
  };

  // ==================== ROOM FUNCTIONS ====================

  const openRoomModal = (roomId = null, room = null) => {
    if (room) {
      setEditingRoomId(roomId); // viktig!
      setRoomForm({
        name: room.name || "",
        price: room.price || "",
        capacity: room.capacity || "",
        imageUrl: room.imageUrl || "",
      });
    } else {
      setEditingRoomId(null);
      setRoomForm({ name: "", price: "", capacity: "", imageUrl: "" });
    }
    setShowRoomModal(true);
  };

  const saveRoom = async (e) => {
    e.preventDefault();
    if (!selectedHotel || !roomForm.name) return;

    try {
      let roomId;

      if (editingRoomId) {
        // Edit existing room
        roomId = editingRoomId;
      } else {
        // === Add new room ===
        const roomSlug = roomForm.name
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9\s-]/g, "")
          .replace(/\s+/g, "-");

        roomId = roomSlug || `room-${Date.now()}`;
      }

      const roomData = {
        name: roomForm.name,
        price: Number(roomForm.price) || 0,
        capacity: Number(roomForm.capacity) || 2,
        imageUrl: roomForm.imageUrl || "",
      };

      await set(
        ref(db, `hotels/${selectedHotel.id}/rooms/${roomId}`),
        roomData,
      );

      showToast(
        editingRoomId ? "Room updated successfully!" : "New room type added!",
        "success",
      );

      setShowRoomModal(false);
      setEditingRoomId(null); // reset editing state
    } catch (error) {
      console.error(error);
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

  // ==================== MESSAGES ====================
  const [messages, setMessages] = useState([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messageFilter, setMessageFilter] = useState("all"); // all, unread, read

  // Messages Modal
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  /**
   * Toggle message between read and unread
   */
  const toggleMessageStatus = async (messageId, currentStatus) => {
    try {
      const newStatus = currentStatus === "unread" ? "read" : "unread";

      await set(ref(db, `contacts/${messageId}/status`), newStatus);

      showToast(`Message marked as ${newStatus}`, "success");

      // Refresh messages
      fetchMessages();
    } catch (error) {
      console.error("Error updating message status:", error);
      showToast("Failed to update status", "error");
    }
  };

  /**
   * Open message in modal
   */
  const openMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);

    // Automatically mark as read when opened
    if (message.status === "unread") {
      set(ref(db, `contacts/${message.id}/status`), "read");
      // Update local state immediately for better UX
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === message.id ? { ...msg, status: "read" } : msg,
        ),
      );
    }
  };

  /**
   * Fetch all contact messages from Firebase
   */
  const fetchMessages = async () => {
    setLoadingMessages(true);
    try {
      const messagesRef = ref(db, "contacts");
      const snapshot = await get(messagesRef);

      if (snapshot.exists()) {
        const messagesData = snapshot.val();
        const messagesArray = Object.keys(messagesData).map((key) => ({
          id: key,
          ...messagesData[key],
        }));

        // Sort by newest first
        messagesArray.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
        );

        setMessages(messagesArray);
      } else {
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      showToast("Could not load messages", "error");
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    if (activeTab === "messages") {
      fetchMessages();
    }
  }, [activeTab]);

  // ==================== SPA TREATMENTS ====================
  const [allTreatments, setAllTreatments] = useState([]);
  const [selectedTreatments, setSelectedTreatments] = useState([]);
  const [loadingTreatments, setLoadingTreatments] = useState(false);

  // ==================== SPA TREATMENTS FUNCTIONS ====================
  const fetchTreatments = async (hotelId) => {
    if (!hotelId) return;

    setLoadingTreatments(true);
    try {
      // Hent alle treatments fra databasen
      const treatmentsRef = ref(db, "Spa/treatments");
      const snapshot = await get(treatmentsRef);

      let treatmentsList = [];
      if (snapshot.exists()) {
        treatmentsList = Object.entries(snapshot.val()).map(([key, data]) => ({
          key, // fallback
          id: data.id || key, // bruk id-feltet hvis det finnes
          ...data,
        }));
      }
      setAllTreatments(treatmentsList);

      // Hent hvilke treatments som er aktivert for dette hotellet
      const hotelTreatmentsRef = ref(db, `hotels/${hotelId}/spaTreatments`);
      const hotelSnapshot = await get(hotelTreatmentsRef);

      setSelectedTreatments(hotelSnapshot.exists() ? hotelSnapshot.val() : []);
    } catch (error) {
      console.error("Error fetching treatments:", error);
      showToast("Failed to load treatments", "error");
    } finally {
      setLoadingTreatments(false);
    }
  };

  const toggleTreatment = async (treatmentId) => {
    if (!selectedHotel) return;

    let newSelected = [...selectedTreatments];

    if (newSelected.includes(treatmentId)) {
      newSelected = newSelected.filter((id) => id !== treatmentId);
    } else {
      newSelected.push(treatmentId);
    }

    setSelectedTreatments(newSelected);

    try {
      await set(
        ref(db, `hotels/${selectedHotel.id}/spaTreatments`),
        newSelected,
      );
      showToast("Spa treatments updated successfully", "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to update treatments", "error");
    }
  };

  // Fetch treatments when spa tab is opened
  useEffect(() => {
    if (selectedHotel && detailTab === "spa") {
      fetchTreatments(selectedHotel.id);
    }
  }, [selectedHotel, detailTab]);

  // ==================== SCROLL LOCK FOR MODALS ====================
  const isAnyModalOpen =
    showHotelModal ||
    showDeleteModal ||
    showRoomModal ||
    showAddUserModal ||
    showEditUserModal ||
    showBookingDetail ||
    showMessageModal;

  useScrollLock(isAnyModalOpen);

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <div className="admin-logo">
          <h2>Blueberry Admin</h2>
        </div>

        <div className="admin-menu">
          <button
            className={`menu-item ${activeTab === "dashboard" ? "active" : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            📊 Dashboard
          </button>
          <button
            className={`menu-item ${activeTab === "hotels" ? "active" : ""}`}
            onClick={() => {
              setActiveTab("hotels");
              setSelectedHotel(null);
            }}
          >
            🏨 Hotels
          </button>
          <button
            className={`menu-item ${activeTab === "users" ? "active" : ""}`}
            onClick={() => setActiveTab("users")}
          >
            👥 Users
          </button>

          <button
            className={`menu-item ${activeTab === "bookings" ? "active" : ""}`}
            onClick={() => setActiveTab("bookings")}
          >
            📅 Bookings
          </button>

          <button
            className={`menu-item ${activeTab === "messages" ? "active" : ""}`}
            onClick={() => setActiveTab("messages")}
          >
            ✉️ Messages
          </button>

          <div className="admin-user">
            <p>{currentUser?.displayName || currentUser?.email}</p>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* ==================== DASHBOARD ==================== */}
        {activeTab === "dashboard" && (
          <div>
            <div className="dashboard-header">
              <h1>Dashboard</h1>
              <p>Welcome back, {currentUser?.displayName || "Admin"}</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Hotels</h3>
                <p className="stat-number">{totalHotels}</p>
              </div>
              <div className="stat-card">
                <h3>Total Rooms</h3>
                <p className="stat-number">{totalRooms}</p>
              </div>
              <div className="stat-card">
                <h3>Total Bookings</h3>
                <p className="stat-number">{totalBookings}</p>
              </div>
              <div className="stat-card">
                <h3>Revenue this month</h3>
                <p className="stat-number">
                  {monthlyRevenue.toLocaleString("no-NO")} kr
                </p>
              </div>
            </div>

            <div className="recent-activity">
              <h2>Recent Bookings</h2>
              {recentBookings.length > 0 ? (
                <div className="recent-list">
                  {recentBookings.map((booking, index) => (
                    <div key={index} className="recent-item">
                      <strong>{booking.hotelName}</strong> — {booking.roomName}
                      <br />
                      <small>
                        {booking.checkIn} → {booking.checkOut}
                        {booking.nights && ` • ${booking.nights} nights`}•{" "}
                        {booking.totalPrice.toLocaleString("no-NO")} kr
                      </small>
                    </div>
                  ))}
                </div>
              ) : (
                <p>Ingen bookinger registrert ennå.</p>
              )}
            </div>
          </div>
        )}

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

        {activeTab === "details" && selectedHotel && (
          <div className="hotel-details-view">
            <div className="details-header">
              <h1>{selectedHotel.name}</h1>

              <div className="details-header-actions">
                <button
                  className="delete-btn"
                  onClick={() => openDeleteModal(selectedHotel)}
                >
                  Delete Hotel
                </button>

                <button className="close-details-btn" onClick={closeDetails}>
                  ← Back to Hotels
                </button>
              </div>
            </div>

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
                style={{ display: selectedHotel.hasSpa ? "block" : "none" }}
              >
                Spa
              </button>
            </div>

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
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={generalForm.rating || ""}
                        onChange={(e) =>
                          setGeneralForm({
                            ...generalForm,
                            rating: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* ==================== IMAGES ==================== */}
                    <div className="form-group full-width">
                      <label>Images</label>
                      {generalForm.images?.map((url, index) => (
                        <div key={index} className="dynamic-row">
                          <input
                            type="text"
                            placeholder="https://example.com/image.jpg"
                            value={url}
                            onChange={(e) => {
                              const newImages = [...(generalForm.images || [])];
                              newImages[index] = e.target.value;
                              setGeneralForm({
                                ...generalForm,
                                images: newImages,
                              });
                            }}
                          />
                          <button
                            type="button"
                            className="remove-row"
                            onClick={() => {
                              if (generalForm.images.length > 1) {
                                setGeneralForm({
                                  ...generalForm,
                                  images: generalForm.images.filter(
                                    (_, i) => i !== index,
                                  ),
                                });
                              }
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="add-row-btn"
                        onClick={() =>
                          setGeneralForm({
                            ...generalForm,
                            images: [...(generalForm.images || []), ""],
                          })
                        }
                      >
                        + Add Image
                      </button>
                    </div>

                    {/* ==================== AMENITIES ==================== */}
                    <div className="form-group full-width">
                      <label>Amenities</label>
                      {generalForm.amenities?.map((amenity, index) => (
                        <div key={index} className="dynamic-row amenity-row">
                          <input
                            type="text"
                            placeholder="Label (e.g. Spa)"
                            value={amenity.label || ""}
                            onChange={(e) => {
                              const newAmenities = [
                                ...(generalForm.amenities || []),
                              ];
                              newAmenities[index].label = e.target.value;
                              setGeneralForm({
                                ...generalForm,
                                amenities: newAmenities,
                              });
                            }}
                          />
                          <input
                            type="number"
                            placeholder="Price"
                            value={amenity.price || ""}
                            onChange={(e) => {
                              const newAmenities = [
                                ...(generalForm.amenities || []),
                              ];
                              newAmenities[index].price = e.target.value;
                              setGeneralForm({
                                ...generalForm,
                                amenities: newAmenities,
                              });
                            }}
                          />
                          <input
                            type="text"
                            placeholder="Icon"
                            value={amenity.icon || "⭐"}
                            onChange={(e) => {
                              const newAmenities = [
                                ...(generalForm.amenities || []),
                              ];
                              newAmenities[index].icon = e.target.value;
                              setGeneralForm({
                                ...generalForm,
                                amenities: newAmenities,
                              });
                            }}
                          />
                          <button
                            type="button"
                            className="remove-row"
                            onClick={() => {
                              if (generalForm.amenities.length > 1) {
                                setGeneralForm({
                                  ...generalForm,
                                  amenities: generalForm.amenities.filter(
                                    (_, i) => i !== index,
                                  ),
                                });
                              }
                            }}
                          >
                            ✕
                          </button>
                        </div>
                      ))}

                      <button
                        type="button"
                        className="add-row-btn"
                        onClick={() =>
                          setGeneralForm({
                            ...generalForm,
                            amenities: [
                              ...(generalForm.amenities || []),
                              { id: "", label: "", price: "", icon: "⭐" },
                            ],
                          })
                        }
                      >
                        + Add Amenity
                      </button>
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
                    {selectedHotel.rooms &&
                    Object.keys(selectedHotel.rooms).length > 0 ? (
                      Object.entries(selectedHotel.rooms).map(
                        ([roomId, room]) => (
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
                        ),
                      )
                    ) : (
                      <p>No rooms added yet for this hotel.</p>
                    )}
                  </div>
                </div>
              )}

              {detailTab === "spa" && selectedHotel && (
                <div>
                  <div className="tab-header">
                    <h2>Spa Treatments at {selectedHotel.name}</h2>
                    <p className="tab-description">
                      Toggle which treatments are available at this hotel
                    </p>
                  </div>

                  <div className="spa-treatments-grid">
                    {loadingTreatments ? (
                      <p>Loading treatments...</p>
                    ) : allTreatments.length === 0 ? (
                      <p>No treatments found in the database.</p>
                    ) : (
                      allTreatments.map((treatment) => {
                        const treatmentId = treatment.id || treatment.key;
                        const isSelected =
                          selectedTreatments.includes(treatmentId);

                        return (
                          <div
                            key={treatmentId}
                            className={`treatment-option ${isSelected ? "selected" : ""}`}
                            onClick={() => toggleTreatment(treatmentId)}
                          >
                            <div className="treatment-info">
                              <h4>{treatment.name}</h4>
                              <p>
                                {treatment.Duration} • {treatment.Price} kr
                              </p>
                              {treatment.Description && (
                                <p className="treatment-description">
                                  {treatment.Description}
                                </p>
                              )}
                            </div>
                            <div className="treatment-toggle">
                              <span
                                className={`toggle-status ${isSelected ? "active" : ""}`}
                              >
                                {isSelected ? "✓ Enabled" : "Disabled"}
                              </span>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "users" && (
          <div>
            <div className="admin-header">
              <h1>Users ({users.length})</h1>
              <button className="add-btn" onClick={openAddUserModal}>
                + New User
              </button>
            </div>

            {loadingUsers ? (
              <p className="loading-text">Loading users...</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Registered</th>
                      <th style={{ textAlign: "center" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length > 0 ? (
                      users.map((user) => (
                        <tr key={user.id}>
                          <td>{user.displayName || "Unknown"}</td>
                          <td>{user.email}</td>
                          <td>
                            <span
                              className={`role-badge ${user.role === "admin" ? "admin" : "user"}`}
                            >
                              {user.role === "admin" ? "Administrator" : "User"}
                            </span>
                          </td>
                          <td>
                            {user.createdAt
                              ? new Date(user.createdAt).toLocaleDateString(
                                  "no-NO",
                                )
                              : "—"}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button
                              className="action-btn edit-btn"
                              onClick={() => openEditUserModal(user)}
                            >
                              Edit
                            </button>
                            <button
                              className="action-btn delete-btn"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="no-data">
                          No users registered yet.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== BOOKINGS TAB ==================== */}
        {activeTab === "bookings" && (
          <div>
            <div className="admin-header">
              <h1>All Bookings ({bookings.length})</h1>

              <div className="booking-filters">
                <input
                  type="text"
                  placeholder="Search customer or hotel..."
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="search-input"
                />
                <select
                  className="booking-filter"
                  value={bookingFilter}
                  onChange={(e) => setBookingFilter(e.target.value)}
                >
                  <option value="all">All Bookings</option>
                  <option value="room">Rooms Only</option>
                  <option value="spa">Spa Only</option>
                  <option value="event">Event Only</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {loadingBookings ? (
              <p className="loading-text">Loading bookings...</p>
            ) : bookings.length === 0 ? (
              <p>No bookings found.</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table bookings-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Customer</th>
                      <th>Email</th>
                      <th>Type</th>
                      <th>Hotel / Treatment</th>
                      <th>Dates</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter((b) => {
                        const search = searchTerm.toLowerCase();
                        const matchesSearch =
                          b.customerName?.toLowerCase().includes(search) ||
                          b.hotelName?.toLowerCase().includes(search) ||
                          b.customerEmail?.toLowerCase().includes(search) ||
                          b.roomName?.toLowerCase().includes(search);

                        // Type filters
                        if (bookingFilter === "room")
                          return (
                            (b.type === "Room" ||
                              b.category === "accommodation") &&
                            matchesSearch
                          );

                        if (bookingFilter === "spa")
                          return (
                            (b.type === "Spa" || b.category === "spa") &&
                            matchesSearch
                          );

                        if (bookingFilter === "event")
                          return (
                            (b.type === "Event" || b.category === "event") &&
                            matchesSearch
                          );

                        // Status filters
                        if (bookingFilter === "confirmed")
                          return b.status === "confirmed" && matchesSearch;

                        if (bookingFilter === "completed")
                          return b.status === "completed" && matchesSearch;

                        if (bookingFilter === "cancelled")
                          return b.status === "cancelled" && matchesSearch;

                        // Default: show all that match search
                        return matchesSearch;
                      })
                      .map((booking) => (
                        <tr key={booking.id}>
                          <td>
                            {new Date(booking.createdAt).toLocaleDateString(
                              "no-NO",
                            )}
                          </td>
                          <td>{booking.customerName}</td>
                          <td>{booking.customerEmail}</td>
                          <td>
                            <span
                              className={`type-badge ${booking.type?.toLowerCase() || "room"}`}
                            >
                              {booking.type || "Room"}
                            </span>
                          </td>
                          <td>{booking.hotelName || booking.roomName}</td>
                          <td>
                            {booking.checkIn} — {booking.checkOut}
                          </td>
                          <td>
                            <strong>
                              {booking.totalPrice.toLocaleString("no-NO")} kr
                            </strong>
                          </td>
                          <td>
                            <span
                              className={`status-badge ${booking.status || "confirmed"}`}
                            >
                              {booking.status || "confirmed"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn view-btn"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setShowBookingDetail(true);
                              }}
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ==================== MESSAGES TAB ==================== */}
        {activeTab === "messages" && (
          <div>
            <div className="admin-header">
              <h1>Messages ({messages.length})</h1>

              <div className="booking-filters">
                <select
                  className="booking-filter"
                  value={messageFilter}
                  onChange={(e) => setMessageFilter(e.target.value)}
                >
                  <option value="all">All Messages</option>
                  <option value="unread">Unread</option>
                  <option value="read">Read</option>
                </select>
              </div>
            </div>

            {loadingMessages ? (
              <p className="loading-text">Loading messages...</p>
            ) : messages.length === 0 ? (
              <p>No messages received yet.</p>
            ) : (
              <div className="admin-table-container">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Subject</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages
                      .filter((msg) => {
                        if (messageFilter === "unread")
                          return msg.status === "unread";
                        if (messageFilter === "read")
                          return msg.status === "read";
                        return true;
                      })
                      .map((msg) => (
                        <tr key={msg.id}>
                          <td>
                            {new Date(msg.createdAt).toLocaleDateString(
                              "no-NO",
                            )}
                          </td>
                          <td>{msg.name}</td>
                          <td>{msg.email}</td>
                          <td>{msg.subject}</td>
                          <td>
                            <span className={`status-badge ${msg.status}`}>
                              {msg.status === "unread" ? "Unread" : "Read"}
                            </span>
                          </td>
                          <td>
                            <button
                              className="action-btn view-btn"
                              onClick={() => openMessage(msg)}
                            >
                              View Message
                            </button>
                            <button
                              className="action-btn edit-btn"
                              onClick={() =>
                                toggleMessageStatus(msg.id, msg.status)
                              }
                            >
                              {msg.status === "unread"
                                ? "Mark Read"
                                : "Mark Unread"}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Hotel Modal */}
      {showHotelModal && (
        <div className="modal-overlay" onClick={() => setShowHotelModal(false)}>
          <div
            className="modal-content large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Add New Hotel</h2>

            <form onSubmit={saveHotel}>
              {/* Vanlige felter */}
              <div className="form-group">
                <label>Hotel ID</label>
                <input
                  type="text"
                  value={hotelForm.id}
                  onChange={(e) =>
                    setHotelForm({
                      ...hotelForm,
                      id: e.target.value.toLowerCase().trim(),
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Hotel Name</label>
                <input
                  type="text"
                  value={hotelForm.name}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, name: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={hotelForm.city}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, city: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Full Address</label>
                  <input
                    type="text"
                    placeholder="Storgata 12, 4005 Stavanger"
                    value={hotelForm.address || ""}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, address: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={hotelForm.rating}
                    onChange={(e) =>
                      setHotelForm({ ...hotelForm, rating: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={hotelForm.description}
                  onChange={(e) =>
                    setHotelForm({ ...hotelForm, description: e.target.value })
                  }
                  rows="3"
                />
              </div>

              {/* ==================== DYNAMISKE IMAGES ==================== */}
              <div className="form-group">
                <label>
                  Images{" "}
                  <span style={{ fontSize: "0.9em", color: "#666" }}>
                    (Add as many as you want)
                  </span>
                </label>

                {hotelForm.images.map((url, index) => (
                  <div key={index} className="dynamic-row">
                    <input
                      type="text"
                      placeholder="https://example.com/image.jpg"
                      value={url}
                      onChange={(e) => {
                        const newImages = [...hotelForm.images];
                        newImages[index] = e.target.value;
                        setHotelForm({ ...hotelForm, images: newImages });
                      }}
                    />
                    <button
                      type="button"
                      className="remove-row"
                      onClick={() => {
                        if (hotelForm.images.length > 1) {
                          setHotelForm({
                            ...hotelForm,
                            images: hotelForm.images.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-row-btn"
                  onClick={() =>
                    setHotelForm({
                      ...hotelForm,
                      images: [...hotelForm.images, ""],
                    })
                  }
                >
                  + Add new image
                </button>
              </div>

              {/* ==================== AMENITIES ==================== */}
              <div className="form-group">
                <label>Amenities</label>

                {hotelForm.amenities.map((amenity, index) => (
                  <div key={index} className="dynamic-row amenity-row">
                    <input
                      type="text"
                      placeholder="Label (for example Spa)"
                      value={amenity.label}
                      onChange={(e) => {
                        const newAmenities = [...hotelForm.amenities];
                        newAmenities[index].label = e.target.value;
                        setHotelForm({ ...hotelForm, amenities: newAmenities });
                      }}
                    />
                    <input
                      type="number"
                      placeholder="Pris"
                      value={amenity.price}
                      onChange={(e) => {
                        const newAmenities = [...hotelForm.amenities];
                        newAmenities[index].price = e.target.value;
                        setHotelForm({ ...hotelForm, amenities: newAmenities });
                      }}
                    />
                    <input
                      type="text"
                      placeholder="Icon"
                      value={amenity.icon}
                      onChange={(e) => {
                        const newAmenities = [...hotelForm.amenities];
                        newAmenities[index].icon = e.target.value;
                        setHotelForm({ ...hotelForm, amenities: newAmenities });
                      }}
                    />
                    <button
                      type="button"
                      className="remove-row"
                      onClick={() => {
                        if (hotelForm.amenities.length > 1) {
                          setHotelForm({
                            ...hotelForm,
                            amenities: hotelForm.amenities.filter(
                              (_, i) => i !== index,
                            ),
                          });
                        }
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <button
                  type="button"
                  className="add-row-btn"
                  onClick={() =>
                    setHotelForm({
                      ...hotelForm,
                      amenities: [
                        ...hotelForm.amenities,
                        { id: "", label: "", price: "", icon: "⭐" },
                      ],
                    })
                  }
                >
                  Add new amenity
                </button>
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setShowHotelModal(false)}>
                  Cancel
                </button>
                <button type="submit">Save Hotel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== DELETE HOTEL MODAL ==================== */}
      {showDeleteModal && hotelToDelete && (
        <div
          className="modal-overlay"
          onClick={() => setShowDeleteModal(false)}
        >
          <div className="cancel-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Delete Hotel</h2>
            <p>
              Are you sure you want to delete <br />
              <strong>"{hotelToDelete.name}"</strong>?
              <br />
              <br />
              This includes all rooms and cannot be undone.
            </p>
            <div className="cancel-modal-actions">
              <button
                className="cancel-modal-no"
                onClick={() => {
                  setShowDeleteModal(false);
                  setHotelToDelete(null);
                }}
              >
                Cancel
              </button>
              <button
                className="cancel-modal-yes delete-confirm"
                onClick={confirmDeleteHotel}
              >
                Yes, delete hotel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Room Modal */}
      {showRoomModal && (
        <div className="modal-overlay" onClick={() => setShowRoomModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingRoomId ? "Edit Room Type" : "Add New Room Type"}</h2>
            <form onSubmit={saveRoom}>
              <input
                type="text"
                placeholder="Room Type (e.g. Double Room)"
                value={roomForm.name}
                onChange={(e) =>
                  setRoomForm({ ...roomForm, name: e.target.value })
                }
                required
              />
              <input
                type="number"
                placeholder="Price per night"
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

      {/* Edit User Modal */}
      {showEditUserModal && editingUser && (
        <div
          className="modal-overlay"
          onClick={() => setShowEditUserModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Edit User</h2>
            <form onSubmit={saveUserChanges}>
              <div className="form-group">
                <label>Email (cannot be changed)</label>
                <input type="email" value={editingUser.email} disabled />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={editUserForm.displayName}
                  onChange={(e) =>
                    setEditUserForm({
                      ...editUserForm,
                      displayName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={editUserForm.role}
                  onChange={(e) =>
                    setEditUserForm({ ...editUserForm, role: e.target.value })
                  }
                >
                  <option value="user">User</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowEditUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New User Modal */}
      {showAddUserModal && (
        <div
          className="modal-overlay"
          onClick={() => setShowAddUserModal(false)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add New User</h2>
            <form onSubmit={saveNewUser}>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={addUserForm.email}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Display Name</label>
                <input
                  type="text"
                  value={addUserForm.displayName}
                  onChange={(e) =>
                    setAddUserForm({
                      ...addUserForm,
                      displayName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Role</label>
                <select
                  value={addUserForm.role}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, role: e.target.value })
                  }
                >
                  <option value="customer">Customer</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={addUserForm.password}
                  onChange={(e) =>
                    setAddUserForm({ ...addUserForm, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                >
                  Cancel
                </button>
                <button type="submit">Create User</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================== BOOKING DETAIL MODAL ==================== */}
      {showBookingDetail && selectedBooking && (
        <div
          className="modal-overlay"
          onClick={() => setShowBookingDetail(false)}
        >
          <div
            className="modal-content large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <h2>Booking Details - #{selectedBooking.orderId}</h2>

            <div className="booking-detail-grid">
              <div>
                <strong>Customer:</strong> {selectedBooking.customerName}
              </div>
              <div>
                <strong>Email:</strong> {selectedBooking.customerEmail}
              </div>
              <div>
                <strong>Type:</strong> {selectedBooking.type || "Room"}
              </div>
              <div>
                <strong>Hotel:</strong> {selectedBooking.hotelName}
              </div>
              <div>
                <strong>Item:</strong>{" "}
                {selectedBooking.roomName || selectedBooking.name}
              </div>
            </div>

            <div className="booking-edit-section">
              <h3>Edit Booking</h3>

              <div className="form-grid">
                <div className="form-group">
                  <label>Check-in Date</label>
                  <input
                    type="date"
                    value={selectedBooking.checkIn || ""}
                    onChange={(e) =>
                      setSelectedBooking((prev) => ({
                        ...prev,
                        checkIn: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="form-group">
                  <label>Check-out Date</label>
                  <input
                    type="date"
                    value={selectedBooking.checkOut || ""}
                    onChange={(e) =>
                      setSelectedBooking((prev) => ({
                        ...prev,
                        checkOut: e.target.value,
                      }))
                    }
                  />
                </div>
              </div>

              {/* Dynamisk prisvisning */}
              <div className="price-display">
                <strong>Total Price:</strong>{" "}
                {(() => {
                  if (!selectedBooking.checkIn || !selectedBooking.checkOut)
                    return "— kr";
                  const start = new Date(selectedBooking.checkIn);
                  const end = new Date(selectedBooking.checkOut);
                  const nights = Math.max(
                    0,
                    Math.ceil((end - start) / (1000 * 60 * 60 * 24)),
                  );
                  const pricePerNight =
                    Number(selectedBooking.pricePerNight) || 0;
                  const total = nights * pricePerNight;
                  return `${total.toLocaleString("no-NO")} kr (${nights} nights × ${pricePerNight} kr)`;
                })()}
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={selectedBooking.status || "confirmed"}
                  onChange={(e) =>
                    setSelectedBooking((prev) => ({
                      ...prev,
                      status: e.target.value,
                    }))
                  }
                  className="status-select"
                >
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowBookingDetail(false)}>
                Cancel
              </button>

              <button
                className="save-btn"
                onClick={() => saveBookingChanges(selectedBooking)}
              >
                Save Changes
              </button>

              <button
                className="delete-btn"
                onClick={() => handleDeleteBooking(selectedBooking)}
              >
                Delete Booking
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== MESSAGE DETAIL MODAL ==================== */}
      {showMessageModal && selectedMessage && (
        <div
          className="modal-overlay"
          onClick={() => setShowMessageModal(false)}
        >
          <div
            className="modal-content message-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <h2>{selectedMessage.subject}</h2>
              <button
                className="close-modal-btn"
                onClick={() => setShowMessageModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="message-info">
                <p>
                  <strong>From:</strong> {selectedMessage.name}
                </p>
                <p>
                  <strong>Email:</strong> {selectedMessage.email}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(selectedMessage.createdAt).toLocaleString("no-NO")}
                </p>
              </div>

              <div className="message-content">
                <p>{selectedMessage.message}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button onClick={() => setShowMessageModal(false)}>Close</button>
              <button
                className="edit-btn"
                onClick={() => {
                  toggleMessageStatus(
                    selectedMessage.id,
                    selectedMessage.status,
                  );
                  setShowMessageModal(false);
                }}
              >
                {selectedMessage.status === "unread"
                  ? "Mark as Read"
                  : "Mark as Unread"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPanel;
