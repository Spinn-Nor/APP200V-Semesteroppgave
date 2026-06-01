/**
 * Custom React Hook - useHotels
 *
 * Fetches all hotels from Firebase Realtime Database and listens for real-time updates.
 * Converts the Firebase object structure into a clean array format, including the hotel ID.
 * Manages loading and error states for better UX.
 *
 * @author Fredrik Fordelsen
 * @returns {Object} An object containing:
 *   - hotels: Array of hotel objects
 *   - loading: Boolean indicating if data is still loading
 *   - error: Error message if the fetch fails
 *
 * Usage example:
 * const { hotels, loading, error } = useHotels();
 */

import { useState, useEffect } from "react";
import { db } from "../firebase/config";
import { ref, onValue } from "firebase/database";

export function useHotels() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const hotelsRef = ref(db, "hotels");

    const unsubscribe = onValue(hotelsRef, (snapshot) => {
      try {
        const data = snapshot.val();

        if (data) {
          // Converting from object to array
          const hotelsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));
          setHotels(hotelsArray);
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error("Error when fetching hotels: ", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return { hotels, loading, error };
}
