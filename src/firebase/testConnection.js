import { db } from './config';
import { ref, set, get } from 'firebase/database';

export const testFirebaseConnection = async () => {
    try {
        console.log("🔄 Tester tilkobling til Firebase Realtime Database...");

        // Test 1: Skriv en testverdi
        const testRef = ref(db, 'testConnection');
        await set(testRef, {
            message: "Firebase tilkobling fungerer!",
            timestamp: Date.now()
        });

        console.log("✅ Skriving til databasen fungerte!");

        // Test 2: Les tilbake verdien
        const snapshot = await get(testRef);
        if (snapshot.exists()) {
            console.log("✅ Lesing fra databasen fungerte!");
            console.log("Data hentet:", snapshot.val());
        } else {
            console.log("❌ Kunne ikke lese data");
        }

        console.log("🎉 Firebase Realtime Database-tilkobling fungerer!");
        return true;

    } catch (error) {
        console.error("❌ Feil ved tilkobling til Firebase:", error);
        return false;
    }
}; 