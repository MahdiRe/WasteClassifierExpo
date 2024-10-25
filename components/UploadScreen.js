import React, { useEffect, useRef, useState } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import { Checkbox } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import FirebaseService from './config/FirebaseService';
import { MaterialIcons } from '@expo/vector-icons';
import Notify from './Notify';
import NetInfo from '@react-native-community/netinfo';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UploadScreen = () => {
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
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

    const previewImageHandler = (uri) => {
        setPreviewImage(uri);
        setModalVisible(true);
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
            {images.length === 0 ? (
                <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No images selected</Text>
                </View>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <Checkbox
                                status={selectedImages.includes(item.uri) ? 'checked' : 'unchecked'}
                                onPress={() => toggleImageSelection(item.uri)}
                                style={styles.checkbox}
                            />
                            <TouchableOpacity onPress={() => previewImageHandler(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
                                <Text style={styles.type}>{item.type}</Text>
                            </View>
                            <TouchableOpacity onPress={() => btnClicked('Delete', item.uri)}>
                                <MaterialIcons name="delete" size={24} color="red" style={styles.deleteIcon} />
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}

            {modalVisible && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <Image source={{ uri: previewImage }} style={styles.previewImage} />
                        <Button title="Close" onPress={() => setModalVisible(false)} />
                    </View>
                </Modal>
            )}

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
    noImagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noImagesText: {
        fontSize: 18,
        color: '#555',
    },
    checkbox: {
        marginRight: 10,
    },
    imageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
    textContainer: { flex: 1, marginRight: 10 },
    title: { fontSize: 16, fontWeight: 'bold', flex: 1, maxWidth: '80%' },
    type: { fontSize: 14, color: 'grey', marginTop: 4 },
    deleteIcon: { marginLeft: 'auto', paddingLeft: 10 },
    imageInfo: {
        flex: 1,
        paddingLeft: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    previewImage: {
        width: '80%',
        height: '80%',
        resizeMode: 'contain',
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
