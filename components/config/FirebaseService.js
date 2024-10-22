// FirebaseService.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration (replace with your own config)
const firebaseConfig = {
    apiKey: "AIzaSyAOyGt5f4IQom3ZN9_J8KKxRierrt0vwoU",
    authDomain: "wasteclassifierexpo.firebaseapp.com",
    projectId: "wasteclassifierexpo",
    storageBucket: "wasteclassifierexpo.appspot.com",
    messagingSenderId: "20259606665",
    appId: "1:20259606665:android:85bbd80249d7399d757658",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);

class FirebaseService {
    // Method to set data in Firestore
    async setData(collectionName, dataObject) {
        try {
            const docRef = await addDoc(collection(firestore, collectionName), dataObject);
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    // Method to get data from Firestore
    async getData(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(firestore, collectionName));
            let dataList = [];
            querySnapshot.forEach((doc) => {
                dataList.push({ id: doc.id, ...doc.data() });
            });
            return dataList; // Return an array of data objects
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }
}

export default new FirebaseService(); // Export an instance of the class
