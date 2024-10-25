import React, { useEffect, useRef, useState } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FirebaseService from './config/FirebaseService';
import Notify from './common/Notify';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CardList from './common/CardList';

const UploadScreen = () => {
    const [images, setImages] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const namesArr = ['Polythene Bag', 'Slipper', 'Glass Bottle', 'Food Item', 'Paper/Board'];
    const [notifyVisible, setNotifyVisible] = useState(false);
    const [notifyMode, setNotifyMode] = useState("");
    const uriToDelete = useRef(null);

    // Detect network connectivity and sync offline images when online
    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener(state => {
            if (state.isConnected) {
                // Sync offline images when online
                syncOfflineImages();
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    // Handle image picking
    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImage = result.assets[0];
            newImage.type = images.length % 2 === 0 ? 'Organic' : 'Disposable';
            newImage.name = namesArr[Math.floor(Math.random() * namesArr.length)];
            setImages((prevImages) => [...prevImages, newImage]);
        }
    };

    const deleteImage = async () => {
        setImages(images.filter((img) => img.uri !== uriToDelete.current));
        setNotifyVisible(false);
    };

    const toggleImageSelection = (imageUri) => {
        if (selectedImages.includes(imageUri)) {
            setSelectedImages(selectedImages.filter((uri) => uri !== imageUri));
        } else {
            setSelectedImages([...selectedImages, imageUri]);
        }
    };

    const saveToFirebase = async () => {
        setLoading(true);
        try {
            const netInfo = await NetInfo.fetch();
            if (netInfo.isConnected) {
                for (const image of images) {
                    if (selectedImages.includes(image.uri)) {
                        await FirebaseService.setData('img-data', image);
                    }
                }
                setSelectedImages([]);
                setImages([]);
            } else {
                const offlineImages = await AsyncStorage.getItem('offlineImages') || '[]';
                const updatedImages = [...JSON.parse(offlineImages), ...images.filter(image => selectedImages.includes(image.uri))];
                await AsyncStorage.setItem('offlineImages', JSON.stringify(updatedImages));
                console.log('Offline', 'Images saved locally. They will be uploaded when you are online.');
            }
        } catch (error) {
            console.error('Error saving images:', error);
        } finally {
            setLoading(false);
            setNotifyVisible(false);
        }
    };

    // Sync offline images when internet is available
    const syncOfflineImages = async () => {
        try {
            const offlineImages = await AsyncStorage.getItem('offlineImages');
            if (offlineImages) {
                const imagesToSync = JSON.parse(offlineImages);
                for (const image of imagesToSync) {
                    await FirebaseService.setData('img-data', image);
                }
                await AsyncStorage.removeItem('offlineImages');
                console.log('Sync Complete', 'Offline images have been uploaded to Firebase.');
            }
        } catch (error) {
            console.error('Error syncing offline images:', error);
        }
    };

    const btnClicked = (type, uri) => {
        setNotifyVisible(true);
        setNotifyMode(type);
        if (uri) uriToDelete.current = uri;
    }

    return (
        <View style={styles.container}>
            <CardList
                checkbox
                images={images}
                selectedImages={selectedImages}
                toggleImageSelection={toggleImageSelection}
                btnClicked={btnClicked}
            />

            <View style={styles.bottomContainer}>
                <Button title="Upload Image" onPress={pickImages} />
                <Button title="Save Selected" onPress={() => btnClicked('Save')} disabled={selectedImages.length === 0} />
            </View>

            <Notify
                visible={notifyVisible}
                text={notifyMode == 'Save' ? "Save Selected?" : "Confirm Delete?"}
                onCancel={() => setNotifyVisible(false)}
                onSave={notifyMode == 'Save' ? saveToFirebase : deleteImage}
                saveText={notifyMode}
                saveload={loading}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1, padding: 10, backgroundColor: 'lightgrey'
    },
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: '#f8f8f8',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
});

export default UploadScreen;
