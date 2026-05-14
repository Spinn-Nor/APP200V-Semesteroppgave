import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { connectAuthEmulator, getAuth } from "firebase/auth";

const firebaseConfig = {

    apiKey: "AIzaSyCtJ0hdz-mzdpCEi087XCGQ6oXvOkkxdQo",

    authDomain: "blueberry-hotels2.firebaseapp.com",

    databaseURL: "https://blueberry-hotels2-default-rtdb.europe-west1.firebasedatabase.app",

    projectId: "blueberry-hotels2",

    storageBucket: "blueberry-hotels2.firebasestorage.app",

    messagingSenderId: "286924427088",

    appId: "1:286924427088:web:93bc06a26fb7d10be5e655"

};

const app = initializeApp(firebaseConfig);

export const db = getDatabase(app);
export const auth = getAuth(app);

export default app;

// connectAuthEmulator(auth, "http://localhost:9099");