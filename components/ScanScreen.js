import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';

const ScanScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [cameraRef, setCameraRef] = useState(null);
  const [classificationResult, setClassificationResult] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { status } = await Camera.requestCameraPermissionsAsync();
        setHasPermission(status === 'granted');
      } catch (error) {
        Alert.alert('Error', 'Failed to get camera permissions.');
      }
    })();
  }, []);

  const takePicture = async () => {
    if (cameraRef) {
      try {
        const photo = await cameraRef.takePictureAsync();
        const result = Math.random() < 0.5 ? 'organic' : 'disposable';
        setClassificationResult(result);
      } catch (error) {
        Alert.alert('Error', 'Failed to capture photo.');
      }
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting permissions...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        ref={(ref) => setCameraRef(ref)}
      />
      <View style={styles.classificationContainer}>
        <Button title="Capture" onPress={takePicture} />
        <Text style={styles.classificationText}>
          {classificationResult ? `Classification: ${classificationResult}` : 'Waiting for classification...'}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 3,
    width: '100%',
  },
  classificationContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  classificationText: {
    fontSize: 20,
    marginTop: 10,
  },
});

export default ScanScreen;
