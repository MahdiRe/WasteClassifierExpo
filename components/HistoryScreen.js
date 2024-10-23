import React, { useState, useEffect, useRef } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal, ActivityIndicator } from 'react-native';
import FirebaseService from './config/FirebaseService';
import { MaterialIcons } from '@expo/vector-icons';
import Notify from './Notify';

const HistoryScreen = () => {
    const [images, setImages] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [notifyMode, setNotifyMode] = useState("");
    const namesArr = ['Polythene Bag', 'Slipper', 'Glass Bottle', 'Food Item', 'Paper/Board'];
    const idToDelete = useRef(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setNotifyMode('fetch')
        setOpen(true);
        setLoading(true);
        const imagesFromFirebase = await FirebaseService.getData('img-data');
        setImages(imagesFromFirebase);
        setOpen(false);
        setLoading(false);
    };

    const deleteImage = async () => {
        setLoading(true);
        await FirebaseService.delete('img-data', idToDelete);
        fetchImages();
    };

    const previewImageHandler = (uri) => {
        setPreviewImage(uri);
        setModalVisible(true);
    };

    const deleteAll = async () => {
        setLoading(true);
        await FirebaseService.deleteAll('img-data');
        fetchImages();
    }

    const btnClicked = (type, id) => {
        setOpen(true);
        setNotifyMode(type);
        if (id) idToDelete.current = id;
    }

    return (
        <View style={styles.container}>
            {images.length === 0 ? (
                <View style={styles.noImagesContainer}>
                    <Text style={styles.noImagesText}>No images saved yet!</Text>
                </View>
            ) : (
                <FlatList
                    data={images}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.imageContainer}>
                            <TouchableOpacity onPress={() => previewImageHandler(item.uri)}>
                                <Image source={{ uri: item.uri }} style={styles.thumbnail} />
                            </TouchableOpacity>
                            <View style={styles.textContainer}>
                                <Text style={styles.title} numberOfLines={1}>{namesArr[Math.floor(Math.random() * namesArr.length)]}</Text>
                                <Text style={styles.type}>{item.type}</Text>
                            </View>
                            <TouchableOpacity onPress={() => btnClicked("Delete", item.id)}>
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
                <Button title="Refresh Data" onPress={fetchImages} disabled={loading} />
                <Button title={`Delete All (${images.length || 0})`} onPress={() => btnClicked("Delete All")} disabled={images.length === 0} />
            </View>

            <Notify
                visible={open}
                text={notifyMode === 'fetch' ? "Fetching Data" : `Confirm Delete${notifyMode !== 'Delete' ? " All" : ""}?`}
                onCancel={notifyMode !== 'fetch' ? () => setOpen(false) : undefined}
                onSave={notifyMode === 'Delete' ? deleteImage : notifyMode === 'Delete All' ? deleteAll : undefined}
                saveload={loading}
                saveText={notifyMode}
                loadText={notifyMode === 'fetch' ? "Loading Data" : notifyMode === 'Delete' ? "Deleting Data" : "Deleting All Data"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: 'lightgrey' },
    noImagesContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    noImagesText: { fontSize: 18, color: '#555' },
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
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.8)' },
    previewImage: { width: '80%', height: '80%', resizeMode: 'contain' },
    uploadBtn: { marginTop: 20, paddingHorizontal: 10 },
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

export default HistoryScreen;
