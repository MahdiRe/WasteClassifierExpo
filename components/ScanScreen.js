import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Text, Alert } from 'react-native';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [image, setImage] = useState(null);
    const [isCameraVisible, setIsCameraVisible] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            const { status } = await Camera.requestCameraPermissionsAsync();
            setHasPermission(status === 'granted');
        };

        getCameraPermissions();
    }, []);

    const takePicture = async () => {
        if (cameraRef) {
            const photo = await cameraRef.takePictureAsync();
            setImage(photo.uri);
            setIsCameraVisible(false);
        }
    };

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
                <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)}>
                    <View>
                        <Button title="Capture" onPress={takePicture} />
                    </View>
                </Camera>
            ) : (
                <View style={styles.previewContainer}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.image} />
                    ) : (
                        <Text>No image captured</Text>
                    )}
                </View>
            )}

            <View style={styles.bottomContainer}>
                <Button title="Scan New" onPress={() => setIsCameraVisible(true)} disabled={!hasPermission || isCameraVisible}/>
                <Button title="Dispose Type?" onPress={() => Alert.alert('Image Check', 'Image is available!')} disabled={!image} />
            </View>
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
        width: 300,
        height: 400,
        marginBottom: 20,
    },
    buttonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        paddingHorizontal: 20,
        marginBottom: 20,
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
