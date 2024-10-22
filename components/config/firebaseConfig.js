// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
    apiKey: "AIzaSyCGROrg5PP09ThAMBSK_MBh2dKTudsSXp8",
    authDomain: "waste-identifier-152c7.firebaseapp.com",
    projectId: "waste-identifier-152c7",
    storageBucket: "waste-identifier-152c7.appspot.com",
    messagingSenderId: "970543277051",
    appId: "1:970543277051:android:cfdf3b72629ebdd8c4e15e",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
