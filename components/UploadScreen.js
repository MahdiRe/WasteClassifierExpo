import React, { useState } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator, CheckBox } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import FirebaseService from './config/FirebaseService';
import { MaterialIcons } from '@expo/vector-icons';

const UploadScreen = () => {
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImages, setSelectedImages] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const saveToFirebase = async () => {
        setLoading(true);
        try {
            for (const image of images) {
                if (selectedImages.includes(image.uri)) {
                    await FirebaseService.setData('img-data', image);
                }
            }
            setSelectedImages([]);
            setImages([]);
            Alert.alert('Success', 'All selected images saved successfully.');
        } catch (error) {
            console.error('Error saving images to Firebase:', error);
            Alert.alert('Error', 'Failed to save images.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : images.length === 0 ? (
                <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No images selected</Text>
                </View>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <CheckBox
                                value={selectedImages.includes(item.uri)}
                                onValueChange={() => toggleImageSelection(item.uri)}
                                style={styles.checkbox}
                            />
                            <TouchableOpacity onPress={() => previewImageHandler(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1}>{item.fileName.split('.', 2)[0]}</Text>
                                <Text style={styles.type}>{item.type}</Text>
                            </View>
                            <TouchableOpacity onPress={() => deleteImage(item.uri)}>
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
                <Button title="Save Selected" onPress={saveToFirebase} disabled={selectedImages.length === 0} />
            </View>
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
