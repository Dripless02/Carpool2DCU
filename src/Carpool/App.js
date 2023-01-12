import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import HomePage from './components/HomePage';
import LoginScreen from './components/LoginScreen';

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <PaperProvider>
            <StatusBar style="auto" />
            {loggedIn ? <HomePage setLoggedIn={setLoggedIn} /> : <LoginScreen setLoggedIn={setLoggedIn} />}
        </PaperProvider>
    );
}