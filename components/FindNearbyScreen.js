import React from 'react';
import { View, Button, Image, StyleSheet } from 'react-native';

const ScanScreen = () => {
    return (
        <View style={styles.container}>
            <Image source={require('../assets/map.jpg')} style={styles.image} />
            <View style={styles.scanBtn}>
                <Button title="View in Google Maps" />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    image: { width: 400, height: 700, marginBottom: 10 },
    scanBtn: { width: '100%', marginTop: 20 }
});

export default ScanScreen;
