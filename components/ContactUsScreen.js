import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactUsScreen = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>Contact Us</Text>

            <Text style={styles.sectionTitle}>About the App</Text>
            <Text style={styles.aboutText}>
                This app helps users classify waste as organic or disposable. Users can upload images, view history, and locate disposal centers.
            </Text>

            <Text style={styles.sectionTitle}>Contact Information</Text>
            <View style={styles.contactInfo}>
                <Text style={styles.contactField}>Support Email:</Text>
                <Text style={styles.contactValue}>support@wasteclassifierapp.com</Text>
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactField}>Phone Number:</Text>
                <Text style={styles.contactValue}>+1 123-456-7890</Text>
            </View>
            <View style={styles.contactInfo}>
                <Text style={styles.contactField}>Address:</Text>
                <Text style={styles.contactValue}>123 Waste Management Street, Green City, Earth</Text>
            </View>

            <Text style={styles.sectionTitle}>Working Hours</Text>
            <Text style={styles.workingHours}>Monday - Friday: 9:00 AM to 6:00 PM</Text>
            <Text style={styles.workingHours}>Saturday: 10:00 AM to 4:00 PM</Text>
            <Text style={styles.workingHours}>Sunday: Closed</Text>

            <Text style={styles.footerText}>We are here to help you with any inquiries related to waste classification and disposal.</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: 20,
        backgroundColor: '#f5f5f5',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
    },
    aboutText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'left',
    },
    contactInfo: {
        marginVertical: 10,
    },
    contactField: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    contactValue: {
        fontSize: 16,
        marginTop: 2,
        color: '#555',
    },
    workingHours: {
        fontSize: 16,
        color: '#333',
        marginVertical: 5,
    },
    footerText: {
        fontSize: 16,
        color: '#777',
        marginTop: 30,
        textAlign: 'center',
        alignSelf: 'center',
    },
});

export default ContactUsScreen;
