import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { IconButton, Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from './components/LoginScreen';
import Passenger from './components/Passenger/Passenger';
import TransitionScreen from './components/TransitionScreen';
import PassengerList from './components/Driver/PassengerList';
import { LoginContext } from './components/Context';
import DriverHomePage from './components/Driver/HomePage';

const Stack = createNativeStackNavigator();

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);

    return (
        <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
            <NavigationContainer>
                <PaperProvider>
                    <StatusBar style="auto" />
                    <Stack.Navigator
                        initialRouteName={loggedIn ? "Home" : "Login"}
                        screenOptions={{
                            headerShown: true,
                            headerTitleAlign: "center",
                            headerRight: () => (
                                <IconButton
                                    icon="exit-to-app"
                                    size={25}
                                    onPress={() => setLoggedIn(false)}
                                />
                            ),
                        }}
                    >
                    {loggedIn ?
                        <>
                            <Stack.Screen name="Home" component={TransitionScreen} />
                            <Stack.Screen name="DriverHomePage" component={DriverHomePage} />
                            <Stack.Screen name="PassengerList" component={PassengerList} />
                            <Stack.Screen name="Passenger" component={Passenger} />
                        </>
                        :
                        <>
                            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
                        </>
                    }
                    </Stack.Navigator>
                </PaperProvider>
            </NavigationContainer>
        </LoginContext.Provider>
    );
}