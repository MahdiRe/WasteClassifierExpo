import React, { useState } from 'react';
import { View, Button, Image, FlatList, Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Checkbox } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

const CardList = (props) => {
    const { checkbox, images, selectedImages, toggleImageSelection, btnClicked } = props;
    const [previewImage, setPreviewImage] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

    const previewImageHandler = (uri) => {
        setPreviewImage(uri);
        setModalVisible(true);
    };

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
                            {checkbox &&
                                <Checkbox
                                    status={selectedImages.includes(item.uri) ? 'checked' : 'unchecked'}
                                    onPress={() => toggleImageSelection(item.uri)}
                                    style={styles.checkbox}
                                />
                            }
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
        justifyContent: 'center',
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
});

export default CardList;
