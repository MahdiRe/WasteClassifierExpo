import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text, Modal, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import FirebaseService from './config/FirebaseService';
import Notify from './Notify';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [image, setImage] = useState(null);
    const [isCameraVisible, setIsCameraVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const takePicture = async () => {
        if (!image) {
            if (cameraRef) {
                const photo = await cameraRef.takePictureAsync();
                setImage(photo);
                setIsCameraVisible(false);
            }
        } else {
            setImage(null);
            setIsCameraVisible(true);
        }
    };

    const handleCheck = () => {
        setModalVisible(true);
    };

    const saveToFirebase = async () => {
        try {
            image.type = "Disposable";
            await FirebaseService.setData('img-data', image);
            setImage(null);
            setIsCameraVisible(true);
            setModalVisible(false);
        } catch (err) {
            console.error('Error saving images to Firebase:', err);
            setModalVisible(false);
        }
    }

    // Check permission status and render appropriate UI
    if (hasPermission === null) {
        return <View />;
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={styles.noPermissionText}>No permission granted</Text>
                <Button title="Scan" onPress={() => { }} disabled={true} />
                <Button title="Check" onPress={() => { }} disabled={true} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {isCameraVisible ? (
                <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)} />
            ) : (
                <View style={styles.previewContainer}>
                    {image ? (
                        <Image source={{ uri: image.uri }} style={styles.image} />
                    ) : (
                        <Text>No image captured</Text>
                    )}
                </View>
            )}

            <View style={styles.bottomContainer}>
                {!image ? (
                    <Button title="Capture" onPress={takePicture} disabled={!hasPermission} />
                ) : (
                    <Button title="Re-Capture" onPress={takePicture} disabled={!hasPermission} />
                )}
                <Button title="Check" onPress={handleCheck} disabled={!image} />
            </View>

            <Notify
                visible={modalVisible}
                header="This is a book"
                text="This is disposable."
                onCancel={() => setModalVisible(false)}
                onSave={saveToFirebase}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    camera: {
        flex: 1,
        width: '100%',
    },
    previewContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        flex: 1,
        width: 400,
        height: 400,
    },
    noPermissionText: {
        fontSize: 18,
        color: 'red',
        textAlign: 'center',
        marginBottom: 20,
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

export default ScanScreen;
