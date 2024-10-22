import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';

const ComplaintsScreen = () => {
    const [complaint, setComplaint] = useState('');
    const submitComplaint = () => {
        // Handle submission logic
        Alert.alert('Submitted', 'Your complaint has been submitted.');
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.textArea}
                placeholder="Enter your complaint"
                value={complaint}
                onChangeText={setComplaint}
                multiline
            />
            <Button title="Submit" onPress={submitComplaint} />
        </View>
    );
};

const styles = StyleSheet.create({ container: { flex: 1, padding: 10 }, textArea: { height: '30%', borderColor: 'gray', borderWidth: 1, marginBottom: 10, padding: 10 } });

export default ComplaintsScreen;