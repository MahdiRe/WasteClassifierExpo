import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

const HomePage = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image
                    source={require('../assets/waste-bins.jpg')}
                    style={styles.image}
                />
                <Text style={styles.title}>Waste Classifier</Text>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Scan')}>
                    <Text style={styles.buttonText}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Upload')}>
                    <Text style={styles.buttonText}>Upload</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('History')}>
                    <Text style={styles.buttonText}>History</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('FindNearby')}>
                    <Text style={styles.buttonText}>Find Nearby</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Complaints')}>
                    <Text style={styles.buttonText}>Complaints</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ContactUs')}>
                    <Text style={styles.buttonText}>Contact Us</Text>
                </TouchableOpacity>
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
    titleContainer: {
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        width: '80%',
        marginTop: 20,
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 20,
        margin: 10,
        width: '40%',
        borderRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    image: {
        width: 100,   // Adjust the width of the image
        height: 100,  // Adjust the height of the image
        marginBottom: 40,  // Add margin between image and text
    },
});

export default HomePage;
