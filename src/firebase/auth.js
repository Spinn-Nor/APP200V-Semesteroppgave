/**
 * auth.js
 *
 * Functions for login and user registration through the Firebase Auth API.
 *
 * @author Bendik Viken Wangen
 * @version 1.2
 */

import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import app from "./config";
import { auth } from "./config";

// takes an email and a password and tries to log in using the Firebase Auth API 
export async function loginEmailPassword(loginEmail, loginPassword) {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        // console.log(userCredentials.user);
    } catch (error) {
        console.log("code:", error.code);
        console.log("message:", error.message);
        console.log("full error:", error);
    }
}

// takes a name, email and a password and creates a new user through the Firebase Auth API 
// sets the users display name after account creation, then forces the auth context to update with the new display name 
export async function registerUser(firstName, lastName, signupEmail, signupPassword) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);

        const user = userCredentials.user;

        // const displayName = `${firstName} ${lastName}`;

        await updateProfile(user, {
            firstName
        });

        await user.getIdToken(true);

        // console.log("registered user: ", user);
    } catch (error) {
        console.log(error);
    }
}

export async function signoutUser() {
    await signOut(auth);
}