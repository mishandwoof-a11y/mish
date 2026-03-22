import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: "AIzaSyCwiTZdZSkzXa1v17YkBhMzp9isix07k5w",
  authDomain: "mishwoof-18638.firebaseapp.com",
  projectId: "mishwoof-18638",
  storageBucket: "mishwoof-18638.firebasestorage.app",
  messagingSenderId: "769126730047",
  appId: "1:769126730047:web:8d4c9f9585e2faca7feb8a",
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
