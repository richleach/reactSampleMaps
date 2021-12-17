import firebase from "firebase/app";
import "firebase/auth";

const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
}

export default function initFirebase() {
    //because Next server is constantly hot reloading, add this if check
    if (!firebase.apps.length) {
        firebase.initializeApp(config)
    }

};
