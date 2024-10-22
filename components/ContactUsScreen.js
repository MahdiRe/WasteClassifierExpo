import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactUsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.aboutText}>
                This is an app for classifying waste as organic or disposable. 
                It allows users to upload images, view history, and find disposal locations.
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
    aboutText: { fontSize: 18, textAlign: 'center' }
});

export default ContactUsScreen;