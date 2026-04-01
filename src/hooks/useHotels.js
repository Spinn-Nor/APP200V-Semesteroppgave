import {useState, useEffect} from 'react';
import {db} from '../firebase/config';
import {ref, onValue} from 'firebase/database';

export function useHotels() {
    const [hotels, setHotels] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const hotelsRef = ref(db, 'hotels');

        const unsubscribe = onValue(hotelsRef, (snapshot) => {
            try {
                const data = snapshot.val();

                if (data) {
                    // Converting from object to array
                    const hotelsArray = Objects.keys(data).map(key => ({
                        id: key,
                        ...data[key]
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

    return {hotels, loading, error};
}