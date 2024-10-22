import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomePage from '../components/HomePage';
import ScanScreen from '../components/ScanScreen';
import UploadScreen from '../components/UploadScreen';
import HistoryScreen from '../components/HistoryScreen';
import FindNearbyScreen from '../components/FindNearbyScreen';
import ComplaintsScreen from '../components/ComplaintsScreen';
import ContactUsScreen from '../components/ContactUsScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
    return (
        <Stack.Navigator initialRouteName="Home">
            <Stack.Screen name="Home" component={HomePage} />
            <Stack.Screen name="Scan" component={ScanScreen} />
            <Stack.Screen name="Upload" component={UploadScreen} />
            <Stack.Screen name="History" component={HistoryScreen} />
            <Stack.Screen name="FindNearby" component={FindNearbyScreen} />
            <Stack.Screen name="Complaints" component={ComplaintsScreen} />
            <Stack.Screen name="ContactUs" component={ContactUsScreen} />
        </Stack.Navigator>
    );
};

export default AppNavigator;
