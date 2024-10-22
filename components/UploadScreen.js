import React, { useState } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal, CheckBox, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FirebaseService from './config/FirebaseService';


const UploadScreen = () => {
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]); // To store selected images for upload

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

            setImages((prevImages) => [...prevImages, newImage]);
        }
    };

    const deleteImage = async (imageUri) => {
        setImages(images.filter((img) => img.uri !== imageUri));
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

    // Function to save selected images to Firebase
    const saveToFirebase = async () => {
        try {
            for (const image of images) {
                if (selectedImages.includes(image.uri)) {
                    await FirebaseService.setData('img-data', image);
                    Alert.alert('Success', 'Selected images saved to Firebase.');
                }
            }
        } catch (error) {
            console.error('Error saving images to Firebase:', error);
            Alert.alert('Error', 'Failed to save images.');
        }
    };

    return (
        <View>
            <View style={styles.container}>
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageCard}>
                            <CheckBox
                                value={selectedImages.includes(item.uri)}
                                onValueChange={() => toggleImageSelection(item.uri)}
                            />
                            <TouchableOpacity onPress={() => previewImageHandler(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                            </TouchableOpacity>
                            <View style={styles.imageInfo}>
                                <Text style={styles.title}>{item.fileName.split('.', 2)[0]} - <Text style={styles.boldText}>{item.type}</Text></Text>
                                <TouchableOpacity onPress={() => deleteImage(item.uri)}>
                                    <Text style={styles.deleteButton}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )}
                />

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
            </View>

            <View style={styles.uploadContainer}>
                <Button title="Upload Image" onPress={pickImages} />
                <Button title="Save Selected" onPress={saveToFirebase} disabled={selectedImages.length === 0} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 700, flex: 1, padding: 10, backgroundColor: 'lightgrey' },
    imageCard: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 5,
    },
    thumbnail: { width: 50, height: 50, marginRight: 10, borderRadius: 5 },
    imageInfo: { flex: 1, paddingLeft: 10 },
    title: { fontSize: 16 },
    boldText: { fontWeight: 'bold' },
    deleteButton: { color: 'red', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    previewImage: { width: '80%', height: '80%', resizeMode: 'contain' },
    uploadContainer: { flexDirection: 'row', justifyContent: 'space-around', marginTop: 20 },
});

export default UploadScreen;
