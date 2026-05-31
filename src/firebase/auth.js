import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut } from "firebase/auth";
import app from "./config";
import { auth } from "./config";

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