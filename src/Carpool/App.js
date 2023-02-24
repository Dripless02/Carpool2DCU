import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { IconButton, Provider as PaperProvider } from "react-native-paper";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "./components/LoginScreen";
import PassengerHomePage from "./components/Passenger/HomePage";
import TransitionScreen from "./components/TransitionScreen";
import PassengerList from "./components/Driver/PassengerList";
import { LoginContext, CurrentUserContext } from "./components/Context";
import DriverHomePage from "./components/Driver/HomePage";
import RegisterScreen from "./components/RegisterScreen";
import PassengerInfo from "./components/Driver/PassengerInfo";
import PassengerMap from "./components/Passenger/Passenger";
import PassengerAdvertise from "./components/Passenger/AdvertiseForm";
import PassengerHistory from "./components/Passenger/History";

const Stack = createNativeStackNavigator();

export default function App() {
    const [loggedIn, setLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState({loggedIn: false});

    return (
        <LoginContext.Provider value={[loggedIn, setLoggedIn]}>
            <NavigationContainer>
                <PaperProvider>
                    <StatusBar style="auto" />
                    <CurrentUserContext.Provider value={[currentUser, setCurrentUser]}>
                        <Stack.Navigator
                            initialRouteName={loggedIn ? "Home" : "Login"}
                            screenOptions={{
                                headerShown: true,
                                headerTitleAlign: "center",
                            }}
                        >
                            {loggedIn ?
                                <Stack.Group
                                    screenOptions={{
                                        headerRight: () => (
                                            <IconButton
                                                icon="exit-to-app"
                                                size={25}
                                                onPress={() => {setLoggedIn(false); setCurrentUser({loggedIn: false});}}
                                            />
                                        )
                                    }}
                                >
                                    <Stack.Screen name="Home" component={TransitionScreen} options={{ headerTitle: "" }} />

                                    {/* Driver Pages */}
                                    <Stack.Screen name="DriverHomePage" component={DriverHomePage} options={{ headerTitle: "Driver Home" }} />
                                    <Stack.Screen name="PassengerList" component={PassengerList} options={{ headerTitle: "Passenger List" }} />
                                    <Stack.Screen name="PassengerInfo" component={PassengerInfo} options={{ headerTitle: "Passenger Info" }} />

                                    {/* Passenger Pages */}
                                    <Stack.Screen name="PassengerHomePage" component={PassengerHomePage} options={{ headerTitle: "Passenger Home" }} />
                                    <Stack.Screen name="PassengerMap" component={PassengerMap} options={{ headerTitle: "Passenger Map" }} />
                                    <Stack.Screen name="PassengerAdvertise" component={PassengerAdvertise} options={{ headerTitle: "Advertise Ride" }} />
                                    <Stack.Screen name="PassengerHistory" component={PassengerHistory} options={{ headerTitle: "Previous Rides" }} />
                                </Stack.Group>
                                :
                                <Stack.Group
                                    screenOptions={{
                                        headerTransparent: true,
                                        headerTitle: "Carpool2DCU",
                                    }}
                                >
                                    <Stack.Screen name="Login" component={LoginScreen} />
                                    <Stack.Screen name="Register" component={RegisterScreen} />
                                </Stack.Group>
                            }
                        </Stack.Navigator>
                    </CurrentUserContext.Provider>
                </PaperProvider>
            </NavigationContainer>
        </LoginContext.Provider>
    );
}
