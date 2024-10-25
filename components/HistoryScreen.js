import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet } from 'react-native';
import FirebaseService from './config/FirebaseService';
import Notify from './common/Notify';
import CardList from './common/CardList';

const HistoryScreen = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [notifyMode, setNotifyMode] = useState("");
    const idToDelete = useRef(null);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        setNotifyMode('fetch')
        setOpen(true);
        setLoading(true);
        const imagesFromFirebase = await FirebaseService.getData('img-data');
        setImages(imagesFromFirebase);
        setOpen(false);
        setLoading(false);
    };

    const deleteImage = async () => {
        setLoading(true);
        await FirebaseService.delete('img-data', idToDelete.current);
        fetchImages();
    };

    const deleteAll = async () => {
        setLoading(true);
        await FirebaseService.deleteAll('img-data');
        fetchImages();
    }

    const btnClicked = (type, id) => {
        setOpen(true);
        setNotifyMode(type);
        idToDelete.current = id;
    }

    return (
        <View style={styles.container}>
            <CardList
                images={images}
                btnClicked={btnClicked}
            />

            <View style={styles.bottomContainer}>
                <Button title="Refresh Data" onPress={fetchImages} disabled={loading} />
                <Button title={`Delete All (${images.length || 0})`} onPress={() => btnClicked("Delete All")} disabled={images.length === 0} />
            </View>

            <Notify
                visible={open}
                text={notifyMode === 'fetch' ? "Fetching Data" : `Confirm Delete${notifyMode !== 'Delete' ? " All" : ""}?`}
                onCancel={notifyMode !== 'fetch' ? () => setOpen(false) : undefined}
                onSave={notifyMode === 'Delete' ? deleteImage : notifyMode === 'Delete All' ? deleteAll : undefined}
                saveload={loading}
                saveText={notifyMode}
                loadText={notifyMode === 'fetch' ? "Loading Data" : notifyMode === 'Delete' ? "Deleting Data" : "Deleting All Data"}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: 'lightgrey' },
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

export default HistoryScreen;
