// FirebaseService.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, doc, deleteDoc, query, where } from 'firebase/firestore';
import { getStorage, ref, deleteObject } from 'firebase/storage'; // To handle storage deletion if needed

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
    async setData(collectionName, dataObject) {
        try {
            const docRef = await addDoc(collection(firestore, collectionName), dataObject);
            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            console.error("Error adding document: ", error);
        }
    }

    async getData(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(firestore, collectionName));
            let dataList = [];
            querySnapshot.forEach((doc) => {
                dataList.push({ id: doc.id, ...doc.data() });
            });
            console.log(dataList)
            return dataList;
        } catch (error) {
            console.error("Error getting documents: ", error);
        }
    }

    async delete(collectionName, docId) {
        try {
            const docRef = doc(firestore, collectionName, docId);
            await deleteDoc(docRef);
            console.log(`Document with ID ${docId} deleted successfully.`);
        } catch (error) {
            console.error("Error deleting document: ", error);
        }
    }

    async deleteAll(collectionName) {
        try {
            const querySnapshot = await getDocs(collection(firestore, collectionName));
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
                console.log(`Document with ID ${doc.id} deleted.`);
            });
            console.log("All documents in the collection deleted.");
        } catch (error) {
            console.error("Error deleting all documents: ", error);
        }
    }
}

export default new FirebaseService();
