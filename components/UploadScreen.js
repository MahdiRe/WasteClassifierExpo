import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';  // Firebase storage functions
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';  // Firestore functions
import { db, storage } from './config/firebaseConfig';  // Import initialized Firebase config
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadScreen = () => {
    const [image, setImage] = useState(null);  // Holds the selected image URI
    const [loading, setLoading] = useState(false);  // Loading state for classification
    const [classification, setClassification] = useState('');  // Holds the classification result
    const [uploading, setUploading] = useState(false);  // Uploading state

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.uri);
            classifyImage(result.uri);  // Classify the image after selection
        }
    };

    const classifyImage = async (imageUri) => {
        setLoading(true);

        setTimeout(() => {
            // Simulate a classification result
            const randomResult = Math.random() < 0.4 ? 'Organic' : Math.random() < 0.5 ? 'Disposable' : 'Not Sure';
            setClassification(randomResult);
            setLoading(false);
        }, 2000);
    };

    const saveImage = async () => {
        if (!image) {
            Alert.alert('No image selected', 'Please upload an image before saving.');
            return;
        }

        setUploading(true);
        const filename = image.substring(image.lastIndexOf('/') + 1);

        try {
            const response = await fetch(image);
            const blob = await response.blob();

            // Upload image to Firebase Storage
            const storageRef = ref(storage, `images/${filename}`);
            await uploadBytes(storageRef, blob);

            // Get image download URL
            const downloadURL = await getDownloadURL(storageRef);

            // Save classification result and image URL to Firestore
            await addDoc(collection(db, 'classifications'), {
                imageUrl: downloadURL,
                result: classification,
                timestamp: serverTimestamp(),
            });

            // Save image and classification result locally (offline mode)
            const localData = {
                imageUrl: downloadURL,
                result: classification,
                timestamp: new Date().toISOString(),
            };
            await AsyncStorage.setItem(`@classification_${filename}`, JSON.stringify(localData));

            Alert.alert('Success', 'Image and classification saved successfully!');
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to save the image.');
        } finally {
            setUploading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <Button title="Upload Image" onPress={pickImage} />

            {image && (
                <View style={styles.previewContainer}>
                    <Text style={styles.text}>Image Preview:</Text>
                    <Image source={{ uri: image }} style={styles.image} />
                </View>
            )}

            {loading && <ActivityIndicator size="large" color="#0000ff" />}

            {!loading && classification && (
                <View style={styles.resultContainer}>
                    <Text style={styles.text}>Classification Result:</Text>
                    <Text style={styles.classification}>{classification}</Text>
                </View>
            )}

            {!uploading && image && classification && (
                <Button title="Save" onPress={saveImage} />
            )}

            {uploading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    previewContainer: {
        marginTop: 20,
        alignItems: 'center',
        width: '100%',
        height: '50%',  // Set image preview to take 50% of the screen
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    resultContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    text: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    classification: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'green',
    },
});

export default UploadScreen;
