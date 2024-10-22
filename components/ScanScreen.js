import React, { useState, useEffect } from 'react';
import { View, Button, Image, StyleSheet, Alert, Text } from 'react-native';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
    const [hasPermission, setHasPermission] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [image, setImage] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const getCameraPermissions = async () => {
            try {
                const { status } = await Camera.getCameraPermissionsAsync();
                setHasPermission(status === 'granted');
            } catch (err) {
                console.error('Camera permission error:', err);
                Alert.alert('Error', 'Failed to get camera permissions.');
                setHasPermission(false);
            }
        };

        getCameraPermissions();
    }, []);

    if (hasPermission === null) {
        return <View />;
    }

    // if (hasPermission === false) {
    //     // return <Text>No access to camera</Text>;
    // }

    const takePicture = async () => {
        try {
            if (cameraRef) {
                const photo = await cameraRef.takePictureAsync();
                setImage(photo.uri);
                setError(false);
            }
        } catch (err) {
            console.error('Error capturing image:', err);
            setError(true);
            Alert.alert('Error', 'Failed to capture image.');
        }
    };

    const saveImage = async () => {
        try {
            Alert.alert('Saved', 'Your image has been saved.');
        } catch (err) {
            console.error('Error saving image:', err);
            Alert.alert('Error', 'Failed to save the image.');
        }
    };

    return (
        <View style={styles.container}>
            {hasPermission ? (
                !image ? (
                    <Camera style={styles.camera} ref={(ref) => setCameraRef(ref)}>
                        <View>
                            <Button title="Capture" onPress={takePicture} />
                        </View>
                    </Camera>
                ) : (
                    <View style={styles.previewContainer}>
                        {/* Show captured image if available */}
                        <Image source={{ uri: image }} style={styles.image} />
                        <Button title="Save" onPress={saveImage} />
                        <Button title="Scan New" style={styles.scanBtn} onPress={() => setImage(null)} />
                    </View>
                )
            ) : (
                <View style={styles.previewContainer}>
                    {/* If there's an error, show the static image */}
                    <Image source={require('../assets/nocam.jpg')} style={styles.image} />
                    <View style={styles.scanBtn}>
                        <Button title="Scan New" onPress={() => setError(false)} />
                    </View>
                </View>
            )}
        </View>

    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    camera: { flex: 1, width: '100%' },
    previewContainer: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    image: { width: 400, height: 680, marginBottom: -40 },
    scanBtn: { width: '100%', marginTop: 20 }
});

export default ScanScreen;
