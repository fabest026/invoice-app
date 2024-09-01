
// import { initializeApp } from "firebase/app";
// import { getAuth } from "firebase/auth";
// import { getFirestore } from "firebase/firestore";

// const firebaseConfig = {
//   apiKey: "AIzaSyCvRa-F2kYYs5DD997l_GaJdl0q28tzgHo",
//   authDomain: "invoice-app-81e35.firebaseapp.com",
//   projectId: "invoice-app-81e35",
//   storageBucket: "invoice-app-81e35.appspot.com",
//   messagingSenderId: "902016988333",
//   appId: "1:902016988333:web:f6e3d0093d165c56480224",
//   measurementId: "G-YM88MWXY1N"
// };


// export const firebaseApp = initializeApp(firebaseConfig);

// export const auth = getAuth(firebaseApp);
// export const db = getFirestore(firebaseApp);
// export default firebaseApp


// Import necessary Firebase services
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvRa-F2kYYs5DD997l_GaJdl0q28tzgHo",
  authDomain: "invoice-app-81e35.firebaseapp.com",
  projectId: "invoice-app-81e35",
  storageBucket: "invoice-app-81e35.appspot.com",
  messagingSenderId: "902016988333",
  appId: "1:902016988333:web:f6e3d0093d165c56480224",
  measurementId: "G-YM88MWXY1N"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(firebaseApp);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp); // Initialize storage

// Export the services
export { auth, db, storage }; // Export storage along with other services
export default firebaseApp;





