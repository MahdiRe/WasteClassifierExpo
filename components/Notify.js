import React from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';

const Notify = ({ visible, text, header, onCancel, onSave, saveload, saveText, loadText }) => {
    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={onCancel}
        >
            <View style={styles.modalContainer}>
                <View style={styles.modalView}>
                    {header && <Text style={styles.modalText}><b>{header}</b></Text>}
                    <Text style={styles.modalText}>{text}</Text>

                    {saveload ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="large" color="#2196F3" />
                            <Text style={styles.loadingText}>{`${loadText || "Saving to DB"}...`}</Text>
                        </View>
                    ) : (
                        <View style={styles.modalButtons}>
                            {onCancel && (
                                <TouchableOpacity
                                    style={[styles.button, !onSave && styles.fullWidthButton]}
                                    onPress={onCancel}
                                    disabled={saveload}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            )}
                            {onSave && (
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={onSave}
                                    disabled={saveload}
                                >
                                    <Text style={styles.buttonText}>{saveText || "Save"}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalView: {
        width: 300,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        fontSize: 18,
        marginBottom: 15,
        textAlign: 'center',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    button: {
        backgroundColor: '#2196F3',
        padding: 10,
        borderRadius: 5,
        margin: 10,
        minWidth: 100,
        alignItems: 'center',
    },
    fullWidthButton: {
        width: '100%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingText: {
        marginLeft: 10,
        fontSize: 16,
    },
});

export default Notify;
