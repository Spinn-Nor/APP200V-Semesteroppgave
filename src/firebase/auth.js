import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import app from "./config";
import { auth } from "./config";

export async function loginEmailPassword(loginEmail, loginPassword) {
    try {
        const userCredentials = await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
        console.log(userCredentials.user);
    } catch (error) {
        console.log("code:", error.code);
        console.log("message:", error.message);
        console.log("full error:", error);
    }
}

export async function registerUser(signupEmail, signupPassword) {
    try {
        const userCredentials = await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
        console.log(userCredentials.user);
    } catch (error) {
        console.log(error)
    }
}