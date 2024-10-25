import React, { useState } from 'react';
import { View, TextInput, Button, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from './config/FirebaseService';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState();
    const [success, setSuccess] = useState();
    const [isSignUp, setIsSignUp] = useState(false);

    const handleLogin = async () => {
        try {
            if (isSignUp) {
                await createUserWithEmailAndPassword(auth, email, password);
                setSuccess('Registration successful. You can now log in.');
                setError();
                setIsSignUp(false); // Switch back to login after registration
            } else {
                await signInWithEmailAndPassword(auth, email, password);
                setSuccess();
                setError();
                navigation.navigate('Home');
            }
        } catch (error) {
            setError(error.message);
            setSuccess();
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Image
                    source={require('../assets/waste-bins.jpg')}
                    style={styles.image}
                />
                <Text style={styles.title}>{isSignUp ? 'Register' : 'Waste Classifier'}</Text>
            </View>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            {error ? <Text style={styles.error}>{error}</Text> : null}
            {success ? <Text style={styles.success}>{success}</Text> : null}
            <Button title={isSignUp ? "Register" : "Login"} onPress={handleLogin} />
            <TouchableOpacity onPress={() => setIsSignUp(!isSignUp)}>
                <Text style={styles.switchText}>
                    {isSignUp ? "Already have an account? Log In" : "Don't have an account? Register"}
                </Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
    },
    input: {
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
    error: {
        color: 'red',
    },
    success: {
        color: 'green'
    },
    titleContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 40,
    },
    switchText: {
        marginTop: 20,
        color: '#0645AD',
        textAlign: 'center'
    },
});

export default LoginScreen;
