import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from './components/LoginScreen';
import Passenger from './components/Passenger';
import TransitionScreen from './components/TransitionScreen';
import Driver from './components/Driver';
const Stack = createNativeStackNavigator();

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <NavigationContainer>
            <PaperProvider>
                <StatusBar style="auto" />
                {/* {loggedIn ? <HomePage setLoggedIn={setLoggedIn} /> : <LoginScreen setLoggedIn={setLoggedIn} />} */}
                <Stack.Navigator initialRouteName="Transition" screenOptions={{
                        headerShown: true,
                        headerTitleAlign: "center",
                    }}>
                    {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
                    <Stack.Screen name="Home" component={TransitionScreen} />
                    <Stack.Screen name="Driver" component={Driver} />
                    <Stack.Screen name="Passenger" component={Passenger} />
                </Stack.Navigator>
            </PaperProvider>
        </NavigationContainer>
    );
}