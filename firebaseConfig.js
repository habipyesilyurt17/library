import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB5yAyZcjDm99jI8ZRvVYfe6OhmLtG_3ko",
  authDomain: "next-auth-crud-f0833.firebaseapp.com",
  projectId: "next-auth-crud-f0833",
  storageBucket: "next-auth-crud-f0833.appspot.com",
  messagingSenderId: "405859010034",
  appId: "1:405859010034:web:82e0e06f6ac2be8fb3d76b",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
