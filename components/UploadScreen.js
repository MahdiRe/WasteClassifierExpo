import React, { useState } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

const UploadScreen = () => {
    const [images, setImages] = useState([]);  // List of image objects with uri and disposeType
    const [previewImage, setPreviewImage] = useState(null);  // Stores the image URI for preview
    const [modalVisible, setModalVisible] = useState(false);  // Manages the visibility of the preview modal

    // Handle image picking
    const pickImages = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            const newImage = result.assets[0];
            const disposeType = images.length % 2 === 0 ? 'Organic' : 'Disposable';  // Set type based on even/odd index
            const obj = { uri: newImage, disposeType };  // Create new image object

            setImages((prevImages) => [...prevImages, obj]);  // Add new image object to the list
            setTimeout(() => console.log(images), 1000)
        }
    };

    // Handle image deletion
    const deleteImage = async (imageUri) => {
        setImages(images.filter((img) => img.uri !== imageUri));
    };

    // Open the image in preview modal
    const previewImageHandler = (uri) => {
        setPreviewImage(uri);
        setModalVisible(true);
    };

    return (
        <View>
            <View style={styles.container}>
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => previewImageHandler(item.uri)}>
                                <Image source={{ uri: item.uri.uri }} style={styles.thumbnail} />
                            </TouchableOpacity>
                            <Text style={styles.title}>{item.disposeType}</Text>
                            <TouchableOpacity onPress={() => deleteImage(item.uri)}>
                                <Text style={styles.deleteButton}>Delete</Text>
                            </TouchableOpacity>
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
                            <Image source={{ uri: previewImage.uri }} style={styles.previewImage} />
                            <Button title="Close" onPress={() => setModalVisible(false)} />
                        </View>
                    </Modal>
                )}
            </View>
            <View style={styles.uploadBtn}>
                <Button title="Upload Image" onPress={pickImages} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { minHeight: 700, flex: 1, padding: 10, backgroundColor: 'lightgrey' },
    imageContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
    thumbnail: { width: 50, height: 50, marginRight: 10 },
    title: { flex: 1, fontSize: 16 },
    deleteButton: { color: 'red', fontWeight: 'bold' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    previewImage: { width: '80%', height: '80%', resizeMode: 'contain' },
    uploadBtn: { width: '100%', marginTop: 20 }
});

export default UploadScreen;
